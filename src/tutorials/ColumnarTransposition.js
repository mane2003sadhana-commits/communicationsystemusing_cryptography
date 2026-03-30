import React, { useState, useEffect } from "react";

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
      <div style={styles.overlay}></div>

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
    backgroundImage:
  "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')",
   backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(2,6,23,0.85), rgba(15,23,42,0.7))",
    top: 0,
    left: 0,
  },

 card: {
  position: "relative",
  backdropFilter: "blur(20px)",
  background: "linear-gradient(145deg, rgba(144, 147, 154, 0.85), rgba(98, 104, 112, 0.75))",
  borderRadius: "20px",
  padding: "32px",
  width: "420px",
  color: "#e2e8f0",

  // 🔥 Attractive glow + depth
  boxShadow:
    "0 10px 35px rgba(0,0,0,0.7), 0 0 20px rgba(56,189,248,0.25)",

  // ✨ subtle border glow
  border: "1px solid rgba(148,163,184,0.25)",

  // 💡 smooth animation
  transition: "all 0.4s ease",

  // 🔐 premium look
  overflow: "hidden",
},

title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "24px",
    color: "#38bdf8", // cyan highlight
    letterSpacing: "0.5px",
  },

  subheading: {
    marginTop: "15px",
    color: "#7dd3fc",
  },

  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#cbd5f5",
  },

  input: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.3)",
    outline: "none",
    background: "rgba(2,6,23,0.6)",
    color: "#f1f5f9",
    fontSize: "14px",
  },

  btnPrimary: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #22c55e, #15803d)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "0.3s",
    fontWeight: "500",
  },

  btnSecondary: {
    padding: "10px 18px",
    background: "linear-gradient(135deg, #3b82f6, #1e3a8a)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
    fontWeight: "500",
  },

  resultBox: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(2,6,23,0.7)",
    fontSize: "14px",
    border: "1px solid rgba(59,130,246,0.3)",
    color: "#e2e8f0",
  },
};