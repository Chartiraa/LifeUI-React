import React, { useEffect, useState } from "react";
import { socket } from "../services/socket";  // Socket.IO istemci bağlantısı

const CameraFeed = ({ feedType }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // `feedType` prop’una göre uygun `socket.io` event’ini dinle
    const eventType = feedType === "processed" ? "processed_image_feed" : "camera_feed";

    socket.on(eventType, (base64Image) => {
      setImageSrc(base64Image);
    });

    // Bileşen veya `feedType` değiştiğinde event’i temizle
    return () => {
      socket.off(eventType);
    };
  }, [feedType]);  // `feedType` değiştiğinde useEffect yeniden çalışır

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt={feedType === "processed" ? "Processed Image Feed" : "Camera Feed"} style={feedType === "processed" ? {} : { transform: "scaleX(-1)" }} />
      ) : (
        <p>{feedType === "processed" ? "İşlenmiş görüntü yükleniyor..." : "Kamera görüntüsü yükleniyor..."}</p>
      )}
    </div>
  );
};

export default CameraFeed;
