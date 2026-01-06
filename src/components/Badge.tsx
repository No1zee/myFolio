import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'success' | 'warning';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string; // Allow overrides
}

const variants = {
    primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    secondary: "bg-brand-surface-alt text-gray-400 border-gray-700",
    outline: "bg-transparent text-brand-primary border-brand-primary/30",
    success: "bg-brand-success/10 text-brand-success border-brand-success/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
    return (
        <span className={`
            inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono border
            tracking-wide uppercase
            ${variants[variant]}
            ${className}
        `}>
            {children}
        </span>
    );
};
