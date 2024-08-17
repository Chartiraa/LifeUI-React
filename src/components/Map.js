import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { socket } from '../services/socket';

const MapComponent = (props) => {

    const { style } = props

    const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
    const [loading, setLoading] = useState(true);

    const defaultCenter = {
        lat: 39.7843,
        lng: 32.8128
    };

    useEffect(() => {
        // Socket.IO'dan gelen GPS verilerini dinle
        socket.on('GPS', (data) => {
            const { latitude, longitude, altitude } = data;
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

    return (
        <>
            <LoadScript googleMapsApiKey="AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo">
                <GoogleMap
                    mapContainerStyle={style}
                    zoom={20}
                    center={loading ? defaultCenter : currentPosition}
                >
                    {!loading && (
                        <Marker position={currentPosition} />
                    )}
                </GoogleMap>
            </LoadScript>
        </>
    );
};

export default MapComponent;
