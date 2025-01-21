import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

function CreateChild() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Lokalt state til fejlbesked
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateChild = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Nulstil evt. tidligere fejl
    try {
      await userService.createChild({ userName, email, password });
      navigate("/childs");
    } catch (error) {
      console.error("Create child failed:", error);

      // Hvis serveren returnerer error i { error: "..."}:
      const errMsg = error.response?.data?.error || "Could not create child";
      setErrorMessage(errMsg);
    }
  };

  // Hvis brugeren retter i input, fjern fejlbesked
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Child</h1>

        <form onSubmit={handleCreateChild} className="space-y-4">
         

          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={handleInputChange(setUserName)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 {/* Brug evt. en rød fejlbesked */}
 {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Child
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateChild;
