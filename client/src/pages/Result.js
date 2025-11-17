import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch result from API or local storage
    // For now, mock
    setResult({ score: 85, total: 100, correct: 17, wrong: 3, warnings: ['Tab switched', 'Face not detected'] });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Exam Result</h1>
        {result ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-2xl mb-2">Your Score: {result.score}/{result.total}</p>
              <p className="text-lg">Percentage: {((result.score / result.total) * 100).toFixed(2)}%</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-4 rounded">
                <p className="text-xl font-semibold text-green-600">{result.correct}</p>
                <p>Correct Answers</p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p className="text-xl font-semibold text-red-600">{result.wrong}</p>
                <p>Wrong Answers</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded">
                <p className="text-xl font-semibold text-yellow-600">{result.total - result.correct - result.wrong}</p>
                <p>Not Attempted</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Warning Summary</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Back to Dashboard</button>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Result;