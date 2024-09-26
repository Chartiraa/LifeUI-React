import React, { useState } from 'react';
import Map from '../components/Map';


const MapComponent = () => {

  const [coords, setCoords] = useState([]);

  const handleLocationSelect = (location) => {
    console.log("Seçilen konum:", location);
  };

  return (
    <>
      <h1 style={{ marginTop: "20px" }}>Harita</h1>
      <Map style={{ height: "80vh", width: "100%" }} onLocationSelect={handleLocationSelect} coords={[]} setCoords={() => { }} />
    </>
  );
};

export default MapComponent;
