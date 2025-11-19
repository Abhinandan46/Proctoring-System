import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import ThemeToggle from '../components/ThemeToggle';

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
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [proctorLogs, setProctorLogs] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
        setModelsLoaded(true);
      } catch (err) {
        console.error('Failed to load face-api models:', err);
        alert('Failed to load AI models. Please check your internet connection.');
      }
    };
    loadModels();

    const fetchTest = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/tests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTest(res.data);
      setTimeLeft(res.data.duration * 60);
    };
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (testStarted && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [testStarted, stream]);

  const startTest = async () => {
    try {
      setMediaError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);

      // Set up audio monitoring
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(mediaStream);
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

      // Set up tab switching detection
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitched(true);
          logEvent('tab_switch');
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      setTestStarted(true);
    } catch (err) {
      console.error('Media access denied:', err);
      setMediaError('Camera and microphone access are required to start the exam. Please allow permissions and try again.');
    }
  };

  const logEvent = async (eventType) => {
    const token = localStorage.getItem('token');
    const logEntry = { test: id, eventType, timestamp: new Date() };
    setProctorLogs(prev => [...prev, logEntry]);
    await axios.post('/api/proctor/log', logEntry, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  useEffect(() => {
    if (testStarted) {
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
    }
  }, [testStarted]);

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) return;

    try {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }
      setFaceDetected(detections.length > 0);
      if (detections.length === 0) {
        logEvent('face_not_detected');
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  useEffect(() => {
    if (testStarted) {
      const interval = setInterval(detectFace, 1000);
      return () => clearInterval(interval);
    }
  }, [testStarted]);

  useEffect(() => {
    if (testStarted && stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [testStarted, stream]);

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
    const res = await axios.post('/api/results/submit', {
      testId: id,
      answers: answersArray,
      score,
      proctorLogs
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/result-summary/${res.data._id}`);
  };

  if (!test || !modelsLoaded) return <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading test and AI models...</p>
    </div>
  </div>;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Start Exam</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            To begin the exam, you must enable your camera and microphone for proctoring purposes.
          </p>
          <button
            onClick={startTest}
            className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-500 dark:to-teal-500 hover:from-blue-600 hover:to-purple-600 dark:hover:from-purple-600 dark:hover:to-teal-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 mb-4"
          >
            Enable Camera & Microphone
          </button>
          {mediaError && <p className="text-red-600 dark:text-red-400 text-sm">{mediaError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">{test.title}</h1>
          <div className="card p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-2xl font-bold text-primary">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {test.questions.map((q, index) => (
                <div key={q._id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">Question {index + 1}</h3>
                  </div>
                  <div className="card-content">
                    <p className="mb-4 text-lg">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <label key={i} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                            className="text-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button onClick={submitTest} className="btn btn-primary w-full py-3 text-lg">
                Submit Test
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Proctoring Monitor</h3>
              </div>
              <div className="card-content space-y-4">
                <div className="relative">
                  <video ref={videoRef} muted width="320" height="240" className="w-full rounded-lg border" />
                  <canvas ref={canvasRef} width="320" height="240" className="absolute top-0 left-0 w-full h-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Face Detected:</span>
                    <span className={faceDetected ? 'text-green-600' : 'text-red-600'}>
                      {faceDetected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Noise Detected:</span>
                    <span className={noiseDetected ? 'text-red-600' : 'text-green-600'}>
                      {noiseDetected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tab Switched:</span>
                    <span className={tabSwitched ? 'text-red-600' : 'text-green-600'}>
                      {tabSwitched ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;