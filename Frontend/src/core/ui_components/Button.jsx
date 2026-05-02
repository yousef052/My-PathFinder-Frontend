// src/core/ui_components/Button.jsx
import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  isLoading = false,
}) => {
  const baseStyle =
    "flex justify-center items-center py-4 px-8 rounded-full font-black transition-all duration-300 text-xs uppercase tracking-widest";
  const variants = {
    primary:
      "bg-[#5b7cfa] hover:bg-[#3652d9] text-white shadow-xl shadow-blue-100/50 active:scale-95",
    outline:
      "border-2 border-gray-100 bg-transparent text-gray-500 hover:border-[#5b7cfa] hover:text-[#5b7cfa]",
    text: "bg-transparent text-[#5b7cfa] hover:underline",
  };
  const widthStyle = fullWidth ? "w-full" : "w-auto";
  const stateStyle =
    disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${stateStyle}`}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 mr-3 text-current"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? "Processing..." : children}
    </button>
  );
};
export default Button;
