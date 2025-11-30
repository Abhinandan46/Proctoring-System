import React, { useEffect, useState, useRef } from 'react';
import FaceDetection from './FaceDetection';
import WarningAlert from './WarningAlert';

const ProctoringMonitor = ({ videoRef, examId }) => {
  const [warnings, setWarnings] = useState([]);
  const [faceDetected, setFaceDetected] = useState(true);
  const [faceCount, setFaceCount] = useState(0);
  const [tabSwitched, setTabSwitched] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const warningCountRef = useRef(0);

  const token = localStorage.getItem('token');

  const logEvent = async (event) => {
    await fetch('http://localhost:5000/api/proctor/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ examId, event }),
    });
  };

  const addWarning = (message) => {
    setWarnings((prev) => [...prev, { message, time: new Date() }]);
    warningCountRef.current += 1;
    logEvent(message);
    setAlertMessage(message);
    setShowAlert(true);
    if (warningCountRef.current > 6) {
      handleAutoSubmit();
    }
  };

  const handleAutoSubmit = () => {
    alert('Too many violations, exam submitted');
    // submit
  };

  useEffect(() => {
    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitched(true);
        addWarning('Tab switched');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fullscreen detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
        addWarning('Exited fullscreen');
      } else {
        setFullscreen(true);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Audio noise detection
    const startAudioMonitoring = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const checkNoise = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setNoiseLevel(average);
          if (average > 100) { // threshold
            addWarning('High noise detected');
          }
          requestAnimationFrame(checkNoise);
        };
        checkNoise();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };
    startAudioMonitoring();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!faceDetected) {
      addWarning('Face not detected');
    }
  }, [faceDetected]);

  useEffect(() => {
    if (faceCount > 1) {
      addWarning('Multiple faces detected');
    }
  }, [faceCount]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <button onClick={enterFullscreen} className="bg-blue-600 text-white p-2 mb-4 rounded hover:bg-blue-700">Enter Fullscreen</button>
      <div className="mb-4 space-y-2">
        <p>🎥 Camera: <span className="text-green-600">Active</span></p>
        <p>🎤 Mic: <span className="text-green-600">Active</span></p>
        <p>🖥️ Fullscreen: <span className={fullscreen ? 'text-green-600' : 'text-red-600'}>{fullscreen ? 'Yes' : 'No'}</span></p>
        <p>👤 Face Detected: <span className={faceDetected ? 'text-green-600' : 'text-red-600'}>{faceDetected ? 'Yes' : 'No'}</span></p>
        <p>👥 Faces Count: {faceCount}</p>
        <p>🔄 Tab Switched: <span className={tabSwitched ? 'text-red-600' : 'text-green-600'}>{tabSwitched ? 'Yes' : 'No'}</span></p>
        <p>⚠️ Warnings: {warningCountRef.current}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Warnings:</h3>
        <ul className="space-y-1">
          {warnings.map((w, i) => (
            <li key={i} className="text-sm text-red-600">{w.message} at {w.time.toLocaleTimeString()}</li>
          ))}
        </ul>
      </div>
      {showAlert && <WarningAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
      <FaceDetection videoRef={videoRef} onFaceUpdate={(detected, count) => { setFaceDetected(detected); setFaceCount(count); }} />
    </div>
  );
};

export default ProctoringMonitor;