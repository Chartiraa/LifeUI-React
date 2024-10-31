import React, { useCallback } from "react";
import { GoogleMap, LoadScriptNext } from "@react-google-maps/api";

const MapComponent = ({ style }) => {
    const googleMapsApiKey = "AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo"; // Google API anahtarınızı buraya ekleyin

    const onUnmount = useCallback(() => {
        console.log("Map component is unmounting...");
    }, []);

    const center = { lat: 39.78438812165847, lng: 32.814002777366206 }; // Default merkez

    return (
        <LoadScriptNext
            googleMapsApiKey={googleMapsApiKey}
            onError={(error) => console.error("Error loading Google Maps API:", error)}
        >
            <GoogleMap
                mapContainerStyle={style}
                center={center}
                zoom={17}
                onUnmount={onUnmount}
            />
        </LoadScriptNext>
    );
};

export default MapComponent;
