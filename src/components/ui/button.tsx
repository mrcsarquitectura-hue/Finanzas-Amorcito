import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
      outline: "border border-slate-800 bg-transparent hover:bg-slate-800 text-slate-200",
      ghost: "hover:bg-slate-800 text-slate-300",
      gradient: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 shadow-lg shadow-purple-900/30 border border-purple-400/20"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 px-4 py-2.5 active:scale-[0.98]",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";