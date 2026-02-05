import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, rtdb } from "../Firebaseconfig";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    localStorage.removeItem("role"); // ✅ prevent stale role

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      // 1️⃣ Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // 2️⃣ Get user data from Realtime Database
      const snapshot = await get(ref(rtdb, `users/${uid}`));

      if (!snapshot.exists()) {
        setError("User data not found");
        return;
      }

      const userData = snapshot.val();
      const role = userData?.role?.toLowerCase();

      if (!role) {
        setError("User role missing");
        return;
      }

      // 3️⃣ Store role locally
      localStorage.setItem("role", role);

      // 4️⃣ Redirect based on role
     if (role === "admin") {
  navigate("/admindashboard");
} else {
  navigate("/userdashboard");
}


    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🔐</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email address"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={styles.passwordBox}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={styles.passwordInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            style={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.text}>
          New user?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

/* ===== STYLES (UNCHANGED) ===== */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    width: "360px",
    borderRadius: "14px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logo: { fontSize: "42px", marginBottom: "10px" },
  title: { marginBottom: "5px", color: "#1e293b" },
  subtitle: { marginBottom: "25px", color: "#64748b", fontSize: "14px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },
  passwordBox: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  passwordInput: {
    flex: 1,
    padding: "12px",
    border: "none",
    fontSize: "15px",
    outline: "none",
  },
  toggle: { cursor: "pointer", fontSize: "18px", paddingRight: "10px" },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  text: { marginTop: "18px", fontSize: "14px", color: "#475569" },
};

export default Login;
