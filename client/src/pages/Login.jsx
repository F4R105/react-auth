import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, setToken, token } = useAuthContext();

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(payload),
    };

    try {
      setLoading(true);
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/api/auth/login",
        options
      );
      const data = await response.json();
      setCurrentUser(data.user);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <form
        onSubmit={handleFormSubmit}
        className="card w-96 bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Login</h2>
          <div className="form-control">
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
              ref={emailRef}
            />
          </div>
          <div className="form-control mt-2">
            <label className="label">Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
              ref={passwordRef}
            />
          </div>
          <div className="form-control mt-4">
            <button className="btn btn-primary w-full">
              {loading ? "Loading..." : "Login"}
            </button>
          </div>

          {error && (
            <div className="form-control mt-2">
              <p className="p-2 text-center bg-red-500 rounded">{error}</p>
            </div>
          )}

          <p className="text-center text-sm mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
