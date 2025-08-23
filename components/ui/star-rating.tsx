import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showScore = false,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleStarClick = (starValue: number) => {
    if (readonly) return;
    
    // If clicking the same star, remove the rating (set to 0)
    const newRating = rating === starValue ? 0 : starValue;
    onRatingChange?.(newRating);
  };

  const handleStarHover = (starValue: number) => {
    if (readonly) return;
    setHoverRating(starValue);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
    setIsHovering(false);
  };

  const displayRating = isHovering ? hoverRating : rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starValue) => (
          <button
            key={starValue}
            type="button"
            className={cn(
              "transition-colors duration-150 ease-in-out",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default"
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            disabled={readonly}
          >
            <Star
              className={cn(
                sizeClasses[size],
                displayRating >= starValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300 hover:text-yellow-300"
              )}
            />
          </button>
        ))}
      </div>
      {showScore && rating > 0 && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

// Display-only version for showing average ratings
export function StarRatingDisplay({
  rating,
  size = 'md',
  showScore = false,
  className
}: Omit<StarRatingProps, 'onRatingChange' | 'readonly'>) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star
            key={starValue}
            className={cn(
              sizeClasses[size],
              rating >= starValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            )}
          />
        ))}
      </div>
      {showScore && rating > 0 && (
        <span className="text-sm font-medium text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

