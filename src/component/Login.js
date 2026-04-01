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
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    localStorage.removeItem("role");

    if (!email || !password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;
      const snapshot = await get(ref(rtdb, `users/${uid}`));

      if (!snapshot.exists()) {
        setError("User data not found");
        setLoading(false);
        return;
      }

      const role = snapshot.val()?.role?.toLowerCase();

      if (!role) {
        setError("User role missing");
        setLoading(false);
        return;
      }

      localStorage.setItem("role", role);

      setTimeout(() => {
        navigate(role === "admin" ? "/admindashboard" : "/userdashboard");
      }, 1200); // smoother feel

    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 🔥 FULL SCREEN LOADER */}
      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Logging you in...</p>
        </div>
      )}

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

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
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

/* ===== STYLES ===== */
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
    borderRadius: "16px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    textAlign: "center",
    transition: "0.3s",
  },

  logo: { fontSize: "44px", marginBottom: "10px" },
  title: { marginBottom: "5px", color: "#1e293b" },
  subtitle: { marginBottom: "25px", color: "#64748b", fontSize: "14px" },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
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
  },

  toggle: { cursor: "pointer", fontSize: "18px", paddingRight: "10px" },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  text: { marginTop: "18px", fontSize: "14px", color: "#475569" },

  /* 🔥 LOADER OVERLAY */
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(6px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  /* 🔥 SPINNER */
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #e5e7eb",
    borderTop: "6px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "15px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
  },
};

/* 🔥 KEYFRAMES */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`, styleSheet.cssRules.length);

export default Login;