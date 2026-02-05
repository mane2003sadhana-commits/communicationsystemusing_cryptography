import { Navigate } from "react-router-dom";
import { auth } from "../Firebaseconfig";

const ProtectedRoute = ({ children, roleRequired }) => {
  const user = auth.currentUser;
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;
