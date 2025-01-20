import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/layouts/MainLayout";
import Todos from "./components/Todos";
import Home from "./components/Home";
import Childs from "./components/Childs";
import { AuthProvider } from "./contexts/AuthContext";
import CreateUser from "./components/CreateUser"; 
import CreateTodo from "./components/CreateTodo"; // <-- Importér din nye CreateTodo-komponent

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          {/* Ny route til sign up */}
          <Route
            path="/signup"
            element={
              <MainLayout>
                <CreateUser />
              </MainLayout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Todos />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/childs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Childs />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Ny route til CreateTodo (tilføj todo) */}
          <Route
            path="/add-todo"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateTodo />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
