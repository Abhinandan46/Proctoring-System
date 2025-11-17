import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResultSummary = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    };
    fetchResult();
  }, [id]);

  if (!result) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Result Summary</h1>
      <p>Score: {result.score}</p>
      <p>Submitted At: {new Date(result.submittedAt).toLocaleString()}</p>
      <h2 className="text-2xl mt-4">Answers</h2>
      {result.answers.map((ans, i) => (
        <div key={i} className="mb-2">
          <p>Question {i+1}: {ans.question}</p>
          <p>Your Answer: {ans.answer}</p>
          <p>Correct: {ans.correct ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultSummary;