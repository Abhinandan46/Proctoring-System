import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaEdit, FaUsers, FaClipboardList, FaChartBar, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ tests: 0, candidates: 0, results: 0 });
  const [tests, setTests] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [testsRes, candidatesRes, resultsRes] = await Promise.all([
          axios.get('/api/tests'),
          axios.get('/api/candidates'),
          axios.get('/api/results')
        ]);
        setTests(testsRes.data);
        setCandidates(candidatesRes.data);
        setResults(resultsRes.data);
        setStats({
          tests: testsRes.data.length,
          candidates: candidatesRes.data.length,
          results: resultsRes.data.length
        });
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = [
    { name: 'Tests', value: stats.tests },
    { name: 'Candidates', value: stats.candidates },
    { name: 'Results', value: stats.results },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="alert alert-destructive max-w-md">
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaShieldAlt className="text-primary" />
                Admin Panel
              </h2>
              <ThemeToggle />
            </div>
          </div>
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <FaTachometerAlt />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-test" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <FaPlus />
                  Create Test
                </Link>
              </li>
              <li>
                <Link to="/manage-tests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <FaEdit />
                  Manage Tests
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <FaUsers />
                  Candidates
                </Link>
              </li>
              <li>
                <Link to="/results" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <FaClipboardList />
                  Results
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors text-left"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <FaTachometerAlt className="text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your proctoring system efficiently</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                    <p className="text-3xl font-bold text-primary">{stats.tests}</p>
                  </div>
                  <FaClipboardList className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                    <p className="text-3xl font-bold text-primary">{stats.candidates}</p>
                  </div>
                  <FaUsers className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Results</p>
                    <p className="text-3xl font-bold text-primary">{stats.results}</p>
                  </div>
                  <FaChartBar className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <FaChartBar />
                Statistics Overview
              </h2>
            </div>
            <div className="card-content">
              <BarChart width={600} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tests */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Tests</h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {tests && Array.isArray(tests) && tests.slice(0, 5).map(test => (
                    <div key={test._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{test.title}</p>
                        <p className="text-sm text-muted-foreground">{test.duration} min • {test.published ? 'Published' : 'Draft'}</p>
                      </div>
                      <Link to={`/manage-tests`} className="btn btn-outline btn-sm">
                        <FaEdit className="mr-1" />
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Candidates */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Candidates</h2>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {candidates && Array.isArray(candidates) && candidates.slice(0, 5).map(candidate => (
                    <div key={candidate._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">{candidate.email}</p>
                      </div>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {candidate.tests.length} tests
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="card mt-8">
            <div className="card-header">
              <h2 className="card-title">Recent Results</h2>
            </div>
            <div className="card-content">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Test</th>
                      <th className="text-left p-3 font-medium">Candidate</th>
                      <th className="text-left p-3 font-medium">Score</th>
                      <th className="text-left p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results && Array.isArray(results) && results.slice(0, 5).map(result => (
                      <tr key={result._id} className="border-b hover:bg-muted/50">
                        <td className="p-3">{result.test?.title || 'N/A'}</td>
                        <td className="p-3">{result.user?.email || 'N/A'}</td>
                        <td className="p-3 font-medium">{result.score}</td>
                        <td className="p-3 text-muted-foreground">{new Date(result.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;