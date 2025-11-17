import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [testsRes, resultsRes, userRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tests', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/results', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTests(testsRes.data.filter(t => t.published));
        setResults(resultsRes.data);
        setUser(userRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Candidate Dashboard</h1>
      
      {/* Profile Section */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">Profile</h2>
        <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {/* Available Tests */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map(test => (
            <div key={test._id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{test.title}</h3>
              <p>{test.description}</p>
              <p><strong>Duration:</strong> {test.duration} min</p>
              <p><strong>Questions:</strong> {test.questions?.length || 0}</p>
              <p><strong>Created by:</strong> {test.createdBy?.email} ({test.createdBy?.role})</p>
              <Link to={`/test/${test._id}`} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 inline-block hover:bg-blue-600">
                Start Test
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Test History */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Test History</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Test Title</th>
              <th className="text-left p-2">Score</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result._id}>
                <td className="p-2">{result.test?.title || 'N/A'}</td>
                <td className="p-2">{result.score}</td>
                <td className="p-2">{new Date(result.submittedAt).toLocaleDateString()}</td>
                <td className="p-2">
                  <Link to={`/result/${result._id}`} className="text-blue-500">View Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateDashboard;