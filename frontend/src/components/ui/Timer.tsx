import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onComplete,
  size = 'md',
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const sizes = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl',
  };

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="relative">
      <motion.div
        className={`${sizes[size]} rounded-full bg-white shadow-lg flex items-center justify-center font-bold text-purple-600`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        {timeLeft}
      </motion.div>
      <svg
        className="absolute top-0 left-0 -rotate-90"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
      >
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="46"
          cx="50"
          cy="50"
        />
        <motion.circle
          className="text-purple-600"
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="46"
          cx="50"
          cy="50"
          initial={{ pathLength: 1 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 0.1 }}
        />
      </svg>
    </div>
  );
}; 