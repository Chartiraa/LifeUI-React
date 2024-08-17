
import React, { useState, useEffect, useCallback } from "react";
import { socket } from "../services/socket";

export default () => {

  const [navbarData, setNavbarData] = useState({ temperature: 'waiting...', humidity: 'waiting...', battery: 'waiting...', connection: 'waiting...' });

  const handleNavbarData = useCallback((data) => {
    setNavbarData((prevData) => {
      if (prevData.temperature !== data.temperature || prevData.humidity !== data.humidity || prevData.battery !== data.battery || prevData.connection !== data.connection) {
        return data;
      }
      return prevData;
    });
  }, []);

  useEffect(() => {
    socket.on('Navbar', handleNavbarData);
  }, [handleNavbarData]);

  return (
    <div style={{ marginTop: "20px", marginBottom: "20px", display: "flex", justifyContent: "end" }}>
      <div style={{ padding: "10px" }}>
        <p style={{ display: "inline", color: "#E4003A", fontWeight: "bold" }}>Sıcaklık: </p>
        <p style={{ display: "inline", marginRight: "10px" }}>{navbarData.temperature + "°"}</p>

        <p style={{ display: "inline", color: "#4535C1", fontWeight: "bold" }}>Nem: </p>
        <p style={{ display: "inline", marginRight: "10px" }}>{navbarData.humidity + "%"}</p>

        <p style={{ display: "inline", color: "#508D4E", fontWeight: "bold" }}>Batarya: </p>
        <p style={{ display: "inline", marginRight: "10px" }}>{navbarData.battery + "%"}</p>

        <p style={{ display: "inline", color: "#E76F51", fontWeight: "bold" }}>Bağlantı:</p>
        <p style={{ display: "inline", marginRight: "10px" }}>{navbarData.connection}</p>
      </div>
    </div>
  );
};
