import React, { useState } from "react";

const RailFenceCipher = () => {
  const [text, setText] = useState("");
  const [rails, setRails] = useState(3);
  const [result, setResult] = useState("");

  // 🔐 Encrypt
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

  // 🔓 Decrypt
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
      {/* Floating decorative blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.innerCard}>

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
                Encrypt ✨
              </button>

              <button style={styles.decryptBtn} onClick={decrypt}>
                Decrypt 🔓
              </button>
            </div>

            {result && (
              <div style={styles.resultBox}>
                <p><b>Output</b></p>
                <p style={styles.resultText}>{result}</p>
              </div>
            )}

          </div>
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

  // 🌄 NEW BACKGROUND IMAGE
  backgroundImage:
    "url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
},
  overlay: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(8px)",
  },

  card: {
    width: "100%",
    maxWidth: "560px",
    padding: "4px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #6366f1, #a855f7, #22c55e)",
    boxShadow: "0 0 40px rgba(99,102,241,0.4)",
  },

  innerCard: {
    background: "rgba(15, 23, 42, 0.85)",
    borderRadius: "20px",
    padding: "28px",
    color: "#fff",
    backdropFilter: "blur(20px)",
    boxShadow: "inset 0 0 20px rgba(255,255,255,0.05)",
  },

  title: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "30px",
    fontWeight: "800",
    background: "linear-gradient(90deg, #60a5fa, #a78bfa, #34d399)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heading: {
    marginTop: "15px",
    color: "#93c5fd",
    fontSize: "15px",
  },

  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#e5e7eb",
  },

  input: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    transition: "0.3s",
  },

  btnContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
  },

  encryptBtn: {
    padding: "11px 22px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 18px rgba(34,197,94,0.5)",
    transition: "0.3s",
  },

  decryptBtn: {
    padding: "11px 22px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 18px rgba(239,68,68,0.5)",
    transition: "0.3s",
  },

  resultBox: {
    marginTop: "20px",
    padding: "15px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "14px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  resultText: {
    marginTop: "5px",
    fontWeight: "bold",
    color: "#facc15",
    fontSize: "16px",
  },

  blob1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "rgba(99,102,241,0.4)",
    filter: "blur(90px)",
    top: "-80px",
    left: "-80px",
    borderRadius: "50%",
  },

  blob2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "rgba(34,197,94,0.3)",
    filter: "blur(100px)",
    bottom: "-80px",
    right: "-80px",
    borderRadius: "50%",
  },
};