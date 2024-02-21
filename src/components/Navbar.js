
import React from "react";
import { faTemperatureLow, faEyeDropper, faBatteryThreeQuarters, faSignal } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from '@themesberg/react-bootstrap';
import { CounterWidget } from "./Widgets";
import { ROSMessageReceiver } from "../services/ROSSubscriber";

export default () => {

  return (
    <>

      <Row className="justify-content-md-center mt-4">

        <Col className="mb-4">
          <CounterWidget category="Temperature" title={ROSMessageReceiver("topic_name") + "°"} icon={faTemperatureLow} iconColor="shape-secondary" />
        </Col>

        <Col className="mb-4">
          <CounterWidget category="Humidity" title={ROSMessageReceiver("topic_name") + "%"} icon={faEyeDropper} iconColor="shape-secondary" />
        </Col>

        <Col className="mb-4">
          <CounterWidget category="Battery" title={ROSMessageReceiver("topic_name") + "%"} icon={faBatteryThreeQuarters} iconColor="shape-secondary" />
        </Col>

        <Col className="mb-4">
          <CounterWidget category="ROS Status" title={ROSMessageReceiver("topic_name")} icon={faSignal} iconColor="shape-secondary" />
        </Col>

      </Row>
    </>
  );
};
