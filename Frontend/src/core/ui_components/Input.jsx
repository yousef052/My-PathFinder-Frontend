// src/core/ui_components/Input.jsx
import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="ml-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full ${icon ? "pl-14" : "px-6"} py-4 bg-neutral-50 rounded-2xl border-2 border-transparent outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary-lightest transition-all font-bold text-sm shadow-inner ${
            error ? "border-error-light bg-error/5 focus:border-error focus:ring-error-light" : ""
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-red-500 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
