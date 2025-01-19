import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

function Dashboard() {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button> */}
    </div>
  );
}

export default Dashboard;
