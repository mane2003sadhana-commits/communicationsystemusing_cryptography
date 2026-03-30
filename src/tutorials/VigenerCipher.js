import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VigenereCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  // Helper: Repeat key to match text length
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
      <div style={styles.overlay}>
        <div style={styles.card}>

          {/* BACK BUTTON */}
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2 style={styles.title}>🔐 Vigenère Cipher Tool</h2>

          <h4 style={styles.heading}>Introduction</h4>
          <p style={styles.text}>
            Vigenère Cipher is a polyalphabetic substitution cipher. It uses a
            keyword to apply multiple Caesar shifts on the message.
          </p>

          <h4 style={styles.heading}>Example</h4>
          <p style={styles.text}>
            Message: <b>HELLO</b> <br />
            Key: <b>KEY</b> <br />
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
  backgroundImage:
    "url('https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: "Poppins, sans-serif",
  position: "relative",
},

overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(255, 255, 255, 0.65)", // white glass effect
  backdropFilter: "blur(8px)", // 🔥 premium blur
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
},
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "35px",
    color: "#1f2937",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.3)",
    transition: "0.3s",
  },

  backBtn: {
    position: "absolute",
    top: "15px",
    left: "15px",
    padding: "7px 15px",
    background: "#ffffff",
    color: "#1e293b",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3a8a",
    letterSpacing: "0.5px",
  },

  heading: {
    marginTop: "18px",
    color: "#374151",
    fontSize: "15px",
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
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: "14px",
    background: "#ffffff",
    color: "#111827",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.05)",
    transition: "0.2s",
  },

  btnContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "25px",
  },

  encryptBtn: {
    padding: "12px 22px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(37, 99, 235, 0.3)",
    transition: "0.3s",
  },

  decryptBtn: {
    padding: "12px 22px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 6px 15px rgba(5, 150, 105, 0.3)",
    transition: "0.3s",
  },

  resultBox: {
    marginTop: "25px",
    padding: "20px",
    background: "linear-gradient(135deg, #f1f5f9, #e0f2fe)",
    borderRadius: "14px",
    textAlign: "center",
    border: "1px solid #e5e7eb",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  resultText: {
    marginTop: "8px",
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: "17px",
    letterSpacing: "1px",
  },
};