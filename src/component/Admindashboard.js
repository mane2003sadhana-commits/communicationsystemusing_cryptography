import React, { useState } from "react";

const Admindashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3>Total Users</h3>
              <p style={styles.count}>24</p>
            </div>
            <div style={styles.card}>
              <h3>Total Messages</h3>
              <p style={styles.count}>156</p>
            </div>
            <div style={styles.card}>
              <h3>Encryption Methods</h3>
              <p>5 Implemented</p>
            </div>
            <div style={styles.card}>
              <h3>System Status</h3>
              <p style={{ color: "green" }}>Secure & Active</p>
            </div>
          </div>
        );

      case "users":
        return (
          <>
            <h2>Registered Users</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Shreya</td>
                  <td>shreya@gmail.com</td>
                  <td>User</td>
                </tr>
                <tr>
                  <td>Admin</td>
                  <td>admin@gmail.com</td>
                  <td>Admin</td>
                </tr>
              </tbody>
            </table>
          </>
        );

      case "reports":
        return (
          <>
            <h2>Reports</h2>
            <ul style={styles.reportList}>
              <li>Total Users Report</li>
              <li>Message Traffic Report</li>
              <li>Encryption Usage Report</li>
              <li>Login Activity Report</li>
            </ul>
          </>
        );

      case "activity":
        return (
          <>
            <h2>Recent Activity</h2>
            <p>✔ User Shreya encrypted a message</p>
            <p>✔ User Riya decrypted a message</p>
            <p>✔ New user registered</p>
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
        Admin Dashboard – Secure Communication System
      </div>

      {/* NAVBAR */}
      <div style={styles.navbar}>
        <button onClick={() => setActiveTab("dashboard")} style={styles.navBtn}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab("users")} style={styles.navBtn}>
          Users
        </button>
        <button onClick={() => setActiveTab("reports")} style={styles.navBtn}>
          Reports
        </button>
        <button onClick={() => setActiveTab("activity")} style={styles.navBtn}>
          Activity
        </button>
        <button style={styles.logoutBtn}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {renderContent()}
      </div>

    </div>
  );
};

export default Admindashboard;

/* ===== STYLES ===== */
const styles = {
  container: {
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f1f5f9",
  },
  header: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: "18px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
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
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  mainContent: {
    margin: "20px auto",
    padding: "25px",
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    minHeight: "65vh",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    boxShadow: "0 5px 10px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  count: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#2563eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  reportList: {
    marginTop: "15px",
    lineHeight: "1.8",
  },
};
