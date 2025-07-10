import React from "react";
import { ShieldX, Clock } from "lucide-react";
import type { AlertProps } from "@/app/types/alert";

export const Alert = ({ type, message }: AlertProps) => (
  <div className={`alert alert-${type}`}>
    {type === "error" && <ShieldX className="alert-icon" />}
    {type === "info" && <Clock className="alert-icon" />}
    {message}
  </div>
);
