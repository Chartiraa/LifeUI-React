import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { socket } from '../services/socket';

const MapComponent = (props) => {
    const { style } = props;

    const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
    const [loading, setLoading] = useState(true);

    const defaultCenter = {
        lat: 39.7843,
        lng: 32.8128
    };

    // Google Maps API yükleme durumu kontrolü
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo",
    });

    useEffect(() => {
        // Socket.IO'dan gelen GPS verilerini dinle
        socket.on('GPS', (data) => {
            const { latitude, longitude } = data;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
            setLoading(false);
        });

        // Component unmount olduğunda Socket.IO bağlantısını temizle
        return () => {
            socket.off('GPS');
        };
    }, []);

    if (!isLoaded) {
        return <div>Loading Map...</div>; // Harita yükleniyor göstergesi
    }

    return (
        <GoogleMap
            mapContainerStyle={style}
            zoom={20}
            center={loading ? defaultCenter : currentPosition}
        >
            {!loading && (
                <Marker position={currentPosition} />
            )}
        </GoogleMap>
    );
};

export default MapComponent;
