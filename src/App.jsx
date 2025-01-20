import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import CreateTodo from "./components/CreateTodo";
import TodoDetails from "./components/TodoDetails"; // <-- Ny komponent

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

          {/* Ny rute: vis en todo i detaljer, inkl tasks */}
          <Route
            path="/todo/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TodoDetails />
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
