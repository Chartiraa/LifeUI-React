import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind } from '@fortawesome/free-solid-svg-icons'; // Rüzgar ikonunu kullanıyoruz
import '../css/Wind.css'; // Stil dosyası

const WindDirection = () => {
    const [windSpeed, setWindSpeed] = useState(100); // Varsayılan hız
    const [windDirection, setWindDirection] = useState(90); // Varsayılan yön

    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setWindDirection(event.alpha.toFixed(0)); // Yönü güncelle
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const distanceFromCenterLong = 55; // Çubukların merkezden uzaklığı
    const distanceFromCenterShort = 35; // Çubukların merkezden uzaklığı
    const correctionAngle = 0; // 40 derecelik kaymayı düzeltmek için

    return (
        <div className="wind-container">
            <div className='wind-label'>
                <FontAwesomeIcon icon={faWind} className="wind-icon" />
                <label>Rüzgar</label>
            </div>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 250 250"
                xmlns="http://www.w3.org/2000/svg"
                className="wind"
                preserveAspectRatio="xMidYMid meet"  // SVG boyutlarını uyumlu hale getirir
            >
                {/* Stickler (En Altta) */}
                <g transform={`translate(125, 125) rotate(${windDirection + correctionAngle}) translate(0, -${distanceFromCenterLong})`}>
                    <svg
                        x={-15.5}  // SVG'nin genişliğinin yarısı kadar negatif (31 / 2)
                        y={-31.5}  // SVG'nin yüksekliğinin yarısı kadar negatif (63 / 2)
                        width="31" height="63" viewBox="0 0 31 63" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15.3945 0.405273L30.0729 62.1162H0.716068L15.3945 0.405273Z" fill="white" />
                    </svg>
                </g>

                <g transform={`translate(125, 125) rotate(${windDirection + correctionAngle + 180}) translate(0, -${distanceFromCenterShort}) rotate(180)`}>
                    <svg
                        x={-15}  // SVG'nin genişliğinin yarısı kadar negatif (30 / 2)
                        y={-15}  // SVG'nin yüksekliğinin yarısı kadar negatif (30 / 2)
                        width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M14.9765 29.0371L29.6549 0.0240782H0.298099L14.9765 29.0371Z" fill="white" />
                    </svg>
                </g>

                {/* Orta Göbek SVG'si (Sticklerin Üzerinde) */}
                <g transform="translate(80, 80)">  {/* Ortalamak için merkezden hesaplandı (125 - 45) */}
                    <svg
                        width="90" height="90" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <g filter="url(#filter0_d_5799_17044)">
                            <rect x="9" y="9" width="47.4576" height="47.4576" rx="23.7288" fill="#2D3545" shapeRendering="crispEdges" />
                        </g>
                        <defs>
                            <filter id="filter0_d_5799_17044" x="0.525424" y="0.525424" width="64.4062" height="64.4072" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset />
                                <feGaussianBlur stdDeviation="4.23729" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5799_17044" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5799_17044" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </g>

                {/* Yazı (En Üstte) */}
                <text x="125" y="130" textAnchor=" middle" fill="white" fontSize="14" fontWeight="bold">
                    {windDirection} m/sn
                </text>
            </svg>
        </div >
    );
};


export default WindDirection;
