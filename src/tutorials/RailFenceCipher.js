import React, { useState } from "react";
import BgImage from "../images/railfence.jpeg";

const RailFenceCipher = () => {
  const [text, setText] = useState("");
  const [rails, setRails] = useState(3);
  const [result, setResult] = useState("");

  const encrypt = () => {
    if (rails <= 1) {
      setResult(text);
      return;
    }

    let fence = Array.from({ length: rails }, () => []);
    let rail = 0;
    let dir = 1;

    for (let ch of text.replace(/\s/g, "")) {
      fence[rail].push(ch.toUpperCase());
      rail += dir;
      if (rail === 0 || rail === rails - 1) dir *= -1;
    }

    setResult(fence.flat().join(""));
  };

  const decrypt = () => {
    if (rails <= 1) {
      setResult(text);
      return;
    }

    let len = text.length;
    let fence = Array.from({ length: rails }, () =>
      Array(len).fill(null)
    );

    let rail = 0;
    let dir = 1;

    for (let i = 0; i < len; i++) {
      fence[rail][i] = "*";
      rail += dir;
      if (rail === 0 || rail === rails - 1) dir *= -1;
    }

    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < len; c++) {
        if (fence[r][c] === "*" && index < len) {
          fence[r][c] = text[index++];
        }
      }
    }

    let resultText = "";
    rail = 0;
    dir = 1;

    for (let i = 0; i < len; i++) {
      resultText += fence[rail][i];
      rail += dir;
      if (rail === 0 || rail === rails - 1) dir *= -1;
    }

    setResult(resultText);
  };

  return (
    <div style={styles.page}>
      {/* ✅ Background */}
      <div style={styles.background}></div>

      {/* Optional blobs (light effect) */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      {/* Content */}
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h2 style={styles.title}>🚆 Rail Fence Cipher</h2>

          <h4 style={styles.heading}>Introduction</h4>
          <p style={styles.text}>
            Rail Fence Cipher is a transposition cipher where the message is written
            in a zig-zag pattern across multiple rails and then read row by row.
          </p>

          <h4 style={styles.heading}>Example</h4>
          <p style={styles.text}>
            Message: <b>HELLO WORLD</b><br />
            Rails: <b>3</b><br />
            Encrypted: <b>HOLELWRDLO</b>
          </p>

          <h4 style={styles.heading}>Try It Yourself</h4>

          <textarea
            style={styles.input}
            placeholder="Enter your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="number"
            style={styles.input}
            value={rails}
            min="2"
            onChange={(e) => setRails(Number(e.target.value))}
          />

          <div style={styles.btnContainer}>
            <button style={styles.encryptBtn} onClick={encrypt}>
              Encrypt
            </button>
            <button style={styles.decryptBtn} onClick={decrypt}>
              Decrypt
            </button>
          </div>

          {result && (
            <div style={styles.resultBox}>
              <b>Output:</b>
              <p style={styles.resultText}>{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RailFenceCipher;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  // ✅ Clean background (no repeat, no overlap)
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${BgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "blur(2px) brightness(0.95)",
    zIndex: 0,
  },

  // ✅ NO backdrop blur (important fix)
  overlay: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.15)",
    position: "relative",
    zIndex: 2,
  },

  // ✅ White card
  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "30px",
    borderRadius: "16px",
    background: "#ffffff",
    color: "#1f2937",
    boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "26px",
    color: "#1e3a8a",
  },

  heading: {
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
    marginTop: "12px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    background: "#f9fafb",
    color: "#111827",
  },

  btnContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },

  encryptBtn: {
    padding: "10px 20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  decryptBtn: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  resultBox: {
    marginTop: "20px",
    padding: "12px",
    background: "#f3f4f6",
    borderRadius: "10px",
  },

  resultText: {
    marginTop: "5px",
    fontWeight: "bold",
    color: "#111827",
  },

  // subtle blobs
  blob1: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "rgba(99,102,241,0.15)",
    filter: "blur(70px)",
    top: "-60px",
    left: "-60px",
    borderRadius: "50%",
    zIndex: 1,
  },

  blob2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "rgba(34,197,94,0.15)",
    filter: "blur(70px)",
    bottom: "-60px",
    right: "-60px",
    borderRadius: "50%",
    zIndex: 1,
  },
};