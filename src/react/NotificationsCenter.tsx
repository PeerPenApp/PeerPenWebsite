import React, { useState, useEffect } from 'react';

interface Essay {
  id: string;
  title: string;
  created_at: string;
  is_public: boolean;
}

interface UserStats {
  essaysCount: number;
  publicEssaysCount: number;
  karma: number;
}

export default function UserProfile() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [stats, setStats] = useState<UserStats>({ essaysCount: 0, publicEssaysCount: 0, karma: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'essays' | 'stats'>('essays');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // For now, use mock user ID (in production, get from session)
      const mockUserId = 'mock-user-123';
      
      // Fetch user's essays
      const essaysResponse = await fetch(`/api/essays?userId=${mockUserId}`);
      const essaysData = await essaysResponse.json();
      
      if (essaysResponse.ok) {
        setEssays(essaysData.essays || []);
        
        // Calculate stats
        const publicEssays = essaysData.essays?.filter((e: Essay) => e.is_public) || [];
        setStats({
          essaysCount: essaysData.essays?.length || 0,
          publicEssaysCount: publicEssays.length,
          karma: 0 // Mock karma for now
        });
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
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
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.essaysCount}</div>
          <div className="text-sm text-gray-600">Total Essays</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.publicEssaysCount}</div>
          <div className="text-sm text-gray-600">Public Essays</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.karma}</div>
          <div className="text-sm text-gray-600">Karma</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('essays')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'essays'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Essays
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'essays' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">My Essays</h3>
            <a href="/app/write" className="btn btn-primary">
              ✍️ Write New Essay
            </a>
          </div>
          
          {essays.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No essays yet</h3>
              <p className="text-gray-600 mb-6">Start writing your first college essay!</p>
              <a href="/app/write" className="btn btn-primary">
                Write Your First Essay
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {essays.map((essay) => (
                <div key={essay.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{essay.title}</h4>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(essay.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {essay.is_public ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          🌐 Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          🔒 Private
                        </span>
                      )}
                      <button className="btn btn-ghost btn-sm">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Activity tracking coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
}



