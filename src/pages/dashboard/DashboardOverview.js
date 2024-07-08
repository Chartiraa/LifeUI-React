
import React from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container} from '@themesberg/react-bootstrap';
import Driving from "../../components/Driving"
import VideoComponent from "../../components/Camera";

export default () => {

  const imagePath = process.env.PUBLIC_URL + "/UI Design.jpg";

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="">
            <VideoComponent />
          </Col>
          <Col xs lg="2" className="">
            <Driving></Driving>
          </Col>

        </Row>
      </Container>

    </>
  );
};
