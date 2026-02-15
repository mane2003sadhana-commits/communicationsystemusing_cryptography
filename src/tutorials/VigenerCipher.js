import React, { useState } from "react";

const VigenereCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

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
    <div>
      <h2>Vigenère Cipher</h2>

      <h4>Introduction</h4>
      <p>
        Vigenère Cipher is a polyalphabetic substitution cipher. It uses a keyword
        to apply multiple Caesar shifts on the message.
      </p>

      <h4>Example</h4>
      <p>
        Message: <b>HELLO</b> <br />
        Key: <b>KEY</b> <br />
        Encrypted: <b>RIJVS</b>
      </p>

      <h4>Try It Yourself</h4>

      <textarea
        style={styles.input}
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="text"
        style={styles.input}
        placeholder="Enter key"
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

export default VigenereCipher;

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
