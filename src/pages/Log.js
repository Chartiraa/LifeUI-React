import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import Graphs from "../components/Graphs";
import Navbar from "../components/Navbar";


export default () => {

  return (
    <>
      <Navbar />
      <Row style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
        <Col style={{ display: "flex", flexDirection: "column", marginTop: "20px", height: "88vh", marginBottom: "15px", marginRight: "20px", marginLeft: "20px", border: "1px solid #8CA5C6", borderRadius: "5px", backgroundColor: "#FFFFFF" }}>
          <div style={{ backgroundColor: "#F5F8FB", padding: "16px", margin: "16px", textAlign: "center", fontSize: "18px" }}>
            <label style={{ fontWeight: "bold" }}>CİHAZ VERİLERİ</label>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "space-around", backgroundColor: "#FFFFFF", padding: "5px 10px" }}>
            <Graphs />
            <Graphs />
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-around", backgroundColor: "#FFFFFF", padding: "5px 10px" }}>
            <Graphs />
            <Graphs />
          </div>

        </Col>

        <Col style={{ display: "flex", flexDirection: "column", marginTop: "20px", marginBottom: "15px", marginRight: "20px", border: "1px solid #8CA5C6", borderRadius: "5px", backgroundColor: "#FFFFFF" }}>
          <div style={{ backgroundColor: "#F5F8FB", padding: "16px", margin: "16px", textAlign: "center", fontSize: "18px" }}>
            <label style={{ fontWeight: "bold" }}>ORTAM VERİLERİ</label>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
            <Graphs />
            <Graphs />
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", backgroundColor: "#FFFFFF" }}>
            <Graphs />
            <Graphs />
          </div>
        </Col>
      </Row>
    </>
  );
};