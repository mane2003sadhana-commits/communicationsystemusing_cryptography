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

  // Auto migrate user if outside /users
  
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

  // Fetch users for dropdown
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

  // Encryption functions
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

  // Create matrix
  let matrix = Array.from({ length: rows }, () =>
    Array(cols).fill("X")
  );

  // Fill matrix row-wise
  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (index < message.length) {
        matrix[r][c] = message[index++];
      }
    }
  }

  // Sort key alphabetically
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
        alert("Select a valid encryption method");
        return;
    }

    setEncryptedMsg(encrypted);
  };

  // Send encrypted message
  const handleSend = () => {
    if (!receiver || !encryptedMsg) {
      alert("Select receiver and encrypt message first");
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
        // ✅ Only show success alert after push succeeds
        alert("Encrypted message sent successfully!");
        setMessage("");
        setEncryptedMsg("");
        setKey("");
        setReceiver("");
        setMethod("");
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
      });
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Send Secure Message</h2>

      {/* Receiver Dropdown */}
      <label style={styles.label}>Select Receiver</label>
      <select
        style={styles.input}
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      >
        <option value="">-- Select User --</option>
        {users.map((user) => (
          <option key={user.uid} value={user.uid}>
            {user.fullname}
          </option>
        ))}
      </select>

      {/* Message Input */}
      <label style={styles.label}>Enter Message</label>
      <textarea
        style={styles.textarea}
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Encryption Method */}
      <label style={styles.label}>Select Encryption Method</label>
      <select
        style={styles.input}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="">-- Select Method --</option>
        <option value="caesar">Caesar Cipher</option>
<option value="vigenere">Vigenere Cipher</option>
        <option value="railfence">Rail Fence Cipher</option>
        <option value="columnar">Columnar Transposition</option>
      </select>

      {/* Secret Key */}
     <label style={styles.label}>Secret Key</label>
<input
  type={method === "caesar" ? "number" : "text"}
  style={styles.input}
  placeholder={
    method === "caesar"
      ? "Enter number key (e.g., 3)"
      : "Enter text key (e.g., SECRET)"
  }
  value={key}
  onChange={(e) => setKey(e.target.value)}
/>



      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button style={styles.actionBtn} onClick={handleEncrypt}>
          Encrypt
        </button>
        <button style={styles.sendBtn} onClick={handleSend}>
          Send Securely
        </button>
      </div>

      {/* Show Encrypted Message */}
      {encryptedMsg && (
        <div style={{ marginTop: "20px" }}>
          <b>Encrypted Message:</b> {encryptedMsg}
        </div>
      )}
    </div>
  );
};

export default CryptographyLab;


// Styles

const styles = {
  label: {
    fontWeight: "bold",
    display: "block",
    marginTop: "15px",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none",
  },
  buttonGroup: {
    marginTop: "25px",
    display: "flex",
    gap: "15px",
  },
  actionBtn: {
    padding: "10px 18px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  sendBtn: {
    padding: "10px 20px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
