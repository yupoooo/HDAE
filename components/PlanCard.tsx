import React from 'react';
import type { HealthPlanItem } from '../types';
import { PlanItemCategory } from '../types';
import { ActivityIcon, BrainCircuitIcon, HeartPulseIcon, ScaleIcon } from './icons/Icons';

interface PlanCardProps {
  item: HealthPlanItem;
  onToggle: () => void;
}

const categoryIcon = (category: PlanItemCategory) => {
  switch (category) {
    case PlanItemCategory.EXERCISE:
      return <ActivityIcon className="w-5 h-5 text-blue-500" />;
    case PlanItemCategory.DIET:
      return <ScaleIcon className="w-5 h-5 text-green-500" />;
    case PlanItemCategory.MINDFULNESS:
      return <BrainCircuitIcon className="w-5 h-5 text-purple-500" />;
    case PlanItemCategory.MONITORING:
      return <HeartPulseIcon className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

export const PlanCard: React.FC<PlanCardProps> = ({ item, onToggle }) => {
  return (
    <div
      className={`flex items-start p-4 rounded-lg border-2 transition-all duration-300 ${
        item.completed
          ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
          : 'bg-white dark:bg-gray-800 border-transparent shadow-sm hover:shadow-md'
      }`}
    >
      <div className="ml-4 pt-1">{categoryIcon(item.category)}</div>
      <div className="flex-grow">
        <h3 className={`font-semibold transition-colors ${item.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
          {item.title}
        </h3>
        <p className={`text-sm transition-colors ${item.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {item.description}
        </p>
        {item.duration && (
          <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full mt-2 inline-block">
            {item.duration}
          </span>
        )}
      </div>
      <button
        onClick={onToggle}
        aria-label={item.completed ? 'وضع علامة كغير مكتمل' : 'وضع علامة كمكتمل'}
        className={`mr-4 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          item.completed
            ? 'bg-teal-500 border-teal-500'
            : 'border-gray-300 dark:border-gray-500 hover:border-teal-400'
        }`}
      >
        <svg className={`w-4 h-4 text-white transition-all duration-300 ease-in-out transform ${item.completed ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
};
