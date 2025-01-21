import React, { useEffect, useState } from "react";
import todoService from "../services/todoService";
import userService from "../services/userService";
import TodoCard from "./TodoCard";
import { Link } from "react-router-dom";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setRole(profileData.role);

        if (profileData.role?.toLowerCase() === "child") {
          setFilter("Mine");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await todoService.getTodos(filter);
        setTodos(
          response.map((todo) => ({
            ...todo,
            isLoading: false,
          }))
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load todos.");
        setLoading(false);
      }
    };
    fetchTodos();
  }, [filter]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const isChild = role?.toLowerCase() === "child";

  // Hvis stadig loading
  if (loading) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  // Tjek om listen er tom
  if (!loading && todos.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Todos</h1>
        <p className="mb-4">You currently have no todos.</p>
        <Link
          to="/add-todo"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Todo
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>

        {!isChild && (
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-48 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Todos</option>
            <option value="Mine">My Todos</option>
            <option value="Child">Child's Todos</option>
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default Todos;
