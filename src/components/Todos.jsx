import React, { useEffect, useState } from "react";
import todoService from "../services/todoService";
import TodoCard from "./TodoCard";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All"); // Default filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true); // Set loading to true when filter changes
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
  }, [filter]); // Refetch todos when filter changes

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todos</h1>
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
