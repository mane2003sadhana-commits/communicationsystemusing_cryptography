import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb, auth } from "../Firebaseconfig";
import { signOut } from "firebase/auth";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from "recharts";

const Admindashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState("users");

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [methodData, setMethodData] = useState([]);

  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const getFilteredMessages = () => {
  if (!fromDate || !toDate) return messages;

  const from = new Date(fromDate).getTime();
  const to = new Date(toDate).getTime();

  return messages.filter((m) => {
    return m.timestamp >= from && m.timestamp <= to;
  });
};

const getUsersByDate = () => {
  if (!fromDate || !toDate) return [];

  const from = new Date(fromDate).getTime();
  const to = new Date(toDate).getTime();

  return users.filter((u) => {
    return u.createdAt >= from && u.createdAt <= to;
  });
};

const getFilteredUsers = () => {
  if (!fromDate || !toDate) return users;

  const from = new Date(fromDate).getTime();
  const to = new Date(toDate).getTime();

  return users.filter((u) => {
    return u.createdAt >= from && u.createdAt <= to;
  });
};
  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  // USERS
  useEffect(() => {
    const userRef = ref(rtdb, "users");
    onValue(userRef, (snap) => {
      const data = snap.val() || {};
const usersWithId = Object.entries(data).map(([id, value]) => ({
  id,
  ...value,
}));

setUsers(usersWithId);    });
  }, []);

  // MESSAGES
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
    let count = {
      caesar: 0,
      vigenere: 0,
      columnar: 0,
      railfence: 0,
    };

    msgs.forEach((m) => {
      if (count[m.method] !== undefined) {
        count[m.method]++;
      }
    });

    setMethodData([
      { name: "Caesar", value: count.caesar },
      { name: "Vigenere", value: count.vigenere },
      { name: "Columnar", value: count.columnar },
      { name: "RailFence", value: count.railfence },
    ]);
  };

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea"];

  const getMethodAnalysis = () => {
  if (methodData.length === 0) return {};

  let max = methodData[0];
  let min = methodData[0];

  methodData.forEach((m) => {
    if (m.value > max.value) max = m;
    if (m.value < min.value) min = m;
  });

  return { max, min };
};

const { max, min } = getMethodAnalysis();

  // ---------------- UI ----------------

  const getUserMessageStats = () => {
  let userCount = {};

  messages.forEach((m) => {
    const user = users.find((u) => u.id === m.senderId);

    const name =
      user?.fullname ||
      user?.name ||
      user?.email ||
      "Unknown";

    userCount[name] = (userCount[name] || 0) + 1;
  });

  return Object.entries(userCount).map(([name, count]) => ({
    name,
    count,
  }));
};
  const renderDashboard = () => (
    <>
      <h2 style={styles.heading}>Dashboard Overview</h2>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>

        <div style={styles.card}>
          <h4>Total Messages</h4>
          <p>{messages.length}</p>
        </div>

        <div style={styles.card}>
          <h4>Encryption Types</h4>
          <p>{methodData.length}</p>
        </div>
      </div>

      <div style={styles.chartBox}>
        <ResponsiveContainer>
          <BarChart data={methodData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <h2 style={styles.heading}>User Management</h2>

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

  const getTopUsers = () => {
  let userCount = {};

  messages.forEach((m) => {
    const user = users.find((u) => u.id === m.senderId);

    const name =
      user?.fullname ||
      user?.name ||
      user?.email ||
      "Unknown";

    userCount[name] = (userCount[name] || 0) + 1;
  });

  // convert to array + sort DESC
  return Object.entries(userCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

 const renderReports = () => (
  <>
    <h2 style={styles.heading}>Reports</h2>

    {/* USER REPORT TABLE */}
   {selectedReport === "users" && (
  <>
    <h2 style={styles.heading}>User Report</h2>

    {/* DATE FILTER */}
    <div style={styles.filterBox}>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        style={styles.input}
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        style={styles.input}
      />
    </div>

    {/* TOTAL */}
    <h3>Total Users: {getFilteredUsers().length}</h3>

    {/* TABLE */}
    <table style={styles.table}>
      <thead style={{ background: "#e2e8f0" }}>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={styles.th}>Email</th>
        </tr>
      </thead>

      <tbody>
        {getFilteredUsers().length === 0 ? (
          <tr>
            <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
              No Users Found
            </td>
          </tr>
        ) : (
          getFilteredUsers().map((u, i) => (
            <tr key={i} style={styles.tr}>
              <td style={styles.td}>{u.fullname || u.name}</td>
              <td style={styles.td}>{u.email}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </>
)}
    {/* MESSAGE REPORT */}
{selectedReport === "messages" && (
  <>
    <h2 style={styles.heading}>Date-wise Message Report</h2>

    {/* DATE FILTER */}
    <div style={styles.filterBox}>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        style={styles.input}
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        style={styles.input}
      />
    </div>

    {/* TOTAL COUNT */}
    <h3>Total Messages: {getFilteredMessages().length}</h3>

    {/* TABLE */}
    <table style={styles.table}>
      <thead style={{ background: "#e2e8f0" }}>
        <tr>
          <th style={styles.th}>Sender</th>
          <th style={styles.th}>Encrypted Message</th>
          <th style={styles.th}>Method</th>
        </tr>
      </thead>

      <tbody>
        {getFilteredMessages().length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
              No Messages Found
            </td>
          </tr>
        ) : (
          getFilteredMessages().map((m, i) => {
            const user = users.find((u) => u.id === m.senderId);

            const name =
              user?.fullname ||
              user?.name ||
              user?.email ||
              "Unknown";

            const date = m.timestamp
              ? new Date(m.timestamp).toLocaleString()
              : "-";

            return (
              <tr key={i}>
                <td style={styles.td}>{name}</td>
                <td style={styles.td}>{m.encryptedMsg}</td>
                <td style={styles.td}>{m.method}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </>
)}
{selectedReport === "userwise" && (
  <>
    <h2 style={styles.heading}>User Activity Report</h2>

    {/* TABLE CARD */}
    <div style={styles.reportBox}>
      <h3 style={styles.subHeading}>User Messages Table</h3>

      <table style={styles.table}>
        <thead style={{ background: "#e2e8f0" }}>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Messages Sent</th>
          </tr>
        </thead>

        <tbody>
          {getUserMessageStats().map((u, i) => (
            <tr key={i} style={styles.tr}>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* GRAPH CARD BELOW */}
    <div style={{ ...styles.reportBox, marginTop: "25px" }}>
      <h3 style={styles.subHeading}>Graphical View</h3>

      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={getUserMessageStats()}>
            <XAxis dataKey="name" angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
)}

{selectedReport === "topusers" && (
  <>
    <h2 style={styles.heading}>Top Active Users Report</h2>

    {/* TABLE */}
    <div style={styles.reportBox}>
      <h3 style={styles.subHeading}>User Ranking</h3>

      <table style={styles.table}>
        <thead style={{ background: "#e2e8f0" }}>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Messages Sent</th>
          </tr>
        </thead>

        <tbody>
          {getTopUsers().map((u, i) => (
            <tr key={i}>
              <td style={styles.td}>{i + 1}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* GRAPH BELOW */}
    <div style={{ ...styles.reportBox, marginTop: "25px" }}>
      <h3 style={styles.subHeading}>Graphical View</h3>

      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={getTopUsers()}>
            <XAxis dataKey="name" angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </>
)}

    {/* ENCRYPTION REPORT */}
   {selectedReport === "encryption" && (
  <>
    <h3>Encryption Usage Analysis Report</h3>

    {/* SUMMARY */}
    <div style={styles.analysisBox}>
      <p>
        🔥 Most Used Method: <b>{max?.name}</b> ({max?.value})
      </p>
      <p>
        ⚠️ Least Used Method: <b>{min?.name}</b> ({min?.value})
      </p>
    </div>
      {/* TABLE */}
   {/* TABLE */}
<div style={{ marginTop: "15px", marginBottom: "25px" }}>
  <table style={styles.table}>
    <thead style={{ background: "#e2e8f0" }}>
      <tr>
        <th style={styles.th}>Encryption Method</th>
        <th style={styles.th}>Usage Count</th>
      </tr>
    </thead>

    <tbody>
      {methodData.length === 0 ? (
        <tr>
          <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
            No Data Available
          </td>
        </tr>
      ) : (
        methodData.map((m, i) => (
          <tr key={i} style={styles.tr}>
            <td style={styles.td}>{m.name}</td>
            <td style={styles.td}>{m.value}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    {/* PIE CHART */}
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
  </>
)}
 </>
); 

  const renderContent = () => {
    if (activeTab === "dashboard") return renderDashboard();
    if (activeTab === "users") return renderUsers();
    if (activeTab === "reports") return renderReports();
  };

  return (
    <div style={styles.container}>
      <h1>ADMIN UPDATED</h1>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Admin</h2>

        <button onClick={() => setActiveTab("dashboard")} style={styles.sideBtn}>
          Dashboard
        </button>

        <button onClick={() => setActiveTab("users")} style={styles.sideBtn}>
          Users
        </button>

        <button onClick={() => setActiveTab("reports")} style={styles.sideBtn}>
          Reports
        </button>

        {/* REPORT OPTIONS */}
        {activeTab === "reports" && (
          <div style={styles.subMenu}>
            <button onClick={() => setSelectedReport("users")}>
              User Report
            </button>
            <button onClick={() => setSelectedReport("messages")}>
              Message Report
            </button>
            <button onClick={() => setSelectedReport("encryption")}>
              Encryption Usage Analysis Report
            </button>
            <button onClick={() => setSelectedReport("userwise")}>
  User-wise Report
</button>
<button onClick={() => setSelectedReport("topusers")}>
  Top Active Users
</button>
          </div>
        )}

        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div style={styles.content}>{renderContent()}</div>
    </div>
  );
};
export default Admindashboard;

// ---------------- STYLES ----------------

const styles = {
 container: {
  display: "flex",
  height: "100vh",
  fontFamily: "Segoe UI",
  overflow: "hidden", // ✅ ADD THIS
},
 sidebar: {
  width: "250px",
  background: "linear-gradient(180deg, #0f172a, #1e293b)",
  color: "white",
  padding: "25px 15px",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  boxShadow: "2px 0 15px rgba(0,0,0,0.2)",
},
 analysisBox: {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
},

table: {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  marginTop: "20px",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
},

th: {
  padding: "14px",
  textAlign: "left",
  background: "#e2e8f0",
  fontWeight: "600",
},

td: {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
},

tr: {
  transition: "0.2s",
},

 logo: {
  marginBottom: "40px",
  fontSize: "22px",
  fontWeight: "bold",
  textAlign: "center",
  letterSpacing: "1px",
},
 sideBtn: {
  padding: "12px",
  marginBottom: "12px",
  background: "#1e293b",
  border: "none",
  color: "white",
  cursor: "pointer",
  borderRadius: "8px",
  transition: "0.3s",
  fontWeight: "500",
},

 subMenu: {
  marginLeft: "10px",
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
},

 logout: {
  marginTop: "30px",
  padding: "12px",
  background: "linear-gradient(135deg, #dc2626, #ef4444)",
  border: "none",
  color: "white",
  cursor: "pointer",
  borderRadius: "8px",
  fontWeight: "bold",
  transition: "0.3s",
},
content: {
  flex: 1,
  background: "#f8fafc",
  padding: "35px",
  marginLeft: "270px",
  height: "100vh",
  overflowY: "auto",
},
 heading: {
  marginBottom: "20px",
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
},

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
  flex: 1,
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "600",
  transition: "0.3s",
},

  chartBox: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    height: "300px",
  },

 

  reportCard: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  reportContainer: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
},

reportBox: {
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
},
subHeading: {
  marginBottom: "15px",
  color: "#1e293b",
},

filterBox: {
  display: "flex",
  gap: "10px",
  marginBottom: "15px",
},

input: {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
},
};