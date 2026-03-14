import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  active = false,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex-1 py-5 text-lg font-semibold transition-all duration-200
        ${active ? "text-white border-b-4 border-white" : "text-white/50"}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
