import React, { useEffect, useRef } from 'react';

const CameraPreview = ({ videoRef }) => {
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    startCamera();
  }, [videoRef]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted className="w-full h-64 bg-black"></video>
    </div>
  );
};

export default CameraPreview;