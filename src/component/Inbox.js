import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb, auth } from "../Firebaseconfig";

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [decryptedMap, setDecryptedMap] = useState({});
  const [openMsgId, setOpenMsgId] = useState(null); // track opened message

  // Fetch all users
  useEffect(() => {
    const usersRef = ref(rtdb, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const map = {};
      Object.entries(data).forEach(([uid, user]) => {
        map[uid] = user.fullname || user.name || "Unknown";
      });
      setUsersMap(map);
    });
    return () => unsubscribe();
  }, []);

  // Fetch messages for current user
  useEffect(() => {
    if (!auth.currentUser) return;

    const messagesRef = ref(rtdb, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const inbox = Object.entries(data)
        .filter(([id, msg]) => msg.receiverId === auth.currentUser.uid)
        .map(([id, msg]) => ({ id, ...msg }))
        .sort((a, b) => b.timestamp - a.timestamp);

      setMessages(inbox);
    });

    return () => unsubscribe();
  }, []);

  // Caesar Cipher decrypt
  const caesarDecrypt = (text, shift) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => {
        if (char < "A" || char > "Z") return char;
        return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      })
      .join("");
  };

  const columnarDecrypt = (cipherText, key) => {
  let cipher = cipherText.replace(/\s/g, "").toUpperCase();
  let k = key.toUpperCase();

  const cols = k.length;
  const rows = Math.ceil(cipher.length / cols);

  // Create empty matrix
  let matrix = Array.from({ length: rows }, () =>
    Array(cols).fill("")
  );

  // Sort key alphabetically
  const keyOrder = k
    .split("")
    .map((char, i) => ({ char, i }))
    .sort((a, b) => a.char.localeCompare(b.char));

  // Fill matrix column-wise
  let index = 0;
  keyOrder.forEach((k) => {
    for (let r = 0; r < rows; r++) {
      if (index < cipher.length) {
        matrix[r][k.i] = cipher[index++];
      }
    }
  });

  // Read matrix row-wise
  let decrypted = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      decrypted += matrix[r][c];
    }
  }

  return decrypted;
};

// Vigenere Cipher decrypt
const vigenereDecrypt = (cipherText, key) => {
  let upperCipher = cipherText.toUpperCase();
  let upperKey = key.toUpperCase().replace(/[^A-Z]/g, "");

  if (!upperKey) return cipherText;

  let output = "";
  let j = 0;

  for (let i = 0; i < upperCipher.length; i++) {
    let c = upperCipher[i];

    if (c < "A" || c > "Z") {
      output += c;
    } else {
      let k = upperKey[j % upperKey.length];

      let decryptedChar = String.fromCharCode(
        ((c.charCodeAt(0) - 65 - (k.charCodeAt(0) - 65) + 26) % 26) + 65
      );

      output += decryptedChar;
      j++;
    }
  }

  return output;
};

// Rail Fence Cipher decrypt
const railFenceDecrypt = (cipherText, rails) => {
  rails = parseInt(rails);
  if (rails <= 1) return cipherText;

  const len = cipherText.length;

  // Step 1: create matrix
  let fence = Array.from({ length: rails }, () =>
    Array(len).fill(null)
  );

  // Step 2: mark zig-zag path
  let rail = 0;
  let dir = 1;
  for (let i = 0; i < len; i++) {
    fence[rail][i] = "*";
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }

  // Step 3: fill cipher text row-wise
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < len; c++) {
      if (fence[r][c] === "*" && index < len) {
        fence[r][c] = cipherText[index++];
      }
    }
  }

  // Step 4: read zig-zag to decrypt
  let result = "";
  rail = 0;
  dir = 1;
  for (let i = 0; i < len; i++) {
    result += fence[rail][i];
    rail += dir;
    if (rail === 0 || rail === rails - 1) dir *= -1;
  }

  return result;
};


  const handleDecrypt = (msg) => {
  let decrypted = "";

  switch (msg.method) {
    case "caesar":
      decrypted = caesarDecrypt(msg.encryptedMsg, parseInt(msg.key));
      break;

    case "columnar":
      decrypted = columnarDecrypt(msg.encryptedMsg, msg.key);
      break;
      case "railfence":
      decrypted = railFenceDecrypt(msg.encryptedMsg, msg.key);
      break;
    case "vigenere":
      decrypted = vigenereDecrypt(msg.encryptedMsg, msg.key);
      break;

    default:
      decrypted = `Decrypt not implemented for ${msg.method}`;
  }

  setDecryptedMap((prev) => ({
    ...prev,
    [msg.id]: decrypted,
  }));
};

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inbox</h2>
      {messages.length === 0 ? (
        <p style={styles.noMsg}>No messages found.</p>
      ) : (
        <div style={styles.msgList}>
          {messages.map((msg) => {
            const isOpen = openMsgId === msg.id;
            return (
              <div key={msg.id} style={styles.card}>
                {/* Header: From, Time, View Button */}
                <div style={styles.header}>
                  <span style={styles.sender}>{usersMap[msg.senderId] || "Unknown"}</span>
                  <span style={styles.time}>{new Date(msg.timestamp).toLocaleString()}</span>
                  <button
                    style={styles.viewBtn}
                    onClick={() => setOpenMsgId(isOpen ? null : msg.id)}
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>
                </div>

                {/* Expanded Content */}
                {isOpen && (
                  <div style={styles.content}>
                    <p><b>Encrypted:</b> {msg.encryptedMsg}</p>
                    <p><b>Key:</b> {msg.key}</p>
                    <p><b>Method:</b> {msg.method}</p>
                    <button style={styles.decryptBtn} onClick={() => handleDecrypt(msg)}>
                      Decrypt
                    </button>
                    {decryptedMap[msg.id] && (
                      <div style={styles.decrypted}>
                        <b>Decrypted:</b> {decryptedMap[msg.id]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;

// -----------------------------
// Styles
// -----------------------------
const styles = {
  container: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b",
  },
  noMsg: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#555",
  },
  msgList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: "5px",
  },
  card: {
    backgroundColor: "#f9fafb",
    padding: "12px 15px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
  },
  sender: {
    fontWeight: "bold",
    color: "#2563eb",
  },
  time: {
    fontSize: "12px",
    color: "#555",
    marginRight: "10px",
  },
  viewBtn: {
    padding: "5px 12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
  },
  content: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#1f2937",
  },
  decryptBtn: {
    padding: "6px 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  decrypted: {
    padding: "10px",
    backgroundColor: "#e0f2fe",
    borderRadius: "6px",
    fontWeight: "bold",
    color: "#0c4a6e",
    marginTop: "10px",
  },
};
