import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/exams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setExams(data);
    };
    fetchExams();
  }, []);

  const startExam = () => {
    navigate('/instructions');
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-600">Dashboard</h2>
        <ul className="space-y-4">
          <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded">Home</button></li>
          <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded">My Exams</button></li>
          <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded">Profile</button></li>
          <li><button className="w-full text-left p-2 hover:bg-gray-200 rounded">Instructions</button></li>
          <li><button onClick={logout} className="w-full text-left p-2 hover:bg-gray-200 rounded">Logout</button></li>
        </ul>
      </div>
      {/* Main */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
              <p className="mb-4">{exam.description}</p>
              <button onClick={startExam} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Start Exam</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;