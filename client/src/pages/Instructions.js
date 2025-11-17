import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraPreview from '../components/CameraPreview';

const Instructions = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const proceed = () => {
    navigate('/camera-check');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Exam Instructions</h1>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Ensure you have a stable internet connection.</li>
            <li>Close all other applications and tabs.</li>
            <li>Make sure your camera and microphone are working.</li>
            <li>Do not switch tabs or exit fullscreen during the exam.</li>
            <li>Face the camera at all times.</li>
            <li>Keep the environment quiet.</li>
            <li>Any violations may result in exam termination.</li>
          </ul>
          <div className="space-x-4">
            <button onClick={proceed} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Check Camera & Mic</button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded" disabled>Start Exam</button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Camera Preview</h2>
          <CameraPreview videoRef={videoRef} />
        </div>
      </div>
    </div>
  );
};

export default Instructions;