import React from "react";
import {  } from "@fortawesome/react-fontawesome";
import {  } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container, Image} from '@themesberg/react-bootstrap';
import { Ratio } from "react-bootstrap"
import { SalesValueWidget, SalesValueWidgetPhone } from "../components/Widgets";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export default () => {

  const imagePath = process.env.PUBLIC_URL + "/UI Design.jpg";

  return (
    <>
      <Col xs={12} className="mb-4 d-none d-sm-block">
        <SalesValueWidget
          title="Sales Value"
          value="10,567"
          percentage={10.57}
        />
      </Col>
      <Col xs={12} className="mb-4 d-sm-none">
        <SalesValueWidgetPhone
          title="Sales Value"
          value="10,567"
          percentage={10.57}
        />
      </Col>

      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="">
            <Ratio aspectRatio="16x9">
              <Image src={imagePath} rounded />
            </Ratio>
          </Col>
          <Col xs lg="2" className="">
          </Col>

        </Row>
      </Container>

    </>
  );
};
