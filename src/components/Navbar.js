import React, { useState, useEffect, useCallback } from "react";
import { Col } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faBatteryFull, faWifi, faCalendar, faWater } from '@fortawesome/free-solid-svg-icons';

import { socket } from "../services/socket";

export default () => {

  const [navbarData, setNavbarData] = useState({ temperature: '24', humidity: '50', battery: '82', connection: 'Good' });

  const [formattedDate, setFormattedDate] = useState("");

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

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 eklenir
      const year = date.getFullYear();
      setFormattedDate(`${hours}:${minutes}  ${day}.${month}.${year}`);
    };

    // Her saniye tarih ve saati güncelle
    const intervalId = setInterval(updateDate, 1000);

    // Temizlik işlemi (component unmount olduğunda)
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginRight: "12px", alignItems: "center" }}>
      {/* Tarih Kısmı */}
      <div style={{ marginTop: "20px", marginBottom: "15px", border: "1px solid #8CA5C6", borderRadius: "5px", backgroundColor: "#FFFFFF", padding: "11px 10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faCalendar} style={{ display: "inline", marginRight: "10px", color: "#262B40" }} />
          <label>{formattedDate}</label>
        </div>
      </div>

      {/* Sensör Verileri Kısmı */}
      <div style={{ width: "393px", marginTop: "20px", marginBottom: "15px", border: "1px solid #8CA5C6", borderRadius: "5px", backgroundColor: "#FFFFFF", padding: "5px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Sıcaklık */}
          <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
            <FontAwesomeIcon icon={faTemperatureHigh} style={{ color: "#262B40", marginRight: "12px" }} />
            <label style={{ margin: 0, color: "black" }}>{navbarData.temperature}°</label>
          </div>
          {/* Divider */}
          <span style={{ color: "black", fontSize: "1.5rem", fontWeight: "200" }}>I</span>

          {/* Nem */}
          <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
            <i className="bi bi-droplet-fill" style={{ color: "#262B40", marginRight: "12px" }} aria-hidden="true"></i>
            <label style={{ margin: 0, color: "black" }}>{navbarData.humidity}%</label>
          </div>
          {/* Divider */}
          <span style={{ color: "black", fontSize: "1.5rem", fontWeight: "200" }}>I</span>

          {/* Pil Durumu */}
          <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
            <FontAwesomeIcon icon={faBatteryFull} style={{ color: "#262B40", marginRight: "12px" }} />
            <label style={{ margin: 0, color: "black" }}>{navbarData.battery}%</label>
          </div>
          {/* Divider */}
          <span style={{ color: "black", fontSize: "1.5rem", fontWeight: "200" }}>I</span>

          {/* Wifi Durumu */}
          <div style={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
            <FontAwesomeIcon icon={faWifi} style={{ color: "#262B40", marginRight: "12px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};
