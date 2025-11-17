import { useEffect, useState } from 'react';
import axios from 'axios';

const ManageTests = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTests(res.data);
    };
    fetchTests();
  }, []);

  const publish = async (id) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:5000/api/tests/${id}/publish`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Published');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Manage Tests</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Published</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map(test => (
            <tr key={test._id}>
              <td className="border p-2">{test.title}</td>
              <td className="border p-2">{test.published ? 'Yes' : 'No'}</td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white p-1 mr-2" onClick={() => publish(test._id)}>Publish</button>
                <button className="bg-red-500 text-white p-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTests;