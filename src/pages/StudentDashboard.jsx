
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import "../dashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const stored = JSON.parse(
                    localStorage.getItem("students") || "[]"
                );

                if (active) {
                    setStudents(Array.isArray(stored) ? stored : []);
                }
            } catch {
                if (active) {
                    setStudents([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, [navigate]);

    async function handleLogout() {
        await signOut(auth);
        navigate("/login", { replace: true });
    }

    if (loading) {
        return <p>Loading student records...</p>;
    }

    return (
        <div className="dashboard-page student-dashboard">
            <div className="container">
                <h2>Hello, Student!</h2>
                <p>Welcome! You can view the student records below.</p>

                <h1>Student List</h1>

                <button type="button" onClick={handleLogout}>
                    Logout
                </button>

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
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phone}</td>
                                    <td>{student.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
