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

    // Mark zig-zag positions
    for (let i = 0; i < len; i++) {
      fence[rail][i] = "*";
      rail += dir;
      if (rail === 0 || rail === rails - 1) dir *= -1;
    }

    // Fill characters
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < len; c++) {
        if (fence[r][c] === "*" && index < len) {
          fence[r][c] = text[index++];
        }
      }
    }

    // Read zig-zag
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
    <div>
      <h2>Rail Fence Cipher</h2>

      <h4>Introduction</h4>
      <p>
        Rail Fence Cipher is a transposition cipher where the message is written
        in a zig-zag pattern across multiple rails and then read row by row.
      </p>

      <h4>Example</h4>
      <p>
        Message: <b>HELLO WORLD</b><br />
        Rails: <b>3</b><br />
        Encrypted: <b>HOLELWRDLO</b>
      </p>

      <h4>Try It Yourself</h4>

      <textarea
        style={styles.input}
        placeholder="Enter message"
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

      <div style={{ marginTop: "10px" }}>
        <button style={styles.btn} onClick={encrypt}>
          Encrypt
        </button>
        <button style={{ ...styles.btn, marginLeft: "10px" }} onClick={decrypt}>
          Decrypt
        </button>
      </div>

      {result && (
        <p style={{ marginTop: "10px" }}>
          <b>Output:</b> {result}
        </p>
      )}
    </div>
  );
};

export default RailFenceCipher;

const styles = {
  input: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
  },
  btn: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
