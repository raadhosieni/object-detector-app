import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as ml5 from "ml5";
import "./App.css";
const dimensions = {
  width: 640,
  height: 480,
};

const App = () => {
  const webcamRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    let detectionInterval;
    const ctx = canvasRef.current.getContext("2d");
    const modelLoaded = () => {
      const { width, height } = dimensions;

      // webcamRef.current.video.width = width;
      // webcamRef.current.video.height = height;
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      detectionInterval = setInterval(() => {
        detect();
      }, 200);
    };

    const detect = () => {
      if (webcamRef.current.video.readyState !== 4) {
        console.warn("Video not ready yet");
        return;
      }
      objectDetector.detect(webcamRef.current.video, (err, results) => {
        if (err) {
          console.err(err);
        }

        if (results && results.length) {
          results.forEach((detection) => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            //draw rectangle on canvas with same position
            ctx.beginPath();
            ctx.fillStyle = "#FF0000";
            const { label, x, y, width, height } = detection;
            ctx.fillText(label, x, y + 10);
            ctx.rect(x, y, width, height);
            ctx.strokeStyle = "#00ff00";
            ctx.stroke();
          });
        }
      });
    };

    const objectDetector = ml5.objectDetector("cocossd", modelLoaded);

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  return (
    <div className="app">
      <Webcam ref={webcamRef} />
      <canvas ref={canvasRef} className="floating" />
    </div>
  );
};

export default App;
