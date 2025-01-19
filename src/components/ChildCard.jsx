import React from "react";

const ChildCard = ({ child, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-4 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{child.userName}</h2>
      <p className="text-gray-600 mb-2">{child.email}</p>
    </div>
  );
};

export default ChildCard;
