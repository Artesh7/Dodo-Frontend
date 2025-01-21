import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // <-- VIGTIGT: importer Link

function Home() {
  useEffect(() => {
    // Prevent scrolling when on the home page
    document.body.style.overflow = "hidden";

    // Cleanup function to re-enable scrolling when leaving the page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-20">
      <div className="max-w-5xl mx-auto text-center px-6 pt-20 pb-16 bg-white shadow-lg rounded-3xl">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">
          Welcome to TODOZ!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          TODOZ is your ultimate task management platform. Organize your daily
          activities, track progress, and collaborate with your family or team
          like never before. Simple, efficient, and designed to keep you
          focused on what matters most.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-indigo-700">Plan</h2>
            <p className="text-gray-600 mt-2">
              Create and manage tasks effortlessly with our intuitive interface.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-indigo-700">Track</h2>
            <p className="text-gray-600 mt-2">
              Keep track of your progress with detailed task insights.
            </p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-indigo-700">Collaborate</h2>
            <p className="text-gray-600 mt-2">
              Work together with your family or team seamlessly and securely.
            </p>
          </div>
        </div>
        <div className="mt-20">
          {/* Brug Link i stedet for <a>, og peg på /login */}
          <Link
            to="/login"
            className="bg-indigo-700 text-white py-2 px-6 rounded hover:bg-indigo-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
