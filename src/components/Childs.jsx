import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";
import ChildCard from "./ChildCard";
import { useAuth } from "../contexts/AuthContext";

const Childs = () => {
  const { auth } = useAuth();
  const [role, setRole] = useState(null);

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Hent profil for at se, om det er en "parent"
  useEffect(() => {
    const fetchProfileAndChildren = async () => {
      try {
        // Hent profil => se rolle
        if (auth.token) {
          const profileData = await userService.getProfile();
          setRole(profileData.role); 
        }

        // "Shimmer" placeholder
        const placeholderData = Array(6).fill({ isLoading: true });
        setChildren(placeholderData);

        // Fetch children
        const data = await userService.getChildren();
        setTimeout(() => {
          setChildren(
            data.map((child) => ({
              ...child,
              isLoading: false,
            }))
          );
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load children.");
        setLoading(false);
      }
    };
    fetchProfileAndChildren();
  }, [auth.token]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const isParent = role?.toLowerCase() === "parent";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Children</h1>

        {/* Viser knap kun hvis forælder */}
        {isParent && (
          <Link
            to="/create-child"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
          >
            Create Child
          </Link>
        )}
      </div>

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
