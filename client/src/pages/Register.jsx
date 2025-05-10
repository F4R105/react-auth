import React, { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, setToken, token } = useAuthContext();

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(passwordRef.current.value !== confirmPasswordRef.current.value ){
      return setError("Passwords did not match");
    }

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
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/register",
        options
      );
      const data = await response.json();
      if(response.status !== 200) throw new Error(data.error)
      setCurrentUser(data.email);
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
          <h2 className="text-center text-2xl font-bold">Register</h2>
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
          <div className="form-control mt-2">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder="Confirm password"
              ref={confirmPasswordRef}
            />
          </div>
          <div className="form-control mt-4">
            <button type="submit" className="btn btn-primary w-full">
              {loading ? "Loading..." : "Register"}
            </button>
          </div>

          {error && (
            <div className="form-control mt-2">
              <p className="p-2 text-center bg-red-500 rounded">{error}</p>
            </div>
          )}

          <p className="text-center text-sm mt-2">
            Already have account?{" "}
            <Link to="/" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
