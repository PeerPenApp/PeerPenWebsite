import React, { useState, useEffect } from 'react';

type Report = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_id: string;
};

export default function ModerationDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/moderation/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/moderation/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      setReports(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );
    } catch (err) {
      console.error('Failed to update report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading reports...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Moderation Dashboard</h3>
      
      {reports.length === 0 ? (
        <p className="text-center text-gray-500">No reports to review</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium">
                    {report.target_type} Report
                  </p>
                  <p className="text-sm text-gray-600">
                    Reported by: {report.reporter_id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              
              <p className="text-sm mb-3">
                <strong>Reason:</strong> {report.reason}
              </p>
              
              <div className="flex gap-2">
                {report.status === 'open' && (
                  <>
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'dismissed')}
                      className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



