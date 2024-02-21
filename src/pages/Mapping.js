
import React from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Image, Container } from '@themesberg/react-bootstrap';
import { Ratio } from "react-bootstrap"


export default () => {

  const imagePath = process.env.PUBLIC_URL + "/gridmap.png";

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="">
            <Ratio aspectRatio="16x9">
              <Image src={imagePath} rounded />
            </Ratio>
          </Col>
        </Row>
      </Container>
    </>
  );
};
