// src/core/ui_components/Input.jsx
import React, { useState } from "react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  leftIcon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col mb-4 w-full group">
      {label && (
        <label className="mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center bg-slate-50 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${error ? "border-red-100 ring-1 ring-red-100" : "border-transparent focus-within:border-[#5b7cfa]/20 focus-within:bg-white focus-within:shadow-inner"}`}
      >
        {leftIcon && <span className="pl-4 text-gray-400">{leftIcon}</span>}
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-4 px-5 text-sm font-bold text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-5 text-[#5b7cfa] text-[10px] font-black uppercase tracking-widest"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <span className="mt-2 text-[10px] text-red-500 font-bold pl-1 animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
};
export default Input;
