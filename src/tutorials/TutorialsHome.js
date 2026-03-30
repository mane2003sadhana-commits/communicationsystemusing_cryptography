import React from "react";

const TutorialsHome = ({ onSelect }) => {
  return (
    <div style={styles.container}>
      
      {/* 🔥 Innovative Heading */}
      <div style={styles.titleBox}>
        <span style={styles.icon}>🔐</span>
        <span style={styles.mainTitle}>Cryptography Lab</span>
        <div style={styles.subtitle}>
          Learn • Encrypt • Secure Communication
        </div>
      </div>

      <div style={styles.grid}>
        
        <div
          style={styles.card}
          onClick={() => onSelect("caesar")}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          Caesar Cipher
        </div>       

        <div
          style={styles.card}
          onClick={() => onSelect("vigener")}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          Vigenere Cipher
        </div>

        <div
          style={styles.card}
          onClick={() => onSelect("railfence")}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          Rail Fence Cipher
        </div>

        <div
          style={styles.card}
          onClick={() => onSelect("columnar")}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
        >
          Columnar Transposition
        </div>

      </div>
    </div>
  );
};

export default TutorialsHome;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "20px",
  },

  /* 🔥 Innovative Heading */
  titleBox: {
    textAlign: "center",
    marginBottom: "25px",
    padding: "15px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb, #22c55e)",
    color: "#fff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
  },

  icon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "5px",
  },

  mainTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  subtitle: {
    fontSize: "13px",
    marginTop: "5px",
    opacity: 0.9,
  },

  /* 🔥 Grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },

  /* 🔥 Cards */
  card: {
    padding: "25px",
    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    borderRadius: "14px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#1e293b",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
};

/* ================= HOVER ================= */

const hoverIn = (e) => {
  e.currentTarget.style.transform = "translateY(-6px)";
  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
};

const hoverOut = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
};