import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, LoadScriptNext, Polygon, Marker } from "@react-google-maps/api";

const polygonCoordinates = [
    { lat: 39.78353375553946, lng: 32.81067316529476 },
    { lat: 39.78556878155144, lng: 32.813052934662316 },
    { lat: 39.78469003101966, lng: 32.81740011329194 },
    { lat: 39.78469003101966, lng: 32.81640011329194 },
    { lat: 39.78258127670171, lng: 32.815021607894074 },
];

const polygonOptions = {
    fillColor: "#2aff00",
    fillOpacity: 0.2,
    strokeColor: "#1ba400",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1,
};

const MapComponent = ({ style, showPolygon = false, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const googleMapsApiKey = "AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo";

    useEffect(() => {
        setIsScriptLoaded(false);
        const timer = setTimeout(() => {
            setIsScriptLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const onLoad = useCallback(() => {
        console.log("Map loaded successfully");
    }, []);

    const onUnmount = useCallback(() => {
        console.log("Map component is unmounting...");
    }, []);

    const handleMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const location = { lat, lng };
        setSelectedLocation(location);

        // Harita tıklandığında bu konumu modal dışında da kullanabilmek için prop ile dışarıya bildiriyoruz
        onLocationSelect(location);
    }, [onLocationSelect]);

    return isScriptLoaded ? (
        <LoadScriptNext
            googleMapsApiKey={googleMapsApiKey}
            onError={(error) =>
                console.error("Error loading Google Maps API:", error)
            }
        >
            <GoogleMap
                mapContainerStyle={style}
                center={{ lat: 39.78438812165847, lng: 32.814002777366206 }}
                zoom={17}
                onClick={handleMapClick} // Haritaya tıklama olayı
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {showPolygon && (
                    <Polygon paths={polygonCoordinates} options={polygonOptions} />
                )}
                {/* Seçilen konumu işaretleyin */}
                {selectedLocation && (
                    <Marker position={selectedLocation} />
                )}
            </GoogleMap>
        </LoadScriptNext>
    ) : (
        <p>Harita yükleniyor...</p>
    );
};

export default MapComponent;
