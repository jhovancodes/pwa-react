import {
    useEffect,
    useState
} from "react";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    auth
} from "../firebase/firebase";

import "../dashboard.css";


function Edit() {

    const navigate = useNavigate();


    const [
        searchParams
    ] = useSearchParams();


    const studentId =
        searchParams.get("id");


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [address, setAddress] =
        useState("");


    const [message, setMessage] =
        useState("");


    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (user) => {

                    if (!user) {

                        navigate(
                            "/login",
                            {
                                replace: true
                            }
                        );

                        return;

                    }


                    if (!studentId) {

                        navigate(
                            "/dashboard",
                            {
                                replace: true
                            }
                        );

                        return;

                    }


                    const students =
                        getStudents();


                    const student =
                        students.find(
                            (item) =>
                                String(
                                    item.id
                                ) ===
                                String(
                                    studentId
                                )
                        );


                    if (!student) {

                        navigate(
                            "/dashboard",
                            {
                                replace: true
                            }
                        );

                        return;

                    }


                    setName(
                        student.name || ""
                    );

                    setEmail(
                        student.email || ""
                    );

                    setPhone(
                        student.phone || ""
                    );

                    setAddress(
                        student.address || ""
                    );

                }
            );


        return unsubscribe;

    }, [
        navigate,
        studentId
    ]);


    function getStudents() {

        try {

            const students =
                JSON.parse(
                    localStorage.getItem(
                        "students"
                    ) || "[]"
                );


            return Array.isArray(
                students
            )
                ? students
                : [];

        } catch {

            return [];

        }

    }


    function handleSubmit(event) {

        event.preventDefault();

        setMessage("");


        if (!studentId) {

            setMessage(
                "Student not found."
            );

            return;

        }


        const students =
            getStudents();


        const index =
            students.findIndex(
                (student) =>
                    String(
                        student.id
                    ) ===
                    String(
                        studentId
                    )
            );


        if (index === -1) {

            setMessage(
                "Student not found."
            );

            return;

        }


        students[index] = {

            ...students[index],

            name:
                name.trim(),

            email:
                email.trim(),

            phone:
                phone.trim(),

            address:
                address.trim()

        };


        localStorage.setItem(
            "students",
            JSON.stringify(
                students
            )
        );


        navigate(
            "/dashboard"
        );

    }


    return (

        <div className="form-page">

            <div className="form-wrapper">

                <h1>
                    Edit Student
                </h1>


                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(event) =>
                            setName(
                                event.target.value
                            )
                        }
                        required
                    />


                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        required
                    />


                    <input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(event) =>
                            setPhone(
                                event.target.value
                            )
                        }
                        required
                    />


                    <textarea
                        placeholder="Address"
                        value={address}
                        onChange={(event) =>
                            setAddress(
                                event.target.value
                            )
                        }
                        required
                    />


                    {message && (

                        <p className="form-message">
                            {message}
                        </p>

                    )}


                    <div className="btn-box">

                        <button
                            type="submit"
                        >
                            Save Changes
                        </button>


                        <Link
                            to="/dashboard"
                        >
                            Cancel
                        </Link>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default Edit;