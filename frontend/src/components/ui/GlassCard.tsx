import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    style?: React.CSSProperties;
}

export const GlassCard = ({ children, className = '', hover = true, style }: GlassCardProps) => {
    return (
        <div
            style={style}
            className={`
                glass-panel rounded-3xl p-8 
                ${hover ? 'transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : ''} 
                ${className}
            `}
        >
            {children}
        </div>
    );
};
