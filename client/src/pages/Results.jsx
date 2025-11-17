import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/results/123', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    };
    fetchResults();
  }, []);

  const data = results.map(r => ({ name: r.user.email, score: r.score }));

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Results</h1>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
      <table className="w-full border mt-6">
        <thead>
          <tr>
            <th className="border p-2">User</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r._id}>
              <td className="border p-2">{r.user.email}</td>
              <td className="border p-2">{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;