import { useState } from "react";
import axios from "axios";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isLogin = type === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await axios.post(endpoint, { email, password });
      setMessage(isLogin ? "Logged in successfully!" : "Account created!");
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-600">{message}</p>
        )}

        <p className="mt-4 text-sm text-center">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
