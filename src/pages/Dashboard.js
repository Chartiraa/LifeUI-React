
import React, { useEffect, useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import Driving from "../components/Driving"
import VideoStream from "../components/CameraRTC";
import { socket } from "../services/socket";

export default () => {

  const [deviceInfo, setDeviceInfo] = useState(true);

  const [gps, setGps] = useState("");

  useEffect(() => {
    socket.on('gps_coord_ui', (data) => {
      setGps(data)
    })
  })



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
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          {deviceInfo ? <Col className="">
            <VideoStream />
            <label>GPS Coord: {gps}</label>
          </Col> : null}


          <Col xs lg="2" className="">
            <Driving></Driving>
          </Col>

        </Row>
      </Container>

    </>
  );
};
