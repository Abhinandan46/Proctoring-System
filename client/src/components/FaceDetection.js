import React, { useEffect, useRef } from 'react';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

const FaceDetectionComponent = ({ videoRef, onFaceUpdate }) => {
  const faceDetectionRef = useRef(null);

  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
      },
    });
    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5,
    });
    faceDetection.onResults((results) => {
      const faceCount = results.detections.length;
      onFaceUpdate(faceCount > 0, faceCount);
    });
    faceDetectionRef.current = faceDetection;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceDetection.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [videoRef, onFaceUpdate]);

  return null;
};

export default FaceDetectionComponent;