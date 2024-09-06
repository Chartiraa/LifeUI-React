import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import '../css/Compass.css'; // Stil dosyası

const Compass = () => {
    const [heading, setHeading] = useState(300); // Varsayılan yön

    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setHeading(event.alpha.toFixed(0)); // Yönü güncelle
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <div className="compass-container">
            <div className='compass-label'>
                <FontAwesomeIcon icon={faCompass} className="compass-icon" />
                <label>Pusula</label>
            </div>
            {/* SVG içeriği buraya eklenecek */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 250 250"
                xmlns="http://www.w3.org/2000/svg"
                className="compass"
                preserveAspectRatio="xMidYMid meet"  // SVG boyutlarını uyumlu hale getirir
            >
                {/* SVG İçeriği buraya gelecek */}
                {/* Ok için bir grup kullanarak yönü dinamik hale getir */}
                <g transform={`rotate(${heading}, 125, 125) translate(0, 25)`}>
                    <polygon points="115,30 125,10 135,30" fill="#3ac569" />
                </g>
                {/* Yön derecesi */}
                <text x="125" y="135" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
                    {heading}°
                </text>
            </svg>
        </div>
    );
};

export default Compass;
