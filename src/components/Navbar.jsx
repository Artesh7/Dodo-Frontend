import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/images/logo.png";
import userService from "../services/userService";

function Navbar() {
  const { auth, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.token) {
        try {
          const profileData = await userService.getProfile();
          setUserName(profileData.userName);
          setRole(profileData.role); // Gem hele role-strengen
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };
    fetchProfile();
  }, [auth.token]);

  const handleProfileClick = async () => {
    try {
      const profileData = await userService.getProfile();
      setProfile(profileData);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // Brug en hjælpemetode til at tjekke "child"
  const isChild = role && role.toLowerCase() === "child";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Venstre side: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src={Logo} alt="TODOZ Logo" />
              <span className="text-white text-xl font-bold ml-2">TODOZ</span>
            </Link>
          </div>

          {/* Højre side: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Skjul Home-knap, når brugeren er logget ind */}
            {!auth.token && (
              <Link
                to="/"
                className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
              >
                Home
              </Link>
            )}

            {/* Hvis logget ind */}
            {auth.token ? (
              <>
                <Link
                  to="/todos"
                  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  Todos
                </Link>

                {/* Childs-knappen: vises kun, hvis role !== 'child' */}
                {!isChild && (
                  <Link
                    to="/childs"
                    className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                  >
                    Childs
                  </Link>
                )}

                <Link
                  to="/add-todo"
                  className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
                >
                  Add Todo
                </Link>

                {/* Dropdown for profil/logout */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-white flex items-center space-x-2 focus:outline-none"
                  >
                    <span>{userName}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile-menu-knap (hamburger) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile-menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Skjul Home-knap, når logget ind */}
            {!auth.token && (
              <Link
                to="/"
                className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
              >
                Home
              </Link>
            )}

            {auth.token ? (
              <>
                <Link
                  to="/todos"
                  className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                >
                  Todos
                </Link>

                {/* Childs-knappen: kun hvis IKKE child */}
                {!isChild && (
                  <Link
                    to="/childs"
                    className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                  >
                    Childs
                  </Link>
                )}

                <Link
                  to="/add-todo"
                  className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                >
                  Add Todo
                </Link>

                <button
                  onClick={handleProfileClick}
                  className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                >
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-gray-900 hover:text-white block rounded-md px-3 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && profile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Profile Details</h2>
            <p>
              <strong>Username:</strong> {profile.userName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Role:</strong> {profile.role || "N/A"}
            </p>
            <button
              className="mt-4 bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-600"
              onClick={() => setShowProfileModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
