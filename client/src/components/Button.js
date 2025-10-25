import s from "./Button.module.css";
import React from "react";

export default function Button({ 
    children,
    onClick,
    type = "button",
    variant = "primary", // "primary" or "secondary"
    disabled = false,
    className = "",
 }) {
    return (
        <button
            type={type}
            className={`${s.btn} ${s[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
 };