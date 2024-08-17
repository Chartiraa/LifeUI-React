import React from "react";
import { Col, Row } from '@themesberg/react-bootstrap';
import kamera1 from "../assets/img/Kamera 1.webp"
import kamera2 from "../assets/img/Kamera 2.webp"
import kamera3 from "../assets/img/Kamera 3.webp"
import kamera4 from "../assets/img/Kamera 4.webp"

export default () => {

    return (
        <>
            <h1 style={{ marginTop: "20px" }}>Kameralar</h1>

            <Row style={{ marginTop: "20px", display: "flex", justifyContent: "" }}>
                <Col xs={12} sm={6} className="mb-4">
                    <img style={{ marginBottom: "20px", height: "42vh", aspectRatio: "16/9" }} src={kamera1}></img>
                    <img style={{ height: "42vh", aspectRatio: "16/9" }} src={kamera3}></img>
                </Col>
                <Col xs={12} sm={6} className="mb-4">
                    <img style={{ marginBottom: "20px", height: "42vh", aspectRatio: "16/9" }} src={kamera2}></img>
                    <img style={{ height: "42vh", aspectRatio: "16/9" }} src={kamera4}></img>
                </Col>
            </Row >

        </>
    );
}