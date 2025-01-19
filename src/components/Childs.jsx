import React, { useEffect, useState } from "react";
import userService from "../services/userService";
import ChildCard from "./ChildCard";

const Childs = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // Simulate shimmer effect for all cards initially
        const placeholderData = Array(6).fill({ isLoading: true });
        setChildren(placeholderData);

        const data = await userService.getChildren();
        setTimeout(() => {
          setChildren(
            data.map((child) => ({
              ...child,
              isLoading: false,
            }))
          );
          setLoading(false);
        }, 1000); // Simulated delay for the shimmer effect
      } catch (err) {
        setError("Failed to load children.");
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Children</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child, index) => (
          <ChildCard
            key={child.id || index}
            child={child}
            isLoading={child.isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default Childs;
