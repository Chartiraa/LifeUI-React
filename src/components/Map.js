import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, LoadScriptNext, Polygon, Marker } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons"; // Geri al ikonu

const calculatePolygonCenter = (coordinates) => {
    if (coordinates.length === 0) return { lat: 39.78438812165847, lng: 32.814002777366206 }; // Default center

    const latSum = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
    const lngSum = coordinates.reduce((sum, coord) => sum + coord.lng, 0);

    const centerLat = latSum / coordinates.length;
    const centerLng = lngSum / coordinates.length;

    return { lat: centerLat, lng: centerLng };
};

const MapComponent = ({ style, onLocationSelect, showPolygon = false, showLocation = false, coords, setCoords, editable }) => {
    const [polygonCoordinates, setPolygonCoordinates] = useState([]); // Çokgen koordinatlarını burada tutuyoruz
    const [selectedLocation, setSelectedLocation] = useState(null); // Tekil konum seçimi
    const polygonRef = useRef(null); // Polygon instance
    const googleMapsApiKey = "AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo";

    const polygonOptions = {
        fillColor: "#2aff00",
        fillOpacity: 0.2,
        strokeColor: "#1ba400",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        draggable: true, // Çokgeni hareket ettirme özelliği
        editable: editable,  // Çokgenin köşe noktalarını düzenlenebilir yapar
        geodesic: false,
        zIndex: 1,
    };

    // Gelen coords prop'u değiştiğinde polygonCoordinates state'ini güncelle
    useEffect(() => {
        if (coords && coords.length > 0) {
            setPolygonCoordinates(coords);
        }
    }, [coords]);

    // Polygon koordinatlarını dışarıya setCoords ile bildiriyoruz
    useEffect(() => {
        setCoords(polygonCoordinates);
        console.log("Polygon Koordinatları:", polygonCoordinates);
    }, [polygonCoordinates, setCoords]);

    // Haritaya tıklayarak nokta ekleme fonksiyonu
    const handleMapClick = useCallback(
        (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            const location = { lat, lng };

            // showLocation true ise, tekil konum seçimi yapıyoruz
            if (showLocation) {
                setSelectedLocation(location);
                onLocationSelect(location);
            }

            // showPolygon true ise, çokgen koordinatlarına nokta ekle
            if (showPolygon) {
                setPolygonCoordinates((prevCoordinates) => [...prevCoordinates, location]);
            }
        },
        [onLocationSelect, showLocation, showPolygon]
    );

    // Geri alma fonksiyonu (son eklenen noktayı kaldırır)
    const handleUndo = () => {
        setPolygonCoordinates((prevCoordinates) => prevCoordinates.slice(0, -1)); // Son noktayı kaldır
    };

    // Çokgen düzenlendiğinde koordinatları güncelleme
    const handlePolygonMouseUp = () => {
        if (polygonRef.current) {
            const path = polygonRef.current.getPath();
            const newCoordinates = [];
            for (let i = 0; i < path.getLength(); i++) {
                const latLng = path.getAt(i);
                newCoordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
            }
            setPolygonCoordinates(newCoordinates);
        }
    };

    const onPolygonLoad = useCallback((polygon) => {
        polygonRef.current = polygon;
    }, []);

    const onUnmount = useCallback(() => {
        console.log("Map component is unmounting...");
    }, []);

    // Polygonun merkezini hesaplayalım
    const center = polygonCoordinates.length > 0
        ? calculatePolygonCenter(polygonCoordinates)
        : { lat: 39.78438812165847, lng: 32.814002777366206 }; // Default merkez

    return (
        <div style={{ position: 'relative' }}>
            {/* Geri Al Butonu */}
            {editable && (
                <button
                    onClick={handleUndo}
                    disabled={polygonCoordinates.length === 0}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                    }}
                >
                    <FontAwesomeIcon icon={faUndo} />
                </button>
            )}
            <LoadScriptNext
                googleMapsApiKey={googleMapsApiKey}
                onError={(error) => console.error("Error loading Google Maps API:", error)}
            >
                <GoogleMap
                    mapContainerStyle={style}
                    center={center}
                    zoom={17}
                    onClick={handleMapClick} // Haritaya tıklama olayı
                    onUnmount={onUnmount}
                >
                    {/* Kullanıcının seçtiği noktalarla çokgeni çizdiriyoruz */}
                    {showPolygon && polygonCoordinates.length > 0 && (
                        <Polygon
                            paths={polygonCoordinates}
                            options={polygonOptions}
                            onLoad={onPolygonLoad} // Çokgen yüklendiğinde polygonRef'e kaydediyoruz
                            onMouseUp={handlePolygonMouseUp} // Polygon üzerinde mouse up olduğunda koordinatları güncelle
                        />
                    )}

                    {/* Tekil konum seçimi, showLocation true ise işaretleyici eklenir */}
                    {showLocation && selectedLocation && (
                        <Marker position={selectedLocation} />
                    )}
                </GoogleMap>
            </LoadScriptNext>
        </div>
    );
};

export default MapComponent;
