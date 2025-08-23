# Star Rating System

## Overview

The PeerPen website now features a proper 5-star rating system that allows users to rate essays from 1-5 stars with interactive star components.

## Components

### StarRating
Interactive star rating component for user input.

**Props:**
- `rating: number` - Current rating (0-5)
- `onRatingChange?: (rating: number) => void` - Callback when rating changes
- `readonly?: boolean` - Whether the component is read-only
- `size?: 'sm' | 'md' | 'lg'` - Star size
- `showScore?: boolean` - Whether to show the numeric score
- `className?: string` - Additional CSS classes

**Features:**
- Click to rate 1-5 stars
- Click same star again to remove rating (set to 0)
- Hover effects with preview
- Smooth animations and transitions
- Accessible button controls

### StarRatingDisplay
Display-only component for showing average ratings.

**Props:**
- `rating: number` - Rating to display (0-5)
- `size?: 'sm' | 'md' | 'lg'` - Star size
- `showScore?: boolean` - Whether to show the numeric score
- `className?: string` - Additional CSS classes

## Usage Examples

### Interactive Rating
```tsx
import { StarRating } from '@/components/ui/star-rating';

function EssayComponent() {
  const [userRating, setUserRating] = useState(0);
  
  const handleRatingChange = async (newRating: number) => {
    // Send rating to API
    const response = await fetch(`/api/essays/${essayId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: newRating })
    });
    
    if (response.ok) {
      setUserRating(newRating);
    }
  };

  return (
    <StarRating
      rating={userRating}
      onRatingChange={handleRatingChange}
      size="md"
      showScore={true}
    />
  );
}
```

### Display Average Rating
```tsx
import { StarRatingDisplay } from '@/components/ui/star-rating';

function EssayCard({ essay }) {
  return (
    <div className="flex items-center gap-2">
      <StarRatingDisplay
        rating={essay.avgRating}
        size="sm"
        showScore={true}
      />
      <span>({essay.ratingCount} ratings)</span>
    </div>
  );
}
```

## API Integration

The rating system integrates with the existing `/api/essays/[id]/like` endpoint:

### POST Request
```json
{
  "score": 4  // 0-5, where 0 removes the rating
}
```

### Response
```json
{
  "success": true,
  "rated": true,
  "score": 4,
  "message": "Essay rated successfully"
}
```

### GET Request
Returns current rating status:
```json
{
  "ratingCount": 15,
  "userRating": 4,
  "avgRating": 3.8
}
```

## Database Schema

The ratings are stored in the `ratings` table:
```sql
CREATE TABLE ratings (
  id TEXT PRIMARY KEY,
  essay_id TEXT NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  rater_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (essay_id, rater_id)
);
```

## Features

- **Interactive 5-star rating**: Users can click stars to rate 1-5
- **Rating removal**: Click the same star again to remove rating
- **Hover preview**: See what rating will be applied before clicking
- **Real-time updates**: Ratings update immediately in the UI
- **Average display**: Shows average rating with star visualization
- **Rating count**: Displays total number of ratings
- **Responsive design**: Works on mobile and desktop
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Implementation Details

1. **Frontend**: React components with TypeScript
2. **Styling**: Tailwind CSS with smooth transitions
3. **State Management**: Local state with API synchronization
4. **Validation**: Client and server-side validation (1-5 range)
5. **Error Handling**: Toast notifications for success/error states

## Migration from Like System

The previous like/unlike system has been replaced with the 5-star rating system:
- Old: Binary like/unlike (1 or 0)
- New: 1-5 star rating with 0 for removal
- Backward compatible: API accepts both old and new formats
- UI updated: All like buttons replaced with star ratings

