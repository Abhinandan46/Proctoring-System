import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';

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
          axios.get('http://localhost:5000/api/tests', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/candidates', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/results', { headers: { Authorization: `Bearer ${token}` } })
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 text-white p-4 min-h-screen">
        <h2 className="text-xl mb-4">Admin Panel</h2>
        <ul>
          <li className="mb-2"><Link to="/create-test" className="block p-2 hover:bg-gray-700 rounded">Create Test</Link></li>
          <li className="mb-2"><Link to="/manage-tests" className="block p-2 hover:bg-gray-700 rounded">Manage Tests</Link></li>
          <li className="mb-2"><Link to="/candidates" className="block p-2 hover:bg-gray-700 rounded">Candidates</Link></li>
          <li className="mb-2"><Link to="/results" className="block p-2 hover:bg-gray-700 rounded">Results</Link></li>
        </ul>
      </div>
      <div className="flex-1 p-6">
        <h1 className="text-3xl mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Tests</h3>
            <p className="text-2xl">{stats.tests}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Candidates</h3>
            <p className="text-2xl">{stats.candidates}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Results</h3>
            <p className="text-2xl">{stats.results}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl mb-4">Statistics Overview</h2>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Recent Tests */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl mb-4">Recent Tests</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Duration</th>
                <th className="text-left p-2">Published</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.slice(0, 5).map(test => (
                <tr key={test._id}>
                  <td className="p-2">{test.title}</td>
                  <td className="p-2">{test.duration} min</td>
                  <td className="p-2">{test.published ? 'Yes' : 'No'}</td>
                  <td className="p-2">
                    <Link to={`/manage-tests`} className="text-blue-500">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Candidates */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl mb-4">Recent Candidates</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Tests Assigned</th>
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 5).map(candidate => (
                <tr key={candidate._id}>
                  <td className="p-2">{candidate.name}</td>
                  <td className="p-2">{candidate.email}</td>
                  <td className="p-2">{candidate.tests.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Results */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl mb-4">Recent Results</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Test</th>
                <th className="text-left p-2">Candidate</th>
                <th className="text-left p-2">Score</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 5).map(result => (
                <tr key={result._id}>
                  <td className="p-2">{result.test?.title || 'N/A'}</td>
                  <td className="p-2">{result.user?.email || 'N/A'}</td>
                  <td className="p-2">{result.score}</td>
                  <td className="p-2">{new Date(result.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;