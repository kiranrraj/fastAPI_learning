// Button.jsx - The Generic React Component File

import React from "react";
import "./Button.module.css";

// Define the props interface for the Button component.
// By extending React.ButtonHTMLAttributes<HTMLButtonElement>, our component
// will accept all standard button props like 'onClick', 'disabled', 'type', etc.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "icon";
  size?: "default" | "sm" | "lg";
  // The 'children' prop is already included in React.ButtonHTMLAttributes
}

/**
 * A generic, reusable button component with different visual styles.
 */
const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  // Combine the base class, variant, size, and any additional classes.
  const buttonClassName =
    `button button--variant-${variant} button--size-${size} ${className}`.trim();

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
