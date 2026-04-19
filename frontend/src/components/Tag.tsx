import React from 'react';

interface TagProps {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ 
  children, 
  bg = "bg-blue-50", 
  color = "text-blue-600",
  className = ""
}) => {
  return (
    <span className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${bg} ${color} ${className}`}>
      {children}
    </span>
  );
};
