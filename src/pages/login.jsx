import { useEffect, useState } from "react";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    setPersistence,
    browserSessionPersistence
} from "firebase/auth";

import {
    auth,
    googleProvider
} from "../firebase/firebase";

import {
    useNavigate
} from "react-router-dom";

import "../login.css";


function Login() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loginMessage, setLoginMessage] =
        useState("");


    useEffect(() => {

        async function prepareLoginPage() {

            try {

                await signOut(auth);

                await setPersistence(
                    auth,
                    browserSessionPersistence
                );

            } catch (error) {

                console.error(
                    "Authentication setup error:",
                    error
                );

            }

        }


        prepareLoginPage();

    }, []);


    async function handleLogin(event) {

        event.preventDefault();

        setLoginMessage("");


        try {

            await setPersistence(
                auth,
                browserSessionPersistence
            );


            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );


            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Email login error:",
                error
            );


            setLoginMessage(
                "The email or password you entered is incorrect."
            );

        }

    }


    async function handleGoogleLogin() {

        setLoginMessage("");


        try {

            await setPersistence(
                auth,
                browserSessionPersistence
            );


            await signInWithPopup(
                auth,
                googleProvider
            );


            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Google login error:",
                error
            );


            if (
                error.code ===
                "auth/popup-blocked"
            ) {

                setLoginMessage(
                    "Google login was blocked by your browser."
                );

            } else if (
                error.code ===
                "auth/popup-closed-by-user"
            ) {

                setLoginMessage(
                    "Google login was cancelled."
                );

            } else {

                setLoginMessage(
                    "Unable to sign in with Google."
                );

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
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                        />

                        <i className="bx bxs-envelope"></i>

                    </div>


                    <div className="input-box">

                        <input
                            id="password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                        />

                        <i className="bx bxs-lock-alt"></i>

                    </div>


                    <div className="remember-forgot">

                        <label htmlFor="show-password">

                            <input
                                id="show-password"
                                type="checkbox"
                                checked={showPassword}
                                onChange={(event) =>
                                    setShowPassword(
                                        event.target.checked
                                    )
                                }
                            />

                            Show password

                        </label>

                    </div>


                    <p className="login-message">
                        {loginMessage}
                    </p>


                    <button
                        className="login-button"
                        type="submit"
                    >
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

                        <span>
                            Continue with Google
                        </span>

                    </button>

                </form>

            </main>

        </div>

    );

}


export default Login;