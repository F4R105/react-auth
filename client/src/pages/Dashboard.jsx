import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { currentUser, token, setToken } = useAuthContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    setToken(null)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const response = await fetch(import.meta.env.VITE_SERVER_URL + '/data', {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + token
        }
      })

      const data = await response.json()
      if(response.status === 401) handleLogout()
      if(response.status !== 200) throw new Error(data.error)
      setData(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <button className="btn btn-primary mb-2 w-full md:w-auto" onClick={getData}>{loading ? "Loading" : "Get data" }</button>
          </li>
          <li>
            <button className="btn btn-secondary w-full md:w-auto" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-1xl font-bold text-center md:text-left">Email: {currentUser},</h2>
        <h1 className="text-3xl font-bold text-center md:text-left">
          { data ? data : "Welcome to Your Dashboard"}
        </h1>
        <p classname="text-red-500">{error}</p>

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
