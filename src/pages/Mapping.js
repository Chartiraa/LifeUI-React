import React from 'react';
import Map from '../components/Map';


const MapComponent = () => {

  return (
    <>
      <h1 style={{ marginTop: "20px" }}>Harita</h1>
      <Map style={{ height: "80vh", width: "100%" }} />
    </>
  );
};

export default MapComponent;
