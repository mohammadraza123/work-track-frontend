import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  loader?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  active = false,
  onClick,
  className = "",
  type = "button",
  loader = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loader}
      className={`w-full bg-white text-black font-semibold text-xl py-5 rounded-3xl
  active:scale-[0.97] transition-all duration-200 shadow-lg shadow-black/30
  disabled:opacity-100 ${className}`}
    >
      {loader ? (
        <div className="button-loader py-1.5">
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
