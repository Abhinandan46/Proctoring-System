import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CameraPreview from '../components/CameraPreview';
import ProctoringMonitor from '../components/ProctoringMonitor';
import QuestionCard from '../components/QuestionCard';

const Exam = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/exams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setQuestions(data.questions);
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const submitExam = async () => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examId: id, answers }),
    });
    alert('Exam submitted');
    // redirect
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const markForReview = () => {
    setMarked({ ...marked, [currentQuestion]: !marked[currentQuestion] });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between mb-4">
        <div>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
        <button onClick={submitExam} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Submit Exam</button>
      </div>
      <div className="grid grid-cols-10 gap-6">
        <div className="col-span-7">
          <QuestionCard
            question={questions[currentQuestion]?.question}
            options={questions[currentQuestion]?.options || []}
            selected={answers[currentQuestion]}
            onSelect={handleAnswer}
            onMarkReview={markForReview}
            marked={marked[currentQuestion]}
          />
          <div className="mt-4 flex justify-between">
            <button onClick={prevQuestion} disabled={currentQuestion === 0} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Previous</button>
            <button onClick={nextQuestion} disabled={currentQuestion === questions.length - 1} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Next</button>
          </div>
        </div>
        <div className="col-span-3">
          <CameraPreview videoRef={videoRef} />
          <ProctoringMonitor videoRef={videoRef} examId={id} />
        </div>
      </div>
    </div>
  );
};

export default Exam;