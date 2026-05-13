// src/core/ui_components/Button.jsx
import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | secondary | text | success | error
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = "",
  icon = null,
  iconPosition = "left", // left | right
}) => {
  const baseStyle =
    "inline-flex justify-center items-center font-black uppercase tracking-widest text-[10px] transition-all duration-300 rounded-2xl active:scale-95 disabled:pointer-events-none";
  
  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary-lightest hover:bg-primary-hover hover:shadow-xl active:bg-primary-active disabled:bg-primary-light disabled:shadow-none",
    secondary:
      "bg-white text-primary border-2 border-slate-50 hover:border-primary hover:bg-primary-lightest active:bg-primary-light disabled:text-slate-300 disabled:border-slate-50",
    text: 
      "bg-transparent text-slate-400 hover:text-primary hover:bg-primary-lightest active:bg-primary-light disabled:text-slate-200",
    success:
      "bg-success text-white shadow-lg shadow-emerald-100 hover:brightness-110 active:brightness-90 disabled:opacity-50",
    error:
      "bg-error text-white shadow-lg shadow-red-100 hover:brightness-110 active:brightness-90 disabled:opacity-50",
  };

  const sizes = {
    primary: "px-10 py-5",
    secondary: "px-8 py-4",
    text: "px-4 py-2",
    success: "px-10 py-5",
    error: "px-10 py-5",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[variant]} ${widthStyle} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Syncing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && iconPosition === "left" && <span className="text-sm">{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span className="text-sm">{icon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
