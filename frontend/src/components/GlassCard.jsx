import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const GlassCard = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl transition-all duration-500',
        hover && 'hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] hover:border-purple-500/30',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
