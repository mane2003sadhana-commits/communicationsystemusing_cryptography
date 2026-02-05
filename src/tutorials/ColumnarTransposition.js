import React, { useState } from "react";

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

    // Fill row-wise
    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (index < message.length) {
          matrix[r][c] = message[index++];
        }
      }
    }

    // Sort key
    const keyOrder = k
      .split("")
      .map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char));

    // Read column-wise
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

    // Sort key
    const keyOrder = k
      .split("")
      .map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char));

    // Fill column-wise
    let index = 0;
    keyOrder.forEach((k) => {
      for (let r = 0; r < rows; r++) {
        if (index < cipher.length) {
          matrix[r][k.i] = cipher[index++];
        }
      }
    });

    // Read row-wise
    let decrypted = "";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        decrypted += matrix[r][c];
      }
    }

    setResult(decrypted);
  };

  return (
    <div>
      <h2>Columnar Transposition Cipher</h2>

      <h4>Introduction</h4>
      <p>
        Columnar Transposition is a classical encryption technique where the
        message is written in rows under a keyword and read column-wise based on
        alphabetical order of the key.
      </p>

      <h4>Example</h4>
      <p>
        Message: <b>HELLO WORLD</b><br />
        Key: <b>ZEBRA</b><br />
        Encrypted: <b>ODLREOHWLX</b>
      </p>

      <h4>Try It Yourself</h4>

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

      <div style={{ marginTop: "10px" }}>
        <button style={styles.btn} onClick={encrypt}>
          Encrypt
        </button>
        <button
          style={{ ...styles.btn, marginLeft: "10px" }}
          onClick={decrypt}
        >
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

export default ColumnarTransposition;

const styles = {
  input: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
  },
  btn: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
