import React from "react";

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-4">{children}</div>
);

export default React.memo(CardContent);
