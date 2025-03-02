import React from "react";

interface LabelProps {
  children: React.ReactNode;
  color?: string;
  margin?: string;
}

const Label: React.FC<LabelProps> = ({ children, color, margin }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={`px-5 py-1 text-white rounded select-none w-fit ${margin && margin}`}
    >
      {children}
    </div>
  );
};

export default Label;
