import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgImage from "../images/vigenere.jpeg"; // ✅ your image

const VigenereCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const generateKey = (text, key) => {
    key = key.toUpperCase().replace(/[^A-Z]/g, "");
    if (!key) return "";

    let newKey = "";
    let j = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] >= "A" && text[i] <= "Z") {
        newKey += key[j % key.length];
        j++;
      } else {
        newKey += text[i];
      }
    }
    return newKey;
  };

  const encrypt = () => {
    let upperText = text.toUpperCase();
    let newKey = generateKey(upperText, key);
    let output = "";

    for (let i = 0; i < upperText.length; i++) {
      let t = upperText[i];
      let k = newKey[i];

      if (t < "A" || t > "Z") {
        output += t;
      } else {
        let encryptedChar = String.fromCharCode(
          ((t.charCodeAt(0) - 65 + (k.charCodeAt(0) - 65)) % 26) + 65
        );
        output += encryptedChar;
      }
    }

    setResult(output);
  };

  const decrypt = () => {
    let upperText = text.toUpperCase();
    let newKey = generateKey(upperText, key);
    let output = "";

    for (let i = 0; i < upperText.length; i++) {
      let t = upperText[i];
      let k = newKey[i];

      if (t < "A" || t > "Z") {
        output += t;
      } else {
        let decryptedChar = String.fromCharCode(
          ((t.charCodeAt(0) - 65 - (k.charCodeAt(0) - 65) + 26) % 26) + 65
        );
        output += decryptedChar;
      }
    }

    setResult(output);
  };

  return (
    <div style={styles.page}>
      {/* ✅ Background Layer */}
      <div style={styles.background}></div>

      <div style={styles.overlay}>
        <div style={styles.card}>

          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2 style={styles.title}>🔐 Vigenère Cipher Tool</h2>

          <h4 style={styles.heading}>Introduction</h4>
          <p style={styles.text}>
            Vigenère Cipher is a polyalphabetic substitution cipher using a keyword
            to apply multiple Caesar shifts.
          </p>

          <h4 style={styles.heading}>Example</h4>
          <p style={styles.text}>
            Message: <b>HELLO</b><br />
            Key: <b>KEY</b><br />
            Encrypted: <b>RIJVS</b>
          </p>

          <h4 style={styles.heading}>Try It Yourself</h4>

          <textarea
            style={styles.input}
            placeholder="Enter your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="text"
            style={styles.input}
            placeholder="Enter secret key..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
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
              <p><b>Output:</b></p>
              <p style={styles.resultText}>{result}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VigenereCipher;

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Poppins, sans-serif",
  },

  // ✅ Clean blurred background
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

  // ✅ Light overlay (no blur)
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

  // ✅ White professional card
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "35px",
    color: "#1f2937",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    position: "relative",
  },

  backBtn: {
    position: "absolute",
    top: "15px",
    left: "15px",
    padding: "7px 15px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "26px",
    color: "#1e3a8a",
    fontWeight: "600",
  },

  heading: {
    marginTop: "18px",
    color: "#374151",
    fontWeight: "600",
  },

  text: {
    fontSize: "14px",
    lineHeight: "1.7",
    color: "#4b5563",
  },

  input: {
    width: "100%",
    marginTop: "14px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
  },

  btnContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },

  encryptBtn: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },

  decryptBtn: {
    padding: "10px 20px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },

  resultBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f3f4f6",
    borderRadius: "10px",
  },

  resultText: {
    marginTop: "5px",
    fontWeight: "bold",
    color: "#111827",
  },
};