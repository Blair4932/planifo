import React from "react";

interface LabelProps {
  children: React.ReactNode;
  color?: string;
}

const Label: React.FC<LabelProps> = ({ children, color }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className="px-5 py-1 text-white rounded select-none"
    >
      {children}
    </div>
  );
};

export default Label;
