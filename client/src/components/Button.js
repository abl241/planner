import s from "./Button.module.css";
import React, { useState } from "react";

export default function Button({ 
    children,
    onClick,
    type = "button",
    variant = "primary", // "primary" or "secondary"
    toggled: controlledToggled,
    selfToggle = false,
    disabled = false,
    className = "",
 }) {
    const [internalToggled, setInternalToggled] = useState(false);

    const isToggled = selfToggle ? internalToggled : controlledToggled;

    const handleClick = (e) => {
    if (selfToggle) {
      setInternalToggled((prev) => !prev); // flip internal toggle
    }
    if (onClick) onClick(e); // still call parent handler if provided
  };

    const toggleClass = isToggled ? s.toggledOn : s.toggledOff;

    return (
        <button
            type={type}
            className={`${s.btn} ${s[variant]} ${variant === "toggle" ? `${s.toggle} ${toggleClass}` : ""} ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
 };