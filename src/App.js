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

  useEffect(() => {
    let detectionInterval;
    const modelLoaded = () => {
      const { width, height } = dimensions;

      webcamRef.current.video.width = width;
      webcamRef.current.video.height = height;

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

        console.log(results);
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
    </div>
  );
};

export default App;
