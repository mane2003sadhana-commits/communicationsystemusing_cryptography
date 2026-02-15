import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../Firebaseconfig";
import { signOut } from "firebase/auth";
import { auth } from "../Firebaseconfig";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Admindashboard = () => {

  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState("users");

  const [methodData, setMethodData] = useState([]);

  const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully");
    window.location.href = "/";
  } catch (err) {
    alert("Logout Failed");
  }
};

  // FETCH USERS
  useEffect(() => {
    const userRef = ref(rtdb, "users");

    onValue(userRef, (snap) => {
      const data = snap.val() || {};
      setUsers(Object.values(data));
    });
  }, []);

  // FETCH MESSAGES
  useEffect(() => {
    const msgRef = ref(rtdb, "messages");

    onValue(msgRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.values(data);

      setMessages(list);
      calculateMethodStats(list);
    });
  }, []);

  // METHOD STATS
  const calculateMethodStats = (msgs) => {

    let methodCount = {
      caesar: 0,
      vigenere: 0,
      columnar: 0,
      railfence: 0,
    };

    msgs.forEach((m) => {
      if (methodCount[m.method] !== undefined) {
        methodCount[m.method]++;
      }
    });

    setMethodData([
      { name: "Caesar", value: methodCount.caesar },
      { name: "Vigenere", value: methodCount.vigenere },
      { name: "Columnar", value: methodCount.columnar },
      { name: "RailFence", value: methodCount.railfence },
    ]);
  };

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea"];

  // ---------------- RENDER ----------------

  const renderDashboard = () => (
    <>
      <h2>System Analytics</h2>

      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h3>Total Users</h3>
          <p style={styles.count}>{users.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Messages</h3>
          <p style={styles.count}>{messages.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Encryption Methods</h3>
          <p>{methodData.length}</p>
        </div>
      </div>

      {/* BAR GRAPH */}
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={methodData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <h2>Total Users: {users.length}</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              <td>{u.fullname || u.name}</td>
              <td>{u.email}</td>
              <td>{u.role || "User"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  const renderReports = () => (
    <>
      <h2>Reports</h2>

      <select
        style={styles.select}
        onChange={(e) => setSelectedReport(e.target.value)}
      >
        <option value="users">User Report</option>
        <option value="messages">Message Report</option>
        <option value="encryption">Encryption Report</option>
      </select>

      {/* REPORT CONTENT */}

      {selectedReport === "users" && (
        <p>Total Registered Users: {users.length}</p>
      )}

      {selectedReport === "messages" && (
        <p>Total Messages Sent: {messages.length}</p>
      )}

      {selectedReport === "encryption" && (
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={methodData} dataKey="value" label>
                {methodData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );

  // ---------------- MAIN SWITCH ----------------

  const renderContent = () => {
    if (activeTab === "dashboard") return renderDashboard();
    if (activeTab === "users") return renderUsers();
    if (activeTab === "reports") return renderReports();
    return null;
  };

  return (
  <div style={styles.container}>

    {/* HEADER */}
    <div style={styles.header}>
      <div>🔐 Admin Dashboard</div>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* NAVBAR */}
    <div style={styles.navbar}>
      <button
        onClick={() => setActiveTab("dashboard")}
        style={activeTab === "dashboard" ? styles.activeBtn : styles.navBtn}
      >
        Dashboard
      </button>

      <button
        onClick={() => setActiveTab("users")}
        style={activeTab === "users" ? styles.activeBtn : styles.navBtn}
      >
        Users
      </button>

      <button
        onClick={() => setActiveTab("reports")}
        style={activeTab === "reports" ? styles.activeBtn : styles.navBtn}
      >
        Reports
      </button>
    </div>

    {/* MAIN CONTENT */}
    <div style={styles.mainContent}>{renderContent()}</div>

  </div>
);

};

export default Admindashboard;

// ---------------- STYLES ----------------

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "Arial",
  },
  header: {
    background: "#0f172a",
    color: "white",
    padding: "18px",
    fontSize: "22px",
    textAlign: "center",
  },
  navbar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "15px",
    background: "#e5e7eb",
  },
  navBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  mainContent: {
    margin: "20px auto",
    width: "85%",
    background: "white",
    padding: "25px",
    borderRadius: "10px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    textAlign: "center",
  },
  count: {
    fontSize: "28px",
    color: "#2563eb",
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  select: {
    padding: "8px",
    marginBottom: "20px",
  },
};
