import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterChip {
  label: string;
  value: string;
  gradient: string;
}

interface ModernFilterChipsProps {
  filters: string[];
  onFilterToggle: (value: string) => void;
}

const filterOptions: FilterChip[] = [
  { label: 'Club Events', value: 'social', gradient: 'from-blue-500 to-cyan-500' },
  { label: 'Free Food', value: 'free food', gradient: 'from-red-500 to-orange-500' },
  { label: 'Campus Events', value: 'academic', gradient: 'from-purple-500 to-pink-500' },
  { label: 'Sports', value: 'sports', gradient: 'from-green-500 to-emerald-500' },
  { label: 'Entertainment', value: 'entertainment', gradient: 'from-pink-500 to-rose-500' },
  { label: 'Arts', value: 'arts', gradient: 'from-orange-500 to-amber-500' },
];

export const ModernFilterChips = ({ filters, onFilterToggle }: ModernFilterChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filterOptions.map((option) => {
        const isActive = filters.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onFilterToggle(option.value)}
            className={`
              flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
              transition-all duration-200 whitespace-nowrap shrink-0
              ${
                isActive
                  ? `bg-gradient-to-r ${option.gradient} text-white shadow-md scale-105`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {option.label}
            {isActive && <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" />}
          </button>
        );
      })}
    </div>
  );
};
