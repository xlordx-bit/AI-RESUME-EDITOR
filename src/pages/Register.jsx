import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log("User registered successfully:", userCredential.user);
      
      // Force a small delay to ensure Firebase has time to update auth state
      setTimeout(() => {
        navigate("/setup-profile");
      }, 500);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <div className="glass rounded-xl shadow-lg border border-primary-800/30 p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-bold text-center gradient-text mb-6">
          Create Account
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full bg-dark-800 text-gray-200 border border-dark-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-dark-800 text-gray-200 border border-dark-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-primary-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full bg-dark-800 text-gray-200 border border-dark-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/20 transform hover:-translate-y-0.5"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 hover:underline transition-colors duration-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
