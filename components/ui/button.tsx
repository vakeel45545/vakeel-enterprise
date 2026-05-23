import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Custom premium Tailwind classes
    const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage disabled:pointer-events-none disabled:opacity-50 tracking-wide";
    
    const variants = {
      default: "bg-sage text-white shadow hover:bg-sage/90 hover:shadow-lg hover:-translate-y-0.5",
      outline: "border border-sage/20 bg-transparent text-charcoal shadow-sm hover:bg-sage/10",
      secondary: "bg-amber text-white shadow-sm hover:bg-amber/90 hover:shadow-lg hover:-translate-y-0.5",
      ghost: "hover:bg-sage/10 hover:text-sage text-charcoal",
      link: "text-sage underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-md px-4 text-xs",
      lg: "h-14 rounded-xl px-8 text-base",
      icon: "h-11 w-11",
    }
    
    return (
      <Comp
        className={cn(baseClass, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
