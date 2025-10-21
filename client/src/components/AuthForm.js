import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import s from "./AuthForm.module.css";

export default function AuthForm({ type }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const isLogin = type === "login";

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const endpoint = isLogin ? "/auth/login" : "/auth/register";
        const res = await axios.post(endpoint, { email, password, first_name, last_name });

        if(isLogin) {
            localStorage.setItem("token", res.data.token);
            navigate("/dash/dashboard");
        }

        setMessage(isLogin ? "Logged in successfully!" : "Account created!");
        console.log(res.data);
    } catch (err) {
        setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

    return (
        <div className={s.container}>
            <form
                onSubmit={handleSubmit}
                className={s.formCard}
            >
                <h1 className={s.title}>
                {isLogin ? "Login" : "Register"}
                </h1>
                {isLogin ? null : (
                <>
                    <input
                    type="text"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={s.formInput}
                    />

                    <input
                    type="text"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={s.formInput}
                    />
                </>
                )}

                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={s.formInput}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={s.formInput}
                />

                <button
                type="submit"
                className={s.btnSubmit}
                >
                {isLogin ? "Login" : "Sign Up"}
                </button>

                {message && (
                <p className={s.message}>{message}</p>
                )}

                <p className="mt-4 text-sm text-center">
                {isLogin ? (
                    <>
                    Don’t have an account?{" "}
                    <a href="/register" className={s.link}>
                        Sign up
                    </a>
                    </>
                ) : (
                    <>
                    Already have an account?{" "}
                    <a href="/login" className={s.link}>
                        Login
                    </a>
                    </>
                )}
                </p>
            </form>
        </div>
    );
}
