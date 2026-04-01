import React, { useState } from "react";
import Image from "../images/columnar.jpeg";

const ColumnarTransposition = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

 
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
    <div style={styles.overlay}></div>

    <div style={styles.card}>
      <h2 style={styles.title}>🔐 Columnar Transposition Cipher</h2>

      <h4 style={styles.subheading}>Introduction</h4>
      <p style={styles.text}>
        Columnar Transposition Cipher is a technique where the message is written
        in rows under a keyword and then read column-wise based on alphabetical order
        of the key.
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
// Columnar Transposition is a classical encryption technique where the
//           message is written in rows under a keyword and read column-wise based
//           on alphabetical order of the key.
export default ColumnarTransposition;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${Image})`,
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
    background: "rgba(170, 163, 163, 0.75)",
    zIndex: 0,
  },

  card: {
    width: "380px",
    padding: "25px",
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
    fontSize: "22px",
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
    padding: "10px",
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
    padding: "10px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  btnSecondary: {
    flex: 1,
    padding: "10px",
    background: "linear-gradient(135deg, #059669, #047857)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  outputBox: {
    marginTop: "22px",
    padding: "16px",
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
    fontSize: "15px",
    color: "#111827",
  },
};