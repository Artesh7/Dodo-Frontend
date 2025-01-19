import React, { useEffect, useState } from "react";
import todoService from "../services/todoService";
import userService from "../services/userService";  // Hent profil for rolle
import TodoCard from "./TodoCard";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All"); // Default filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [role, setRole] = useState(null);

  // Hent rolle fra /User/profile (så vi ved om det er en child)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setRole(profileData.role);

        // Hvis brugeren er "child", sæt filter = "Mine" og lad dropdown forsvinde
        if (profileData.role === "child") {
          setFilter("Mine");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Hent todos på baggrund af filter
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await todoService.getTodos(filter);
        const todosWithLoading = response.map((todo) => ({
          ...todo,
          isLoading: true,
        }));
        setTodos(todosWithLoading);

        setTimeout(() => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) => ({
              ...todo,
              isLoading: false,
            }))
          );
        }, 1000);
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

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
        {/* Skjul filter, hvis brugerens rolle er child */}
        {role !== "child" && (
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
      {/* Todos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 h-32 animate-pulse rounded"
                ></div>
              ))
          : todos.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      </div>
    </div>
  );
};

export default Todos;
