import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as faceapi from 'face-api.js';

const TestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();
  const canvasRef = useRef();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [faceDetected, setFaceDetected] = useState(false);
  const [noiseDetected, setNoiseDetected] = useState(false);
  const [tabSwitched, setTabSwitched] = useState(false);
  const [proctorLogs, setProctorLogs] = useState([]);

  useEffect(() => {
    const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.0/weights/');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.0/weights/');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js@0.22.0/weights/');
    };
    loadModels();

    const fetchTest = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTest(res.data);
      setTimeLeft(res.data.duration * 60);
    };
    fetchTest();

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitched(true);
        logEvent('tab_switch');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkNoise = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        if (average > 50) {
          setNoiseDetected(true);
          logEvent('noise_detected');
        }
        requestAnimationFrame(checkNoise);
      };
      checkNoise();
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id]);

  const logEvent = async (eventType) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/proctor/log', {
      test: id,
      eventType
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const detectFace = async () => {
    if (videoRef.current && canvasRef.current) {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      setFaceDetected(detections.length > 0);
      if (detections.length === 0) {
        logEvent('face_not_detected');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(detectFace, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitTest = async () => {
    const token = localStorage.getItem('token');
    const answersArray = test.questions.map(q => ({
      question: q.question,
      answer: answers[q._id] || '',
      correct: answers[q._id] === q.correctAnswer
    }));
    const score = answersArray.filter(a => a.correct).length;
    const res = await axios.post('http://localhost:5000/api/results', {
      testId: id,
      answers: answersArray,
      score,
      proctorLogs
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/result-summary/${res.data._id}`);
  };

  if (!test) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl">{test.title}</h1>
        <div>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      </div>
      <div className="flex">
        <div className="w-3/4">
          {test.questions.map(q => (
            <div key={q._id} className="mb-4">
              <p>{q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitTest} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
        </div>
        <div className="w-1/4 ml-4">
          <video ref={videoRef} autoPlay muted width="300" height="200"></video>
          <canvas ref={canvasRef} width="300" height="200" className="absolute"></canvas>
          <div>Face Detected: {faceDetected ? 'Yes' : 'No'}</div>
          <div>Noise Detected: {noiseDetected ? 'Yes' : 'No'}</div>
          <div>Tab Switched: {tabSwitched ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;