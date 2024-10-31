import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";

const CameraFeed = (props) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // 'cameraFeed' olayını dinleyerek Base64 veriyi al
    socket.on(props.port, (base64Image) => {
      setImageSrc(`data:image/jpeg;base64,${base64Image}`);
    });
  }, []);

  return (
    <div>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Camera Feed"
        />
      )}
    </div>
  );
};

export default CameraFeed;
