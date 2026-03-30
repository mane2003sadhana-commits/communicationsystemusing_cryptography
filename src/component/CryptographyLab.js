import React, { useEffect, useState } from "react";
import { ref, onValue, set, get, child, push } from "firebase/database";
import { rtdb, auth } from "../Firebaseconfig";

const CryptographyLab = () => {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [encryptedMsg, setEncryptedMsg] = useState("");
  const [key, setKey] = useState("");
  const [method, setMethod] = useState("");

  /* ================= USER MIGRATION ================= */
  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const rootRef = ref(rtdb);

    get(child(rootRef, uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          set(ref(rtdb, `users/${uid}`), {
            fullname: userData.fullname || userData.name || "Unknown",
            email: userData.email || "",
            role: userData.role || "user",
            createdAt: userData.createdAt || Date.now(),
          });
        }
      })
      .catch((err) => console.log(err));
  }, []);

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (!auth.currentUser) return;

    const usersRef = ref(rtdb, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setUsers([]);
        return;
      }

      const list = Object.entries(data)
        .filter(([uid]) => uid !== auth.currentUser.uid)
        .map(([uid, user]) => ({
          uid,
          fullname: user.fullname || user.name || "Unknown",
          email: user.email || "",
        }));

      setUsers(list);
    });

    return () => unsubscribe();
  }, []);

  /* ================= ENCRYPTION ================= */
  const caesarEncrypt = (text, shift) => {
    return text
      .toUpperCase()
      .split("")
      .map((char) => {
        if (char < "A" || char > "Z") return char;
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
      })
      .join("");
  };

  const columnarEncrypt = (text, key) => {
    let message = text.replace(/\s/g, "").toUpperCase();
    let k = key.toUpperCase();

    const cols = k.length;
    const rows = Math.ceil(message.length / cols);

    let matrix = Array.from({ length: rows }, () =>
      Array(cols).fill("X")
    );

    let index = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (index < message.length) {
          matrix[r][c] = message[index++];
        }
      }
    }

    const keyOrder = k
      .split("")
      .map((char, i) => ({ char, i }))
      .sort((a, b) => a.char.localeCompare(b.char));

    let encrypted = "";
    keyOrder.forEach((k) => {
      for (let r = 0; r < rows; r++) {
        encrypted += matrix[r][k.i];
      }
    });

    return encrypted;
  };

  const railFenceEncrypt = (text, rails) => {
    rails = parseInt(rails);
    if (rails <= 1) return text;

    const fence = Array.from({ length: rails }, () => []);
    let rail = 0;
    let direction = 1;

    for (let char of text.replace(/\s/g, "")) {
      fence[rail].push(char);
      rail += direction;

      if (rail === 0 || rail === rails - 1) {
        direction *= -1;
      }
    }

    return fence.flat().join("").toUpperCase();
  };

  const vigenereEncrypt = (text, key) => {
    let upperText = text.toUpperCase();
    let upperKey = key.toUpperCase().replace(/[^A-Z]/g, "");

    if (!upperKey) return text;

    let output = "";
    let j = 0;

    for (let i = 0; i < upperText.length; i++) {
      let t = upperText[i];

      if (t < "A" || t > "Z") {
        output += t;
      } else {
        let k = upperKey[j % upperKey.length];
        let encryptedChar = String.fromCharCode(
          ((t.charCodeAt(0) - 65 + (k.charCodeAt(0) - 65)) % 26) + 65
        );
        output += encryptedChar;
        j++;
      }
    }

    return output;
  };

  const handleEncrypt = () => {
    if (!message || !key || !method) {
      alert("Enter message, key, and select method");
      return;
    }

    let encrypted = "";

    switch (method) {
      case "caesar":
        encrypted = caesarEncrypt(message, parseInt(key));
        break;
      case "railfence":
        encrypted = railFenceEncrypt(message, key);
        break;
      case "vigenere":
        encrypted = vigenereEncrypt(message, key);
        break;
      case "columnar":
        encrypted = columnarEncrypt(message, key);
        break;
      default:
        alert("Select valid method");
        return;
    }

    setEncryptedMsg(encrypted);
  };

  /* ================= SEND ================= */
  const handleSend = () => {
    if (!receiver || !encryptedMsg) {
      alert("Select receiver & encrypt first");
      return;
    }

    push(ref(rtdb, "messages"), {
      senderId: auth.currentUser.uid,
      receiverId: receiver,
      encryptedMsg,
      method,
      key,
      timestamp: Date.now(),
    })
      .then(() => {
        alert("Message sent successfully!");
        setMessage("");
        setEncryptedMsg("");
        setKey("");
        setReceiver("");
        setMethod("");
      })
      .catch(() => alert("Error sending message"));
  };

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Secure Message Sender</h2>

        <label style={styles.label}>Receiver</label>
        <select
          style={styles.input}
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.fullname}
            </option>
          ))}
        </select>

        <label style={styles.label}>Message</label>
        <textarea
          style={styles.textarea}
          value={message}
            placeholder="Enter your message..."
          onChange={(e) => setMessage(e.target.value)}
        />

        <label style={styles.label}>Method</label>
        <select
          style={styles.input}
          value={method}
          
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">-- Select Method --</option>
          <option value="caesar">Caesar</option>
          <option value="vigenere">Vigenere</option>
          <option value="railfence">Rail Fence</option>
          <option value="columnar">Columnar</option>
        </select>

        <label style={styles.label}>Key</label>
        <input
          type={method === "caesar" ? "number" : "text"}
          style={styles.input}
          value={key}
            placeholder="Enter secret key ..."

          onChange={(e) => setKey(e.target.value)}
        />

        <div style={styles.buttonGroup}>
          <button style={styles.encryptBtn} onClick={handleEncrypt}>
            Encrypt
          </button>
          <button style={styles.sendBtn} onClick={handleSend}>
            Send
          </button>
        </div>

        {encryptedMsg && (
          <div style={styles.output}>
            <b>Encrypted:</b> {encryptedMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptographyLab;

/* ================= STYLES ================= */

const styles = {
  container: {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px",

  backgroundImage: "url('https://images.unsplash.com/photo-1510511233900-1982d92bd835')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",

  position: "relative",
},
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "25px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  label: {
    marginTop: "10px",
    fontWeight: "bold",
  },
  input: {
  width: "100%",
  height: "45px",              // fixed same height
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",     // important
  fontSize: "14px",
  
},

textarea: {
  width: "100%",
  height: "75px",              // same as input
  padding: "10px",
  marginTop: "5px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  resize: "none",              // prevent manual resize
  boxSizing: "border-box",
  fontSize: "14px",
},
buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  encryptBtn: {
    flex: 1,
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  sendBtn: {
    flex: 1,
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  output: {
    marginTop: "15px",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "6px",
  },
};