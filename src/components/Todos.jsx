import React, { useEffect, useState } from "react";
import todoService from "../services/todoService";
import userService from "../services/userService";
import TodoCard from "./TodoCard";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  // Hent rolle for at se, om man er child
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setRole(profileData.role);
        // child => default filter "Mine"
        if (profileData.role?.toLowerCase() === "child") {
          setFilter("Mine");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Hent todos
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await todoService.getTodos(filter);
        setTodos(response);
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

  if (loading) {
    return <div>Loading...</div>;
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
            className="block w-48 p-2 border border-gray-300 bg-white rounded shadow-sm focus:outline-none"
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
