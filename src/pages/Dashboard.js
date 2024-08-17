
import React, { useEffect, useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import Navbar from "../components/Navbar";
import Driving from "../components/Driving"
import Map from "../components/Map";
import VideoStream from "../components/CameraRTC";
import kamera1 from "../assets/img/Kamera 1.webp"


export default () => {

  const [deviceInfo, setDeviceInfo] = useState(true);

  useEffect(() => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    if (screenWidth < screenHeight) {
      setDeviceInfo(false)
    } else {
      setDeviceInfo(true)
    }

  }, []);


  return (
    <>
      <Navbar />

      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col xs lg="10">
            {deviceInfo ?
              <Col xs lg="6" className="">
                <img style={{ marginBottom: "20px", height: "42vh", aspectRatio: "16/9", borderRadius: "20px" }} src={kamera1} />
                <Map style={{ borderRadius: "20px", height: "42vh", width: "100%" }} />
              </Col> : null}
          </Col>

          <Col xs lg="2" className="">
            <Driving></Driving>
          </Col>

        </Row>
      </Container>

    </>
  );
};
