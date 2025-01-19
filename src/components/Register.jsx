// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import userService from "../services/userService";
// import { useAuth } from "../contexts/AuthContext";

// function Register() {
//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleRegister = async (event) => {
//     event.preventDefault();
//     try {
//       // Call the API to register the user
//       await userService.register({ userName, email, password });

//       // Automatically log in after registration
//       await login({ email, password });

//       // Redirect to the profile page
//       navigate("/profile");
//     } catch (error) {
//       console.error("Registration failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
//         <form onSubmit={handleRegister} className="space-y-4">
//           <div>
//             <label
//               htmlFor="userName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Username:
//             </label>
//             <input
//               type="text"
//               id="userName"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Email:
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password:
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;
