import {
    useEffect,
    useState
} from "react";

import {
    onAuthStateChanged
} from "firebase/auth";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    auth
} from "../firebase/firebase";

import "../dashboard.css";


function Add() {

    const navigate = useNavigate();


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

                    }

                }
            );


        return unsubscribe;

    }, [navigate]);


    function handleSubmit(event) {

        event.preventDefault();

        setMessage("");


        const students =
            getStudents();


        const newStudent = {

            id:
                Date.now().toString(),

            name:
                name.trim(),

            email:
                email.trim(),

            phone:
                phone.trim(),

            address:
                address.trim()

        };


        if (
            !newStudent.name ||
            !newStudent.email ||
            !newStudent.phone ||
            !newStudent.address
        ) {

            setMessage(
                "Please fill in all fields."
            );

            return;

        }


        students.push(
            newStudent
        );


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


    return (

        <div className="form-page">

            <div className="form-wrapper">

                <h1>
                    Add Student
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
                            Add Student
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


export default Add;