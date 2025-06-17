import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface AnswerOptionProps {
  text: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const colorMap = {
  red: 'bg-red-500 hover:bg-red-600',
  blue: 'bg-blue-500 hover:bg-blue-600',
  yellow: 'bg-yellow-500 hover:bg-yellow-600',
  green: 'bg-green-500 hover:bg-green-600',
};

const iconMap = {
  red: '🔴',
  blue: '🔵',
  yellow: '🟡',
  green: '🟢',
};

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  text,
  color,
  isSelected,
  isCorrect,
  isWrong,
  onClick,
  disabled,
}) => {
  const getStateStyles = () => {
    if (isCorrect) return 'bg-green-500 ring-4 ring-green-300';
    if (isWrong) return 'bg-red-500 ring-4 ring-red-300';
    if (isSelected) return 'ring-4 ring-purple-300';
    return colorMap[color];
  };

  return (
    <motion.button
      className={twMerge(
        'w-full p-4 rounded-xl text-white text-lg font-bold shadow-lg transition-all duration-200',
        getStateStyles(),
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{iconMap[color]}</span>
        <span>{text}</span>
      </div>
    </motion.button>
  );
}; 