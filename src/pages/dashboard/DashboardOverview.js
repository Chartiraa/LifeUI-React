
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup, Image } from '@themesberg/react-bootstrap';
import Ratio from 'react-bootstrap/Ratio'


export default () => {

  const handleMove = () => (
    console.log("dsghdg")
  )

  return (
    <>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <Ratio aspectRatio="16x9">
            <Image src="../../assets/img/paypal-logo.svg" rounded />
          </Ratio>
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
        </Col>
      </Row>

    </>
  );
};
