import { useEffect, useState } from 'react';
import axios from 'axios';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data);
    };
    fetchCandidates();
  }, []);

  const addCandidate = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/candidates', { name, email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setName('');
    setEmail('');
    // Refresh
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Candidates</h1>
      <div className="mb-6">
        <input className="border p-2 mr-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 mr-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="bg-blue-500 text-white p-2" onClick={addCandidate}>Add Candidate</button>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Candidates;