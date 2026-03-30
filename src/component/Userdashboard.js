import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

import { auth, rtdb } from "../Firebaseconfig";
import CryptographyLab from "./CryptographyLab";
import Inbox from "./Inbox";

import TutorialsHome from "../tutorials/TutorialsHome";
import CaesarCipherTutorial from "../tutorials/CaesarCipher";
import ColumnarTransposition from "../tutorials/ColumnarTransposition";
import RailFenceCipher from "../tutorials/RailFenceCipher";
import VigenereCipher from "../tutorials/VigenerCipher";
import Profile from "./Profile";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("crypto");
  const [userName, setUserName] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const navigate = useNavigate();

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

            {selectedTutorial && (
              <>
                <button
                  style={styles.backBtn}
                  onClick={() => setSelectedTutorial(null)}
                >
                  ← Back to Tutorials
                </button>

                {selectedTutorial === "caesar" && (
                  <CaesarCipherTutorial />
                )}
                {selectedTutorial === "columnar" && (
                  <ColumnarTransposition />
                )}
                {selectedTutorial === "railfence" && (
                  <RailFenceCipher />
                )}
                {selectedTutorial === "vigener" && (
                  <VigenereCipher />
                )}
              </>
            )}
          </>
        );

      case "inbox":
        return (
          <>
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

            <div style={styles.profileTooltip}>
              <b>{userName}</b>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        {["crypto", "tutorials", "inbox", "profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.navBtn,
              background:
                activeTab === tab
                  ? "linear-gradient(135deg, #16a34a, #22c55e)"
                  : styles.navBtn.background,
            }}
          >
            {tab === "crypto"
              ? "Cryptography Lab"
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={styles.contentWrapper}>
        <div style={styles.mainContent}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;

/* ===== STYLES ===== */

const styles = {
  container: {
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #e0e7ff, #f8fafc)",
  },

 header: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
  background: "linear-gradient(90deg, #414e6d, #323b4b)",
  color: "#fff",
  padding: "15px 40px", // ⬅️ increased side padding
  fontSize: "20px",
  fontWeight: "600",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxSizing: "border-box", // ⬅️ important fix
},

headerRight: {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginRight: "10px", // ⬅️ pushes content left slightly
},
  profileWrapper: {
    position: "relative",
  },

  profileIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: "bold",
  },

  profileTooltip: {
    position: "absolute",
    top: "45px",
    right: 0,
    background: "#111",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    display: "none",
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  navbar: {
    position: "fixed",
    top: "65px",
    width: "100%",
    zIndex: 999,
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    padding: "10px",
    background: "#f1f5f9",
    borderBottom: "1px solid #ddd",
  },

  navBtn: {
    padding: "8px 16px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  contentWrapper: {
    position: "absolute",
    top: "120px",
    bottom: 0,
    width: "100%",
    overflowY: "auto",
  },

  mainContent: {
    margin: "20px auto",
    padding: "25px",
    width: "80%",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  backBtn: {
    marginBottom: "15px",
    padding: "6px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};