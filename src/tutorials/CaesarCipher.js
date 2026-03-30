import React, { useState } from "react";

const CaesarCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState(3);
  const [result, setResult] = useState("");

  const encrypt = () => {
    const encrypted = text
      .toUpperCase()
      .split("")
      .map((c) => {
        if (c < "A" || c > "Z") return c;
        return String.fromCharCode(
          ((c.charCodeAt(0) - 65 + Number(key)) % 26) + 65
        );
      })
      .join("");

    setResult(encrypted);
  };

  const decrypt = () => {
    const decrypted = text
      .toUpperCase()
      .split("")
      .map((c) => {
        if (c < "A" || c > "Z") return c;
        return String.fromCharCode(
          ((c.charCodeAt(0) - 65 - Number(key) + 26) % 26) + 65
        );
      })
      .join("");

    setResult(decrypted);
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Caesar Cipher Tool</h2>

        <h4 style={styles.subheading}>Introduction</h4>
        <p style={styles.text}>
          Caesar Cipher is one of the simplest and oldest encryption techniques.
          Each letter is shifted by a fixed number of positions.
        </p>

        <h4 style={styles.subheading}>Example</h4>
        <p style={styles.text}>
          Message: <b>HELLO</b><br />
          Key: <b>3</b><br />
          Encrypted: <b>KHOOR</b>
        </p>

        <h4 style={styles.subheading}>Try It Yourself</h4>

        <textarea
          style={styles.input}
          placeholder="Enter message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="number"
          style={styles.input}
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <div style={styles.buttonGroup}>
          <button style={styles.btn} onClick={encrypt}>
            🔒 Encrypt
          </button>
          <button style={styles.btnSecondary} onClick={decrypt}>
            🔓 Decrypt
          </button>
        </div>

        {result && (
          <div style={styles.outputBox}>
            <span style={styles.outputLabel}>Result</span>
            <p style={styles.outputText}>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaesarCipher;
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1510519138101-570d1dca3d66')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(170, 163, 163, 0.75)", // LIGHT overlay (important)
    zIndex: 0,
  },

  card: {
    width: "450px",
    padding: "35px",
    borderRadius: "18px",
    background: "#f9fafb",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    color: "#1f2937",
    position: "relative",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#1e3a8a",
  },

  subheading: {
    marginTop: "18px",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: "600",
  },

  text: {
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: "1.6",
  },

  input: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    background: "#f9fafb",
    color: "#111827",
  },

  buttonGroup: {
    marginTop: "18px",
    display: "flex",
    gap: "12px",
  },

  btn: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  btnSecondary: {
    flex: 1,
    padding: "12px",
    background: "linear-gradient(135deg, #059669, #047857)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  outputBox: {
    marginTop: "22px",
    padding: "18px",
    borderRadius: "12px",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
  },

  outputLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },

  outputText: {
    marginTop: "6px",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontSize: "16px",
    color: "#111827",
  },
};