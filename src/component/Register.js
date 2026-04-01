import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, rtdb } from "../Firebaseconfig";

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

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
    fontSize: "13px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "10px",
    fontSize: "13px",
  },
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
  const [loading, setLoading] = useState(false); // ✅ NEW

  const validate = () => {
    if (!fullname.trim()) return "Full name is required";

    if (!/^[A-Za-z ]{3,}$/.test(fullname))
      return "Name must be at least 3 characters and only letters";

    if (!email) return "Email is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Enter a valid email address";

    if (!password) return "Password is required";

    if (password.length < 6)
      return "Password must be at least 6 characters";

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least 1 special symbol";

    if (!/[0-9]/.test(password))
      return "Password must contain at least 1 number";

    if (password !== confirm) return "Passwords do not match";

    return null;
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCred.user.uid;
      const userRole = role.toLowerCase();

      await set(ref(rtdb, "users/" + uid), {
        fullname,
        email,
        role: userRole,
        createdAt: Date.now(),
      });

      localStorage.setItem("role", userRole);

      setSuccess("🎉 Registration successful! Please login.");

      // optional redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>📝</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Register to use secure communication</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

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

        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
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