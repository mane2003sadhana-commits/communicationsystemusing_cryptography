import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landingpg from "./component/Landingpg";
import Login from "./component/Login";
import Register from "./component/Register";
import Userdashboard from "./component/Userdashboard";
import Admindashboard from "./component/Admindashboard";
import ProtectedRoute from "./component/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected User Dashboard */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute roleRequired="user">
              <Userdashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔐 Protected Admin Dashboard */}
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <Admindashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
