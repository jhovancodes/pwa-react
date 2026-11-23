
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "../dashboard.css";

function Edit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      if (!studentId) {
        navigate("/dashboard", { replace: true });
        return;
      }

      try {
        const studentRef = doc(db, "students", studentId);
        const studentSnapshot = await getDoc(studentRef);

        if (!active) return;

        if (!studentSnapshot.exists()) {
          setMessage("Student record not found.");
          setLoading(false);
          return;
        }

        const student = studentSnapshot.data();

        setName(student.name || "");
        setEmail(student.email || "");
        setPhone(student.phone || "");
        setAddress(student.address || "");
        setLoading(false);
      } catch (error) {
        console.error("Error loading student:", error);

        if (active) {
          setMessage("Unable to load student. Check your Firestore permissions.");
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigate, studentId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!studentId) {
      setMessage("Student ID is missing.");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "students", studentId), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim()
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating student:", error);
      setMessage("Unable to update student. Check your Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading student information...</p>;
  }

  return (
    <div className="form-page">
      <div className="form-wrapper">
        <h1>Edit Student</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />

          {message && (
            <p className="form-message">{message}</p>
          )}

          <div className="btn-box">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link to="/dashboard">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit;
