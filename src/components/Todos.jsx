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

  // 1) Hent role fra profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await userService.getProfile();
        setRole(profileData.role);

        // Hvis brugeren er "child", sæt filter = "Mine"
        if (profileData.role?.toLowerCase() === "child") {
          setFilter("Mine");
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // 2) Hent todos baseret på filter
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await todoService.getTodos(filter);
        // Simpel visuel "indlæsnings-effekt"
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

  // Er brugeren child? (=> ingen dropdown)
  const isChild = role?.toLowerCase() === "child";

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>

        {/* 3) Hvis IKKE child, vis filter-dropdown */}
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

      {/* Todos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 h-32 animate-pulse rounded"
                />
              ))
          : todos.map((todo) => <TodoCard key={todo.id} todo={todo} />)}
      </div>
    </div>
  );
};

export default Todos;
