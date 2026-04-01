import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb, auth } from "../Firebaseconfig";
import { signOut } from "firebase/auth";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from "recharts";
import logo from "../images/logo.jpeg";
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

  const from = new Date(fromDate);
  const to = new Date(toDate);

  // 🔥 VERY IMPORTANT (include full day)
  to.setHours(23, 59, 59, 999);

  return messages.filter((m) => {
    if (!m.timestamp) return false;

    const msgDate = new Date(m.timestamp);
    return msgDate >= from && msgDate <= to;
  });
};
const getFilteredUsers = () => {
  if (!fromDate || !toDate) return users;

  const from = new Date(fromDate);
  const to = new Date(toDate);

  // 🔥 VERY IMPORTANT (include full day)
  to.setHours(23, 59, 59, 999);

  return users.filter((u) => {
    if (!u.createdAt) return false;

    const userDate = new Date(u.createdAt);
    return userDate >= from && userDate <= to;
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
<div style={styles.filterRow}>
  
  <span style={styles.labelText}>From :</span>
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    style={styles.dateInput}
  />

  <span style={styles.labelText}>To :</span>
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    style={styles.dateInput}
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
<div style={styles.filterRow}>
  
  <span style={styles.labelText}>From :</span>
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    style={styles.dateInput}
  />

  <span style={styles.labelText}>To :</span>
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    style={styles.dateInput}
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
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Messages</th>
          </tr>
        </thead>

        <tbody>
  {getTopUsers().map((u, i) => (
    <tr key={i} style={styles.tr}>
      <td style={styles.td}>
        {i === 0 ? (
          <span style={styles.rankGold}>🥇 1</span>
        ) : i === 1 ? (
          <span style={styles.rankSilver}>🥈 2</span>
        ) : i === 2 ? (
          <span style={styles.rankBronze}>🥉 3</span>
        ) : (
          i + 1
        )}
      </td>

      <td style={styles.td}>{u.name}</td>
      <td style={styles.td}>{u.count}</td>
    </tr>
  ))}
</tbody>
</table>
    </div>

    {/* GRAPH */}
    <div style={{ ...styles.reportBox, marginTop: "25px" }}>
      <h3 style={styles.subHeading}>Graphical View</h3>

      <div style={{ height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={getTopUsers().slice(0, 6)} // 🔥 show only top 6 for clarity
            margin={{ top: 10, right: 20, left: 0, bottom: 60 }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              angle={-25}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              barSize={35}
            />
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
    // if (activeTab === "users") return renderUsers();
    if (activeTab === "reports") return renderReports();
  };

 return (
  <div style={styles.container}>

   {/* HEADER */}
<div style={styles.header}>
  
  {/* LEFT SECTION */}
  <div style={styles.headerLeft}>
    <img src={logo} alt="logo" style={styles.logo} />

    <div>
      <div style={styles.projectTitle}>Secure Communication System</div>
      <div style={styles.companyName}> Cryptography </div>
    </div>
  </div>

  {/* RIGHT SECTION */}
  <div style={styles.headerRight}>
    
    <div style={styles.adminDetails}>
      <div><b>Admin:</b> Sadhana Mane </div>
      <div style={styles.smallText}>sadhana1234@gmail.com</div>
      <div style={styles.roleBadge}>Administrator</div>
    </div>

    <button onClick={handleLogout} style={styles.logoutBtn}>
      Logout
    </button>

  </div>
</div>
    {/* SIDEBAR */}
    <div style={styles.sidebar}>
<div style={styles.adminSidebar}>
<span style={styles.adminIcon}>🛡️</span>  <span style={styles.adminText}>Admin</span>
</div>
      <button onClick={() => setActiveTab("dashboard")} style={styles.sideBtn}>
        Dashboard
      </button>

      <button onClick={() => setActiveTab("reports")} style={styles.sideBtn}>
        Reports
      </button>

      {activeTab === "reports" && (
        <div style={styles.subMenu}>
          <button onClick={() => setSelectedReport("users")}>User Report</button>
          <button onClick={() => setSelectedReport("messages")}>Message Report</button>
          <button onClick={() => setSelectedReport("encryption")}>
            Encryption Report
          </button>
          <button onClick={() => setSelectedReport("userwise")}>
            User-wise Report
          </button>
          <button onClick={() => setSelectedReport("topusers")}>
            Top Users
          </button>
        </div>
      )}

      <button style={styles.logoutSidebar} onClick={handleLogout}>
        Logout
      </button>
    </div>

    {/* CONTENT */}
    <div style={styles.content}>
      {renderContent()}
    </div>
  </div>
);
};
export default Admindashboard;
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI",
    background: "#f1f5f9",
  },adminSidebar: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px",
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,0.1)", // subtle divider
},

adminIcon: {
  fontSize: "18px",
  color: "#38bdf8", // 🔥 FIX: bright blue (visible + matches theme)
},

adminText: {
  fontSize: "18px",
  fontWeight: "600",
  color: "#ffffff",
  letterSpacing: "0.5px",
},

  /* ================= HEADER ================= */

  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "80px",
    zIndex: 1000,
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    boxSizing: "border-box",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #38bdf8",
  },

  projectTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
  },

  companyName: {
    fontSize: "12px",
    color: "#cbd5e1",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  adminDetails: {
    textAlign: "right",
    color: "#e2e8f0",
    fontSize: "13px",
  },

  smallText: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  roleBadge: {
    marginTop: "3px",
    padding: "3px 10px",
    background: "#22c55e",
    color: "#fff",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "600",
  },

  logoutBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },

  /* ================= SIDEBAR ================= */
sidebar: {
  width: "230px", // 🔥 slightly reduced
  background: "linear-gradient(180deg, #020617, #0f172a)",
  color: "white",
  padding: "15px 10px", // 🔥 reduced padding
  position: "fixed",
  top: "80px",
  left: 0,
  height: "calc(100vh - 80px)",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
},
  logoText: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#38bdf8",
  },

  sideBtn: {
  padding: "10px",       // 🔥 reduced height
  marginBottom: "6px",   // 🔥 FIX GAP
  background: "transparent",
  border: "1px solid #334155",
  color: "#e2e8f0",
  cursor: "pointer",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "left",
},
  subMenu: {
  marginLeft: "8px",
  marginBottom: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "4px", // 🔥 smaller gap
},
  logoutSidebar: {
    padding: "12px",
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
  },

  /* ================= CONTENT ================= */

  content: {
    flex: 1,
    marginLeft: "240px", // ✅ FIX overlap
    marginTop: "80px",
    padding: "30px",
    height: "calc(100vh - 80px)",
    overflowY: "auto",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
  },

  /* ================= CARDS ================= */

  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    flex: 1,
    background: "linear-gradient(135deg, #ffffff, #e2e8f0)",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "600",
  },

  chartBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    height: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  /* ================= TABLE ================= */

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

  /* ================= REPORT ================= */

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

  analysisBox: {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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

  tr: {
  transition: "0.2s",
},

table: {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  marginTop: "20px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
},

tr: {
  transition: "0.2s",
},

td: {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  textAlign: "center",
},

th: {
  padding: "14px",
  background: "linear-gradient(135deg, #1e293b, #334155)", // 🔥 premium dark gradient
  color: "#ffffff",
  fontWeight: "700",
  fontSize: "14px",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  borderBottom: "2px solid #0f172a",
},

/* 🔥 zebra striping */
table: {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  marginTop: "20px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
},
/* subtle alternating rows */
tr: {
  transition: "0.2s",
},

/* add this manually inside map if you want zebra:
   background: i % 2 === 0 ? "#ffffff" : "#f9fafb"
*/

/* 🔥 rank badges */
rankGold: {
  background: "#facc15",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
},

rankSilver: {
  background: "#cbd5f5",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
},

rankBronze: {
  background: "#fdba74",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
},
filterContainer: {
  display: "flex",
  gap: "20px",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
},

dateGroup: {
  display: "flex",
  flexDirection: "column",
},

label: {
  fontSize: "13px",
  marginBottom: "5px",
  color: "#334155",
  fontWeight: "600",
},

dateInput: {
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
},
filterRow: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
},

labelText: {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1e293b",
},

dateInput: {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
},
};