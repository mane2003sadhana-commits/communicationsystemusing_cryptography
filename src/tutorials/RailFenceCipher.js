import React, { useState } from "react";
import BgImage from "../images/railfence.jpeg";
import { useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../Firebaseconfig";

const RailFenceCipher = () => {
  const [text, setText] = useState("");
  const [rails, setRails] = useState(3);
  const [result, setResult] = useState("");

  const [tutorial, setTutorial] = useState(null);
  useEffect(() => {
  const tutorialRef = ref(rtdb, "tutorials/railfence");

  onValue(tutorialRef, (snapshot) => {
    if (snapshot.exists()) {
      setTutorial(snapshot.val());
    }
  });
}, []);

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
    <div style={styles.overlay}></div>

    <div style={styles.card}>
      <h2 style={styles.title}>🚆 Rail Fence Cipher Tool</h2>

     <h4 style={styles.subheading}>Introduction</h4>
<p style={{ whiteSpace: "pre-line" }}>
  {tutorial?.introduction}
</p>

<h4 style={styles.subheading}>Example</h4>
<p style={{ whiteSpace: "pre-line" }}>
  {tutorial?.example}
</p>

<h4 style={styles.subheading}>Working</h4>
<p style={{ whiteSpace: "pre-line" }}>
  {tutorial?.working}
</p>
      <h4 style={styles.subheading}>Try It Yourself</h4>

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

export default RailFenceCipher;
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${BgImage})`,
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