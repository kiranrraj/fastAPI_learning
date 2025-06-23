import React from "react";

interface CardFooterProps {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => (
  <div className="p-2 border-t bg-gray-50 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
    {children}
  </div>
);

export default React.memo(CardFooter);
