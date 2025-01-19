import React from "react";

const TodoCard = ({ todo }) => {
  if (todo.isLoading) {
    return (
      <div className="bg-white shadow-md  rounded-2xl p-4 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md h-50 rounded-2xl p-4 mb-4">
      <h2
        className="text-xl font-bold mb-2 truncate"
        style={{ maxWidth: "80ch" }}
      >
        {todo.title}
      </h2>
      <p className="text-gray-600 mb-2">{todo.description}</p>
      <p className="text-sm text-gray-500">
        Created At: {new Date(todo.createdAt).toLocaleDateString()}
      </p>
      <p
        className={`mt-2 font-semibold ${
          todo.isCompleted ? "text-green-500" : "text-red-500"
        }`}
      >
        {todo.isCompleted ? "Completed" : "Not completed"}
      </p>
    </div>
  );
};

export default TodoCard;
