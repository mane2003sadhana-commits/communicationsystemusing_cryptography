import React, { useState, useEffect } from "react";
import Image from "../images/columnar.jpeg";

const ColumnarTransposition = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const encrypt = () => {
    if (!key) {
      alert("Please enter a key");
      return;
    }

    let message = text.replace(/\s/g, "").toUpperCase();
    let k = key.toUpperCase();

    const cols = k.length;
    const rows = Math.ceil(message.length / cols);

    let matrix = Array.from({ length: rows }, () =>
      Array(cols).fill("X")
    );

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (index < message.length) {
          matrix[r][c] = message[index++];
        }
      }
    }

    const keyOrder = k
      .split("")
      .map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char));

    let encrypted = "";
    keyOrder.forEach((k) => {
      for (let r = 0; r < rows; r++) {
        encrypted += matrix[r][k.i];
      }
    });

    setResult(encrypted);
  };

  const decrypt = () => {
    if (!key) {
      alert("Please enter a key");
      return;
    }

    let cipher = text.replace(/\s/g, "").toUpperCase();
    let k = key.toUpperCase();

    const cols = k.length;
    const rows = Math.ceil(cipher.length / cols);

    let matrix = Array.from({ length: rows }, () =>
      Array(cols).fill("")
    );

    const keyOrder = k
      .split("")
      .map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char));

    let index = 0;
    keyOrder.forEach((k) => {
      for (let r = 0; r < rows; r++) {
        if (index < cipher.length) {
          matrix[r][k.i] = cipher[index++];
        }
      }
    });

    let decrypted = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        decrypted += matrix[r][c];
      }
    }

    setResult(decrypted);
  };

  return (
    <div style={styles.page}>
      {/* 🔥 Blurred Background */}
      <div style={styles.background}></div>

      {/* Overlay */}
      <div style={styles.overlay}></div>

      {/* Card */}
      <div
        style={{
          ...styles.card,
          transform: mounted ? "translateY(0px)" : "translateY(40px)",
          opacity: mounted ? 1 : 0,
        }}
      >
        <h2 style={styles.title}>🔐 Columnar Transposition Cipher</h2>

        <h4 style={styles.subheading}>Introduction</h4>
        <p style={styles.text}>
          Columnar Transposition is a classical encryption technique where the
          message is written in rows under a keyword and read column-wise based
          on alphabetical order of the key.
        </p>

        <h4 style={styles.subheading}>Example</h4>
        <p style={styles.text}>
          Message: <b>HELLO WORLD</b><br />
          Key: <b>ZEBRA</b><br />
          Encrypted: <b>ODLREOHWLX</b>
        </p>

        <h4 style={styles.subheading}>Try It Yourself</h4>

        <textarea
          style={styles.input}
          placeholder="Enter message / cipher text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="text"
          style={styles.input}
          placeholder="Enter key (e.g. ZEBRA)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <div style={{ marginTop: "15px" }}>
          <button style={styles.btnPrimary} onClick={encrypt}>
            Encrypt
          </button>
          <button style={styles.btnSecondary} onClick={decrypt}>
            Decrypt
          </button>
        </div>

        {result && (
          <div style={styles.resultBox}>
            <b>Output:</b> {result}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColumnarTransposition;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  // 🔥 Blurred Background Layer
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${Image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
   filter: "blur(2px) brightness(1)",
    zIndex: 0,
  },

  // Dark overlay for readability
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    top: 0,
    left: 0,
    zIndex: 1,
  },

  // ✅ White Professional Card
  card: {
    position: "relative",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "30px",
    width: "420px",
    color: "#1f2937",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: "all 0.4s ease",
    zIndex: 2,
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "24px",
    color: "#1e3a8a",
    fontWeight: "600",
  },

  subheading: {
    marginTop: "15px",
    color: "#374151",
    fontWeight: "600",
  },

  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#4b5563",
  },

  input: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    background: "#f9fafb",
    color: "#111827",
    fontSize: "14px",
  },

  btnPrimary: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "500",
  },

  btnSecondary: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  resultBox: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f3f4f6",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    color: "#111827",
  },
};