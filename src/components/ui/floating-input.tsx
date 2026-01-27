import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, required, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="floating-label-container">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn("floating-input peer", className)}
          {...props}
        />
        <label htmlFor={inputId} className="floating-label">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
