import React, { useRef, useEffect } from 'react';
import '../css/Camera.css';

const VideoComponent = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const constraints = {
            video: true
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.error(`Hata oluştu: ${err}`);
            });
    }, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-auto">
                    <video ref={videoRef} className="video" width="640" height="480" autoPlay></video>
                </div>
            </div>
        </div>
    );
};

export default VideoComponent;