import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import { LineChart, PieChart } from "../components/Graphs";
import Navbar from "../components/Navbar";

export default () => {
  return (
    <>
      <Navbar />
      <Row style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }}>
        {/* Device Data Column */}
        <Col xs={6} style={{ padding: "0 10px" }}>
          <div style={{ border: "1px solid #8CA5C6", borderRadius: "10px", backgroundColor: "#FFFFFF", height: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <div style={{ backgroundColor: "#F5F8FB", padding: "16px", textAlign: "center", fontSize: "18px", borderRadius: "5px", margin: "16px", marginBottom: "0" }}>
              <label style={{ fontWeight: "bold" }}>CİHAZ VERİLERİ</label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", padding: "10px" }}>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
            </div>
          </div>
        </Col>

        {/* Environment Data Column */}
        <Col xs={6} style={{ padding: "0 10px" }}>
          <div style={{ border: "1px solid #8CA5C6", borderRadius: "10px", backgroundColor: "#FFFFFF", height: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <div style={{ backgroundColor: "#F5F8FB", padding: "16px", textAlign: "center", fontSize: "18px", borderRadius: "5px", margin: "16px", marginBottom: "0" }}>
              <label style={{ fontWeight: "bold" }}>ORTAM VERİLERİ</label>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", padding: "10px" }}>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
              <Col xs={6} style={{ padding: "5px", borderRadius: "10px", overflow: "hidden" }}>
                <LineChart label="Sıcaklık" graphLabel="Sıcaklık" icon="bi-thermometer-half" lineColor="#ff5733" />
              </Col>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};