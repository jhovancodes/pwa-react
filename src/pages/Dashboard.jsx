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


function Dashboard() {

    const navigate = useNavigate();

    const [students, setStudents] =
        useState([]);

    const [message, setMessage] =
        useState("");


    function getStudents() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(
                        "students"
                    ) || "[]"
                );


            return Array.isArray(stored)
                ? stored
                : [];

        } catch {

            return [];

        }

    }


    function loadStudents() {

        setStudents(
            getStudents()
        );

    }


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


                    loadStudents();

                }
            );


        return unsubscribe;

    }, [navigate]);


    function handleDelete(student) {

        const confirmed =
            window.confirm(
                `Delete ${student.name}?`
            );


        if (!confirmed) {

            return;

        }


        const remaining =
            students.filter(
                (item) =>
                    item.id !== student.id
            );


        localStorage.setItem(
            "students",
            JSON.stringify(
                remaining
            )
        );


        setStudents(
            remaining
        );


        setMessage(
            "Student deleted."
        );

    }


    return (

        <div className="dashboard-page">

            <div className="container">

                <h1>
                    Student List
                </h1>


                <Link
                    className="add-student-link"
                    to="/add"
                >
                    Add Student
                </Link>


                {message && (

                    <p className="dashboard-message">
                        {message}
                    </p>

                )}


                {students.length === 0 && (
                    <p className="empty-message">
                        No students have been added yet.
                    </p>
                )}

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phone}</td>
                                    <td>{student.address}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                className="btn-edit"
                                                to={`/edit?id=${encodeURIComponent(student.id)}`}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="btn-delete"
                                                type="button"
                                                onClick={() => handleDelete(student)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>

    );

}


export default Dashboard;