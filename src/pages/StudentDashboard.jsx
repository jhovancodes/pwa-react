
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  onSnapshot
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "../dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    let unsubscribeStudents = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      unsubscribeStudents = onSnapshot(
        collection(db, "students"),
        (snapshot) => {
          if (!active) return;

          setStudents(
            snapshot.docs.map((studentDoc) => ({
              id: studentDoc.id,
              ...studentDoc.data()
            }))
          );

          setMessage("");
          setLoading(false);
        },
        (error) => {
          console.error("Unable to load student records:", error);

          if (active) {
            setMessage("Unable to load student records. Check your Firestore permissions.");
            setLoading(false);
          }
        }
      );
    });

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeStudents();
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

        {message && (
          <p className="dashboard-message">{message}</p>
        )}

        {!message && students.length === 0 && (
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
