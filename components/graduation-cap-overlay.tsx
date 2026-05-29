import React from 'react';
import { motion } from 'framer-motion';

interface GraduationCapOverlayProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GraduationCapOverlay({ className, style }: GraduationCapOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, rotate: -15 }}
      animate={{ opacity: 1, y: 0, rotate: -8 }}
      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      className={className}
      style={{
        position: 'absolute',
        top: '-10px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-8deg)',
        width: '80px', // Default width, can be overridden
        filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))',
        zIndex: 10,
        ...style,
      }}
    >
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Mortarboard board depth (side edges) */}
        <path d="M15 45 L15 50 L60 70 L60 65 Z" fill="#000000" /> {/* Darker black for depth */}
        <path d="M60 70 L105 50 L105 45 L60 65 Z" fill="#000000" /> {/* Darker black for depth */}

        {/* Mortarboard Top Surface */}
        <path d="M15 45 L60 25 L105 45 L60 65 Z" fill="#1a1a1a" /> {/* Slightly lighter black for top */}

        {/* Glossy highlight on top */}
        <path d="M60 28 L95 45 L60 62 L25 45 Z" fill="url(#glossy_cap_profile)" opacity="0.2" />

        {/* Cap Body (The part that fits the head) */}
        <path d="M35 62 Q35 85 60 90 Q85 85 85 62 L85 58 Q60 65 35 58 Z" fill="#0a0a0a" /> {/* Dark black for body */}

        {/* Tassel Button */}
        <circle cx="60" cy="45" r="3.5" fill="#c9a45c" />
        <circle cx="60" cy="45" r="1.5" fill="#e8c98c" />

        {/* Tassel Cord and Fringe */}
        <path d="M60 45 C75 45 88 52 88 72" stroke="#c9a45c" strokeWidth="2" strokeLinecap="round" fill="none" />
        <g transform="translate(82, 70) rotate(15)">
          <rect x="0" y="0" width="12" height="20" rx="2" fill="#c9a45c" />
          <line x1="3" y1="2" x2="3" y2="18" stroke="#8b6b1b" strokeWidth="0.5" />
          <line x1="6" y1="2" x2="6" y2="18" stroke="#8b6b1b" strokeWidth="0.5" />
          <line x1="9" y1="2" x2="9" y2="18" stroke="#8b6b1b" strokeWidth="0.5" />
          <rect x="-1" y="0" width="14" height="4" rx="1" fill="#8b6b1b" />
        </g>
        <defs>
          <linearGradient id="glossy_cap_profile" x1="60" y1="25" x2="60" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}