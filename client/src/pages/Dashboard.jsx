import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser,token } = useAuthContext()

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-base-300 p-4">
        <h2 className="text-xl font-bold mb-4 text-center md:text-left">
          Dashboard
        </h2>
        <ul className="menu flex md:block justify-center md:w-full">
          <li>
            <a className="btn btn-primary mb-2 w-full md:w-auto">Overview</a>
          </li>
          <li>
            <Link className="btn btn-secondary w-full md:w-auto">Logout</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-1xl font-bold text-center md:text-left">Email: {currentUser.email},</h2>
        <h1 className="text-3xl font-bold text-center md:text-left">
          Welcome to Your Dashboard
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="card bg-primary text-primary-content p-4 shadow-lg">
            <p className="text-center">Total Users: 120</p>
          </div>
          <div className="card bg-secondary text-secondary-content p-4 shadow-lg">
            <p className="text-center">Active Sessions: 45</p>
          </div>
          <div className="card bg-accent text-accent-content p-4 shadow-lg">
            <p className="text-center">New Signups: 8</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
