import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraPreview from '../components/CameraPreview';
import FaceDetection from '../components/FaceDetection';

const CameraCheck = () => {
  const videoRef = useRef(null);
  const [micWorking, setMicWorking] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setMicWorking(true);
      } catch (err) {
        console.error('Error accessing camera/mic:', err);
      }
    };
    startCamera();
  }, []);

  const proceed = () => {
    navigate('/exam/123'); // replace with actual exam id
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Camera and Microphone Check</h1>
        <div className="mb-6">
          <CameraPreview videoRef={videoRef} />
        </div>
        <div className="mb-6 space-y-2">
          <p>Camera: <span className="text-green-600">OK</span></p>
          <p>Microphone: <span className={micWorking ? 'text-green-600' : 'text-red-600'}>{micWorking ? 'OK' : 'Not Working'}</span></p>
          <p>Face Detected: <span className={faceDetected ? 'text-green-600' : 'text-red-600'}>{faceDetected ? 'Yes' : 'No'}</span></p>
        </div>
        <div className="text-center">
          <button onClick={proceed} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Continue to Exam</button>
        </div>
        <FaceDetection videoRef={videoRef} onFaceUpdate={(detected) => setFaceDetected(detected)} />
      </div>
    </div>
  );
};

export default CameraCheck;