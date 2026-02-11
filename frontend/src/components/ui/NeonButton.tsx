import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const NeonButton = ({
    children,
    variant = 'primary',
    fullWidth = false,
    size = 'md',
    className = '',
    ...props
}: NeonButtonProps) => {
    const baseStyles = "relative font-bold transition-all duration-500 rounded-xl overflow-hidden group flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    const variants = {
        primary: "bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
        secondary: "bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]",
        ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-sm",
        danger: "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthClass} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
        </button>
    );
};
