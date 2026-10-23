
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "../dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribeStudents = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));

        if (!active) return;

        if (!snapshot.exists() || snapshot.data().role !== "admin") {
          navigate("/student-dashboard", { replace: true });
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

            setLoading(false);
          },
          (error) => {
            console.error("Unable to load students:", error);

            if (active) {
              setMessage("Unable to load students. Check your Firestore permissions.");
              setLoading(false);
            }
          }
        );
      } catch (error) {
        console.error("Unable to verify admin role:", error);

        if (active) {
          setMessage("Unable to verify admin access. Check your connection and Firestore permissions.");
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribeAuth();
      unsubscribeStudents();
    };
  }, [navigate]);

  async function handleDelete(student) {
    const confirmed = window.confirm(`Delete ${student.name}?`);

    if (!confirmed) return;

    setMessage("");

    try {
      await deleteDoc(doc(db, "students", student.id));
      setMessage("Student deleted.");
    } catch (error) {
      console.error("Unable to delete student:", error);
      setMessage("Unable to delete student. Check your Firestore permissions.");
    }
  }

  if (loading) {
    return <p>Checking admin access...</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h2>Welcome, Admin!</h2>
        <p>Manage your student records from your dashboard.</p>

        <h1>Student List</h1>

        <Link className="add-student-link" to="/add">
          Add Student
        </Link>

        {message && (
          <p className="dashboard-message">{message}</p>
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
