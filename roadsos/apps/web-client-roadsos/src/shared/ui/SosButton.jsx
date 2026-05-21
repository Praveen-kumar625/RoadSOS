'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

export const SosButton = React.forwardRef(
  ({ className, onSosTriggered, isDispatching, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        {/* Pulsing background layers for high-prominence glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-primary/40 blur-md"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />

        {/* Core SOS Button */}
        <motion.button
          ref={ref}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'relative z-10 flex h-32 w-32 items-center justify-center rounded-full',
            'bg-emergency-gradient shadow-sos-btn border-4 border-white/20',
            'text-4xl font-extrabold tracking-widest text-white',
            'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          onClick={(e) => {
            if (onSosTriggered) {
              onSosTriggered();
            }
            if (props.onClick) {
              props.onClick(e);
            }
          }}
          aria-label="Trigger Emergency SOS"
          disabled={isDispatching || props.disabled}
          {...props}
        >
          {isDispatching ? (
            <span className="text-xl">SENDING</span>
          ) : (
            <span>SOS</span>
          )}
        </motion.button>
      </div>
    );
  }
);

SosButton.displayName = 'SosButton';
