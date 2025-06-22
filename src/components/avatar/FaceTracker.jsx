import { useEffect, useRef } from "react";
import useFaceTracking from "../../hooks/useFaceTracking";

const FaceTracker = () => {
  const videoRef = useRef(null);
  const faces = useFaceTracking(videoRef);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay className="w-full h-auto rounded-lg" />
      {faces.length > 0 && <div className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-20" />}
    </div>
  );
};

export default FaceTracker;
