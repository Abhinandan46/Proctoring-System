import { useState } from 'react';
import axios from 'axios';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'mcq', options: [], correctAnswer: '' }]);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/tests', { title, description, duration, questions }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Test created');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">Create Test</h1>
      <input className="border p-2 w-full mb-4" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-4" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="border p-2 w-full mb-4" type="number" placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} />
      <button className="bg-blue-500 text-white p-2 mb-4" onClick={addQuestion}>Add Question</button>
      {questions.map((q, i) => (
        <div key={i} className="border p-4 mb-4">
          <input className="border p-2 w-full mb-2" placeholder="Question" value={q.question} onChange={e => {
            const newQ = [...questions];
            newQ[i].question = e.target.value;
            setQuestions(newQ);
          }} />
          <select className="border p-2 mb-2" value={q.type} onChange={e => {
            const newQ = [...questions];
            newQ[i].type = e.target.value;
            setQuestions(newQ);
          }}>
            <option value="mcq">MCQ</option>
            <option value="multi">Multi-select</option>
            <option value="short">Short Answer</option>
          </select>
          {q.type !== 'short' && (
            <div>
              <input className="border p-2 w-full mb-2" placeholder="Option 1" />
              <input className="border p-2 w-full mb-2" placeholder="Option 2" />
              <input className="border p-2 w-full mb-2" placeholder="Correct Answer" value={q.correctAnswer} onChange={e => {
                const newQ = [...questions];
                newQ[i].correctAnswer = e.target.value;
                setQuestions(newQ);
              }} />
            </div>
          )}
        </div>
      ))}
      <button className="bg-green-500 text-white p-2" onClick={handleSubmit}>Publish Test</button>
    </div>
  );
};

export default CreateTest;