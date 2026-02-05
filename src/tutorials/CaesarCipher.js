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
    <div>
      <h2>Caesar Cipher</h2>

      <h4>Introduction</h4>
      <p>
        Caesar Cipher is one of the simplest and oldest encryption techniques.
        Each letter is shifted by a fixed number of positions.
      </p>

      <h4>Example</h4>
      <p>
        Message: <b>HELLO</b><br />
        Key: <b>3</b><br />
        Encrypted: <b>KHOOR</b>
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
        value={key}
        onChange={(e) => setKey(e.target.value)}
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

export default CaesarCipher;

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
