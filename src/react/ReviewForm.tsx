import React, { useState } from 'react';

type RubricScores = {
  flow: number;
  hook: number;
  voice: number;
  uniqueness: number;
  conciseness: number;
  authenticity: number;
};

export default function ReviewForm({ essayId, onSubmit }: { essayId: string; onSubmit: () => void }) {
  const [summary, setSummary] = useState('');
  const [scores, setScores] = useState<RubricScores>({
    flow: 5, hook: 5, voice: 5, uniqueness: 5, conciseness: 5, authenticity: 5
  });
  const [status, setStatus] = useState('');

  const handleScoreChange = (category: keyof RubricScores, value: number) => {
    setScores(prev => ({ ...prev, [category]: Math.max(0, Math.min(10, value)) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ essayId, summary, scores }),
      });
      
      if (res.ok) {
        setStatus('Review submitted!');
        setSummary('');
        setScores({ flow: 5, hook: 5, voice: 5, uniqueness: 5, conciseness: 5, authenticity: 5 });
        onSubmit();
      } else {
        const error = await res.json().catch(() => ({}));
        setStatus(`Error: ${error.error || 'Failed to submit'}`);
      }
    } catch (err) {
      setStatus('Network error');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Write a Review</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="form-group">
          <label className="form-label">Overall Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="form-input form-textarea"
            placeholder="Provide overall feedback and suggestions..."
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rubric Scoring (0-10)</label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="space-y-2">
                <label className="block text-xs font-medium capitalize">
                  {category}: {score}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => handleScoreChange(category as keyof RubricScores, parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!summary.trim()}
        >
          Submit Review
        </button>
        
        {status && (
          <p className={`text-sm mt-3 ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}



