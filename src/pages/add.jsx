
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import "../dashboard.css";

function Add() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const newStudent = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      createdAt: serverTimestamp()
    };

    if (
      !newStudent.name ||
      !newStudent.email ||
      !newStudent.phone ||
      !newStudent.address
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (!auth.currentUser) {
      setMessage("Please log in before adding a student.");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "students"), newStudent);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("Unable to add student. Check your connection and Firestore permissions.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-wrapper">
        <h1>Add Student</h1>

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
              {saving ? "Saving..." : "Add Student"}
            </button>

            <Link to="/dashboard">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Add;
