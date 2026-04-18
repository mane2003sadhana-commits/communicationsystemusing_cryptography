import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUserShield } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

function Landingpg() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          🔒 Secure Communication System Using Cryptography
        </h1>
        <p style={styles.subtitle}>
          MCA Mini Project | React JS & Firebase
        </p>
      </header>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Protect Your Messages with Cryptography
        </h2>

        <p style={styles.heroText}>
          This application demonstrates how secure communication is achieved
          using classical and modern cryptographic techniques. Users can
          encrypt messages using selected algorithms and securely share them
          with authorized receivers.
        </p>

        <button
          style={styles.startBtn}
          onClick={() => navigate("/login")}
        >
          Start Project
        </button>
      </section>

      {/* FEATURES SECTION */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Project Highlights</h2>

        <div style={styles.cardContainer}>
          
          <div style={styles.card}>
            <MdSecurity size={35} color="#2563eb" />
            <h3>Multiple Encryption Techniques</h3>
            <p>
              Caesar Cipher, Rail Fence, Columnar Transposition,
              algorithms implemented.
            </p>
          </div>

          <div style={styles.card}>
            <FaLock size={35} color="#2563eb" />
            <h3>Secure Message Sharing</h3>
            <p>
              Messages are encrypted before sending and decrypted
              only by the authorized receiver.
            </p>
          </div>

          <div style={styles.card}>
            <FaUserShield size={35} color="#2563eb" />
            <h3>Admin & User Dashboards</h3>
            <p>
              Separate dashboards for admin and users including
              monitoring and reports.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 MCA Mini Project</p>
        <p>Secure Communication System Using Cryptography</p>
        <p>Developed using React JS & Firebase</p>
      </footer>

    </div>
  );
}


/* ================== STYLES ================== */

const styles = {
  container: {
    fontFamily: "Segoe UI, Arial, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },

  header: {
    background: "linear-gradient(90deg, #0f172a, #1e40af)",
    color: "#fff",
    padding: "35px 20px",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: "10px",
    fontSize: "16px",
    opacity: 0.9,
  },

  hero: {
    padding: "70px 20px",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },

  heroTitle: {
    fontSize: "30px",
    color: "#1e293b",
  },

  heroText: {
    maxWidth: "700px",
    margin: "20px auto",
    fontSize: "17px",
    color: "#475569",
    lineHeight: "1.6",
  },

  startBtn: {
    marginTop: "25px",
    padding: "14px 45px",
    fontSize: "16px",
    background: "linear-gradient(90deg,#2563eb,#3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(37,99,235,0.3)",
    transition: "0.3s",
  },

  features: {
    padding: "60px 20px",
    backgroundColor: "#f1f5f9",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "40px",
    color: "#0f172a",
  },

  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "25px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "25px",
    width: "280px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  footer: {
    backgroundColor: "#0f172a",
    color: "#e5e7eb",
    textAlign: "center",
    padding: "25px",
    fontSize: "14px",
  },
};

export default Landingpg;