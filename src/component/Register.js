import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, rtdb } from "../Firebaseconfig"; // ✅ use rtdb

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "380px",
    padding: "35px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    textAlign: "center",
  },
  logo: { fontSize: "40px", marginBottom: "10px" },
  title: { marginBottom: "6px", color: "#1e293b" },
  subtitle: { fontSize: "14px", color: "#64748b", marginBottom: "25px" },
  input: {
    width: "100%",
    height: "45px",
    padding: "0 12px",
    marginBottom: "14px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  select: {
    width: "100%",
    height: "45px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    padding: "0 12px",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    height: "45px",
    marginTop: "10px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  text: { marginTop: "18px", fontSize: "14px", color: "#475569" },
  link: { color: "#2563eb", cursor: "pointer", fontWeight: "600" },
};

function Register() {
  const navigate = useNavigate();

  const [fullname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role] = useState("user");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!fullname || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Create auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCred.user.uid;
      const userRole = role.toLowerCase();

      // 2️⃣ Store user data in Realtime Database
      await set(ref(rtdb, "users/" + uid), {
        fullname,
        email,
        role: userRole,
        createdAt: Date.now(),
      });

      

      // 4️⃣ Save role locally (optional)
      localStorage.setItem("role", userRole);

      // 5️⃣ Redirect
      // ✅ after successful registration
setSuccess("Registration successful! Please login.");

// redirect ONLY to login
// setTimeout(() => {
//   navigate("/login");
// }, 1500);


    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>📝</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register to use secure communication</p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          style={styles.input}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {/* <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
