import React, { useState, useEffect } from 'react';

interface Essay {
  id: string;
  title: string;
  author_handle: string;
  author_name: string;
  created_at: string;
  is_public: boolean;
}

export default function FeedComponent() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEssays();
  }, []);

  const fetchEssays = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/essays?public=true');
      const data = await response.json();
      
      if (response.ok) {
        setEssays(data.essays || []);
      } else {
        setError(data.error || 'Failed to fetch essays');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading essays...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchEssays}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (essays.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">No essays yet</h3>
        <p className="text-gray-600 mb-6">Be the first to share your essay!</p>
        <a href="/app/write" className="btn btn-primary">
          Write Your First Essay
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Public Essays</h2>
        <span className="text-sm text-gray-600">{essays.length} essays</span>
      </div>
      
      <div className="grid gap-6">
        {essays.map((essay) => (
          <div key={essay.id} className="feed-item">
            <div className="feed-header">
              <div className="feed-avatar">
                <span className="text-lg font-semibold">
                  {essay.author_name?.[0]?.toUpperCase() || essay.author_handle?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="feed-user-info">
                <div className="feed-username">
                  {essay.author_name || essay.author_handle}
                </div>
                <div className="feed-timestamp">
                  {formatDate(essay.created_at)}
                </div>
              </div>
            </div>
            
            <div className="feed-content">
              <h3 className="text-lg font-semibold mb-2">{essay.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📝 Essay</span>
                {essay.is_public && <span className="text-green-600">🌐 Public</span>}
              </div>
            </div>
            
            <div className="feed-actions">
              <button className="action-btn" title="View Essay">
                👁️ View
              </button>
              <button className="action-btn" title="Review Essay">
                ✍️ Review
              </button>
              <button className="action-btn" title="Like">
                ❤️ Like
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center py-6">
        <button 
          onClick={fetchEssays}
          className="btn btn-ghost"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}


