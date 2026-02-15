import React, { useState } from "react";

const PlayfairCipher = () => {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  // Generate Playfair Matrix
  const generateMatrix = (key) => {
    key = key.toUpperCase().replace(/J/g, "I");
    let matrix = [];
    let used = new Set();

    key.split("").forEach((c) => {
      if (c >= "A" && c <= "Z" && !used.has(c)) {
        matrix.push(c);
        used.add(c);
      }
    });

    for (let i = 0; i < 26; i++) {
      let c = String.fromCharCode(65 + i);
      if (c === "J") continue;
      if (!used.has(c)) {
        matrix.push(c);
        used.add(c);
      }
    }

    let grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(matrix.slice(i * 5, i * 5 + 5));
    }
    return grid;
  };

  // Find Position in Matrix
  const findPos = (grid, char) => {
    if (char === "J") char = "I";
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid[r][c] === char) return [r, c];
      }
    }
    return null;
  };

  // Prepare Text
  const prepareText = (txt) => {
    txt = txt.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
    let pairs = [];

    for (let i = 0; i < txt.length; i += 2) {
      let a = txt[i];
      let b = txt[i + 1];

      if (!b) b = "X";
      if (a === b) {
        pairs.push([a, "X"]);
        i--;
      } else {
        pairs.push([a, b]);
      }
    }

    return pairs;
  };

  const encrypt = () => {
    let grid = generateMatrix(key);
    let pairs = prepareText(text);
    let output = "";

    pairs.forEach(([a, b]) => {
      let [r1, c1] = findPos(grid, a);
      let [r2, c2] = findPos(grid, b);

      if (r1 === r2) {
        output += grid[r1][(c1 + 1) % 5];
        output += grid[r2][(c2 + 1) % 5];
      } else if (c1 === c2) {
        output += grid[(r1 + 1) % 5][c1];
        output += grid[(r2 + 1) % 5][c2];
      } else {
        output += grid[r1][c2];
        output += grid[r2][c1];
      }
    });

    setResult(output);
  };

  const decrypt = () => {
    let grid = generateMatrix(key);
    let pairs = prepareText(text);
    let output = "";

    pairs.forEach(([a, b]) => {
      let [r1, c1] = findPos(grid, a);
      let [r2, c2] = findPos(grid, b);

      if (r1 === r2) {
        output += grid[r1][(c1 + 4) % 5];
        output += grid[r2][(c2 + 4) % 5];
      } else if (c1 === c2) {
        output += grid[(r1 + 4) % 5][c1];
        output += grid[(r2 + 4) % 5][c2];
      } else {
        output += grid[r1][c2];
        output += grid[r2][c1];
      }
    });

    setResult(output);
  };

  return (
    <div>
      <h2>Playfair Cipher</h2>

      <h4>Introduction</h4>
      <p>
        Playfair Cipher is a digraph substitution cipher. It encrypts two letters
        at a time using a 5x5 matrix generated from a keyword.
      </p>

      <h4>Example</h4>
      <p>
        Key: <b>MONARCHY</b><br />
        Message: <b>HELLO</b><br />
        Encrypted: <b>Example Output Depends on Matrix</b>
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

export default PlayfairCipher;

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
