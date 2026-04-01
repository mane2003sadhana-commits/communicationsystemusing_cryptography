import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb, auth } from "../Firebaseconfig";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";

const Profile = () => {
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    encrypted: 0,
    securityScore: 0,
  });

  const [methodData, setMethodData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    if (!auth.currentUser) return;

    const msgRef = ref(rtdb, "messages");

    const unsubscribe = onValue(msgRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data);
      calculateStats(list);
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = (msgs) => {
    const uid = auth.currentUser.uid;

    let sent = 0;
    let received = 0;
    let encrypted = 0;

    let methodCount = {
      caesar: 0,
      vigenere: 0,
      columnar: 0,
      railfence: 0,
    };

    let timeline = {};

    msgs.forEach((m) => {
      if (m.senderId === uid) sent++;
      if (m.receiverId === uid) received++;
      if (m.encryptedMsg) encrypted++;

      if (m.method && methodCount[m.method] !== undefined) {
        methodCount[m.method]++;
      }

      if (m.senderId === uid) {
        const date = new Date(m.timestamp).toLocaleDateString();
        timeline[date] = (timeline[date] || 0) + 1;
      }
    });

    const total = sent + received || 1;
    const securityScore = Math.round((encrypted / total) * 100);

    setStats({ sent, received, encrypted, securityScore });

    setMethodData([
      { name: "Caesar", value: methodCount.caesar },
      { name: "Vigenere", value: methodCount.vigenere },
      { name: "Columnar", value: methodCount.columnar },
      { name: "RailFence", value: methodCount.railfence },
    ]);

    const timelineArr = Object.keys(timeline).map((d) => ({
      date: d,
      messages: timeline[d],
    }));

    setTimelineData(timelineArr);
  };

  const tooltipFix = {
    cursor: false,
    wrapperStyle: { outline: "none" },
    contentStyle: {
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      color: "#111",
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg,#eef2ff,#f8fafc)"
      }}
    >

      {/* ✅ GLOBAL FIX: REMOVE BLACK BOX / FOCUS OUTLINE */}
      <style>
        {`
          *:focus {
            outline: none !important;
          }

          svg:focus {
            outline: none !important;
          }

          .recharts-wrapper,
          .recharts-surface,
          .recharts-pie,
          .recharts-pie-sector,
          .recharts-sector,
          .recharts-bar-rectangle {
            outline: none !important;
          }

          .recharts-active-shape {
            outline: none !important;
          }
        `}
      </style>

      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>
        Security Analytics Dashboard
      </h1>

      {/* TOP CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {[
          { title: "Messages Sent", value: stats.sent },
          { title: "Messages Received", value: stats.received },
          { title: "Encrypted Messages", value: stats.encrypted },
          { title: "Security Score", value: stats.securityScore + "%", highlight: true }
        ].map((card, i) => (
          <div key={i} style={{
            background: card.highlight
              ? "linear-gradient(135deg,#2563eb,#1e40af)"
              : "white",
            color: card.highlight ? "white" : "#111",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
          }}>
            <p>{card.title}</p>
            <h2 style={{ fontSize: "26px" }}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        marginBottom: "30px"
      }}>
        
        <h3>Encryption Usage</h3>

      <ResponsiveContainer width="100%" height={300}>
  <BarChart data={methodData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip {...tooltipFix} />

    {/* ✅ FIX: disable active highlight completely */}
    <Bar
      dataKey="value"
      fill="#2563eb"
      isAnimationActive={false}
      activeBar={false}
      barSize={40}
    />
  </BarChart>
</ResponsiveContainer>
</div>

      {/* PIE + LINE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(400px,1fr))",
        gap: "25px"
      }}>

        {/* PIE CHART */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
        }}>
          <h3>Method Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
  data={methodData}
  dataKey="value"
  outerRadius={110}
  label
  stroke="none"
  isAnimationActive={false}
  activeIndex={-1}
  activeShape={null}
>
  {methodData.map((entry, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
      stroke="none"
    />
  ))}
</Pie>

              <Tooltip {...tooltipFix} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
        }}>
          <h3>Activity Timeline</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip {...tooltipFix} />

              <Line
                type="monotone"
                dataKey="messages"
                stroke="#16a34a"
                strokeWidth={3}
                dot={false}
                activeDot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Profile;