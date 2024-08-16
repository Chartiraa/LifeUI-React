import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { socket } from '../services/socket';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(true);

  const mapStyles = {
    height: "80vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: 41.0082, // İstanbul'un enlemi
    lng: 28.9784 // İstanbul'un boylamı
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
    <LoadScript googleMapsApiKey="AIzaSyCTZ0owcy1IZu2PcBw7VMbdDrioIcZkdoo">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={18}
        center={loading ? defaultCenter : currentPosition}
      >
        {!loading && (
          <Marker position={currentPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
