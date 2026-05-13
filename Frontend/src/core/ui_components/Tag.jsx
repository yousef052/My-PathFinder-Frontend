// src/core/ui_components/Tag.jsx
import React from "react";

const Tag = ({ text, type = "primary", className = "" }) => {
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary-lightest",
    secondary: "bg-neutral-100 text-neutral-500",
    success: "bg-success text-white shadow-lg shadow-emerald-100",
    warning: "bg-warning text-white shadow-lg shadow-amber-100",
    error: "bg-error text-white shadow-lg shadow-red-100",
    purple: "bg-purple-500 text-white shadow-lg shadow-purple-100",
    ghost: "border-2 border-neutral-100 text-neutral-400 bg-white"
  };

  return (
    <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:scale-110 cursor-default flex items-center gap-2 ${variants[type]} ${className}`}>
      {text}
    </div>
  );
};

export default Tag;
