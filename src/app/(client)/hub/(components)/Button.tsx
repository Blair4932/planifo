import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled,
  color,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: color }}
      className="px-5 py-1 text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
    >
      {children}
    </button>
  );
};

export default Button;
