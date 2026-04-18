import React from 'react';
import { Star } from 'lucide-react';

interface StarsProps {
  rating: number;
  size?: number;
}

export const Stars: React.FC<StarsProps> = ({ rating, size = 12 }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200"}
        />
      ))}
    </div>
  );
};
