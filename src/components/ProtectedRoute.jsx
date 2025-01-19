import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  return auth.token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
