
import React, { useEffect, useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import Driving from "../../components/Driving"
import VideoComponent from "../../components/Camera";
import VideoStream from "../../components/CameraRTC";

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
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          {deviceInfo ? <Col className="">
            <VideoStream />
          </Col> : null}


          <Col xs lg="2" className="">
            <Driving></Driving>
          </Col>

        </Row>
      </Container>

    </>
  );
};
