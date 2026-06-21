'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/pageContentService';

const LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

const ApplicationsEditor = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pageContentService.getPageContent('careers').catch(() => null);
      if (response && response.content && response.content.applications) {
        setApplications(Array.isArray(response.content.applications) ? response.content.applications : []);
      } else {
        setApplications([]);
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (index) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      setError(null);
      const response = await pageContentService.getPageContent('careers').catch(() => null);
      if (response && response.content && Array.isArray(response.content.applications)) {
        // Remove the application at the specified index
        const updatedApplications = response.content.applications.filter((_, idx) => idx !== index);
        
        // Save back to database
        await pageContentService.updatePageContent(
          'careers',
          { ...response.content, applications: updatedApplications },
          token,
          {}
        );

        // Reload applications
        await loadApplications();
        setSelectedApp(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete application');
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApps = applications.filter(app =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Job Name', 'CV', 'Submitted At'];
    const rows = applications.map(app => [
      app.name,
      app.email,
      app.phone,
      app.jobName,
      app.cv || 'N/A',
      app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A',
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64 md:ml-64 ml-0 mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Job Applications</h1>
        <p className="text-gray-500 text-sm">View and manage applicant submissions.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="bg-white rounded-2xl shadow-xl p-6">
        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <input
            type="text"
            placeholder="Search by name, email, or job..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00437a]"
          />
          <div className="flex gap-2">
            <button
              onClick={loadApplications}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            >
              🔄 Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition whitespace-nowrap"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        {/* Applications List */}
        {filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedApp === index
                    ? 'border-[#00437a] bg-blue-50'
                    : 'border-gray-200 hover:border-[#00437a]'
                }`}
                onClick={() => setSelectedApp(selectedApp === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{app.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {app.email} • {app.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Position: <span className="font-medium">{app.jobName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{app.cv ? '📄 CV' : '—'}</p>
                  </div>
                </div>

                {selectedApp === index && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{app.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        <a href={`mailto:${app.email}`} className="text-[#00437a] hover:underline">
                          {app.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{app.phone}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Position Applied For</label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{app.jobName}</p>
                    </div>
                    {app.cv && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">CV File</label>
                        <a
                          href={`${BASE_URL}/${app.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#00437a] bg-gray-50 p-2 rounded inline-block hover:underline font-medium"
                        >
                          📄 {app.cv.split('/').pop()}
                        </a>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Submitted</label>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#00437a] rounded hover:bg-[#003060] transition"
                        onClick={() => window.location.href = `mailto:${app.email}`}
                      >
                        📧 Send Email
                      </button>
                      <button
                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                        onClick={() => handleDeleteApplication(applications.indexOf(app))}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {applications.length === 0 ? 'No applications yet.' : 'No matching applications found.'}
          </p>
        )}

        {/* Stats */}
        {applications.length > 0 && (
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00437a]">{applications.length}</p>
              <p className="text-xs text-gray-500">Total Applications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00437a]">{new Set(applications.map(a => a.jobName)).size}</p>
              <p className="text-xs text-gray-500">Positions Applied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00437a]">{new Set(applications.map(a => a.email)).size}</p>
              <p className="text-xs text-gray-500">Unique Applicants</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsEditor;
