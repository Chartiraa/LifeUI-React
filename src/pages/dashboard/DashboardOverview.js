
import React from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Image, Container, Button} from '@themesberg/react-bootstrap';
import Ratio from 'react-bootstrap/Ratio'
import Driving from "../../components/Driving"

export default () => {

  const imagePath = process.env.PUBLIC_URL + "/UI Design.jpg";

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="">
            <Ratio aspectRatio="16x9">
              <Image src={imagePath} rounded />
            </Ratio>
          </Col>
          <Col xs lg="2" className="">
            <Driving></Driving>
          </Col>

        </Row>
      </Container>

    </>
  );
};
