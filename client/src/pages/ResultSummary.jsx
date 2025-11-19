import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';

const ResultSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    };
    fetchResult();
  }, [id]);

  if (!result) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Test Result Summary</h1>
          <p className="text-muted-foreground">Review your performance and answers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-content text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-4xl font-bold text-primary">{result.score}/{result.answers.length}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-content text-center">
              <p className="text-sm text-muted-foreground mb-2">Percentage</p>
              <p className="text-4xl font-bold text-primary">
                {Math.round((result.score / result.answers.length) * 100)}%
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-content text-center">
              <p className="text-sm text-muted-foreground mb-2">Submitted At</p>
              <p className="text-lg font-semibold">{new Date(result.submittedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Detailed Answers</h2>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {result.answers.map((ans, i) => (
                <div key={i} className={`p-4 border rounded-lg ${ans.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Question {i + 1}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${ans.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {ans.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mb-2">{ans.question}</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Your Answer:</span> {ans.answer || 'Not answered'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/candidate')} className="btn btn-primary px-8 py-3">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;