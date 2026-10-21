
import { useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    setPersistence,
    browserSessionPersistence
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import {
    auth,
    googleProvider,
    db
} from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    useEffect(() => {
        async function prepareLoginPage() {
            try {
                await signOut(auth);
                await setPersistence(auth, browserSessionPersistence);
            } catch (error) {
                console.error("Authentication setup error:", error);
            }
        }

        prepareLoginPage();
    }, []);

    async function redirectByRole(user) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                role: "student",
                lastLogin: serverTimestamp()
            });

            navigate("/student-dashboard", { replace: true });
            return;
        }

        const userData = userSnapshot.data();

        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            lastLogin: serverTimestamp()
        }, { merge: true });

        if (userData.role === "admin") {
            navigate("/dashboard", { replace: true });
        } else if (userData.role === "student") {
            navigate("/student-dashboard", { replace: true });
        } else {
            await signOut(auth);
            setLoginMessage("Your account has no valid role. Please contact the administrator.");
        }
    }

    async function handleLogin(event) {
        event.preventDefault();
        setLoginMessage("");

        try {
            await setPersistence(auth, browserSessionPersistence);

            const result = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            await redirectByRole(result.user);
        } catch (error) {
            console.error("Email login error:", error);
            setLoginMessage(
                "Login failed. Check your email, password, and account permissions."
            );
        }
    }

    async function handleGoogleLogin() {
        setLoginMessage("");

        try {
            await setPersistence(auth, browserSessionPersistence);

            const result = await signInWithPopup(
                auth,
                googleProvider
            );

            await redirectByRole(result.user);
        } catch (error) {
            console.error("Google login error:", error);

            if (error.code === "auth/popup-blocked") {
                setLoginMessage("Google login was blocked by your browser.");
            } else if (error.code === "auth/popup-closed-by-user") {
                setLoginMessage("Google login was cancelled.");
            } else {
                setLoginMessage("Unable to sign in. Check your account and Firestore permissions.");
            }
        }
    }

    return (
        <div className="login-page">
            <main className="login-container">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>

                    <div className="input-box">
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <i className="bx bxs-envelope"></i>
                    </div>

                    <div className="input-box">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>

                    <div className="remember-forgot">
                        <label htmlFor="show-password">
                            <input
                                id="show-password"
                                type="checkbox"
                                checked={showPassword}
                                onChange={(event) => setShowPassword(event.target.checked)}
                            />
                            Show password
                        </label>
                    </div>

                    <p className="login-message">{loginMessage}</p>

                    <button className="login-button" type="submit">
                        Login
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button
                        id="google-login"
                        type="button"
                        onClick={handleGoogleLogin}
                    >
                        <i className="bx bxl-google"></i>
                        <span>Continue with Google</span>
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;
