import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

import { auth, rtdb } from "../Firebaseconfig";
import CryptographyLab from "./CryptographyLab";
import Inbox from "./Inbox";

import TutorialsHome from "../tutorials/TutorialsHome";
import CaesarCipherTutorial from "../tutorials/CaesarCipher"
import ColumnarTransposition from "../tutorials/ColumnarTransposition";
import RailFenceCipher from "../tutorials/RailFenceCipher";
import VigenereCipher from "../tutorials/VigenerCipher";
import Profile from "./Profile";


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("crypto");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // 🔐 Fetch logged-in user details
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = ref(rtdb, `users/${auth.currentUser.uid}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserName(data.fullname || data.name || "User");
      }
    });
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "crypto":
        return (
          <>
            <h2>Cryptography Lab</h2>
            <CryptographyLab />
          </>
        );
      case "tutorials":
  return (
    <>
      {!selectedTutorial && (
        <TutorialsHome onSelect={setSelectedTutorial} />
      )}

      {selectedTutorial === "caesar" && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setSelectedTutorial(null)}
          >
            ← Back to Tutorials
          </button>

          <CaesarCipherTutorial />
        </>
      )}
      {selectedTutorial === "columnar" && (
  <>
    <button
      style={styles.backBtn}
      onClick={() => setSelectedTutorial(null)}
    >
      ← Back to Tutorials
    </button>

    <ColumnarTransposition />
  </>
)}
  {selectedTutorial === "railfence" && (
            <>
              <button
                style={styles.backBtn}
                onClick={() => setSelectedTutorial(null)}
              >
                ← Back to Tutorials
              </button>
              <RailFenceCipher />
            </>
          )}
 {selectedTutorial === "vigener" && (
            <>
              <button
                style={styles.backBtn}
                onClick={() => setSelectedTutorial(null)}
              >
                ← Back to Tutorials
              </button>
              <VigenereCipher />
            </>
          )}


    </>
  );

case "inbox":
        return (
          <>
            <h2>Inbox</h2>
            <Inbox />
          </>
        );
      case "profile":
  return (
    <>
      <h2>Profile Analytics</h2>
      <Profile />
    </>
  );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span>Secure Communication System</span>

        <div style={styles.headerRight}>
          {/* 👤 PROFILE ICON */}
          <div
            style={styles.profileWrapper}
            onMouseEnter={(e) =>
              (e.currentTarget.children[1].style.display = "block")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.children[1].style.display = "none")
            }
          >
            <div style={styles.profileIcon}>
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* Hover Card */}
            <div style={styles.profileTooltip}>
              <b>{userName}</b>
            </div>
          </div>

          {/* LOGOUT */}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <button onClick={() => setActiveTab("crypto")} style={styles.navBtn}>
          Cryptography Lab
        </button>
        <button onClick={() => setActiveTab("tutorials")} style={styles.navBtn}>
          Tutorials
        </button>
        <button onClick={() => setActiveTab("inbox")} style={styles.navBtn}>
          Inbox
        </button>
        <button onClick={() => setActiveTab("profile")} style={styles.navBtn}>
          Profile
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>{renderContent()}</div>
    </div>
  );
};

export default UserDashboard;

/* ===== STYLES ===== */
const styles = {
  container: {
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f8",
  },
  header: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "18px",
    fontSize: "20px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  profileWrapper: {
    position: "relative",
  },
  profileIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
  },
  profileTooltip: {
  position: "absolute",
  top: "26px",
  right: "0",
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "3px 6px",
  borderRadius: "4px",
  fontSize: "11px",
  whiteSpace: "nowrap",
  zIndex: 10,
},

  logoutBtn: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "12px",
    backgroundColor: "#e5e7eb",
  },
  navBtn: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  mainContent: {
    margin: "20px auto",
    padding: "25px",
    width: "80%",
    minHeight: "60vh",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  backBtn: {
  marginBottom: "15px",
  padding: "6px 12px",
  backgroundColor: "#e5e7eb",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "bold",
},

};
