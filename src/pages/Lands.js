import React, { useState } from "react";
import { Col, Row, ButtonGroup } from '@themesberg/react-bootstrap';
import { Button } from "primereact/button";

import Navbar from "../components/Navbar";
import MapComponent from "../components/Map";
import { LandCard, LandRegister, LandEditor } from "../components/LandCard";

export default () => {

    const [registerState, setRegisterState] = useState("0");

    const [editState, setEditState] = useState(false);

    const [selectedCard, setSelectedCard] = useState(1);

    const cards = [
        { id: 1, title: 'Arazi-1', bitkiTuru: 'İlaçlama', araziBoyutu: '500 m²', siraArasi: '1.5 m', siraUstu: '1 m' },
        { id: 2, title: 'Arazi-2', bitkiTuru: 'Sulama', araziBoyutu: '300 m²', siraArasi: '1.2 m', siraUstu: '0.8 m' },
        // Diğer kartlar buraya eklenebilir
    ];

    const handleCardClick = (id) => {
        setSelectedCard(id);
    };


    const handleChange = (e) => {
        if (registerState == '0' && e.currentTarget.value == '1') {
            setRegisterState('1');
            setEditState(false);
        }
        else if (registerState == '1' && e.currentTarget.value == '0') {
            setRegisterState('0');
            setEditState(false);
        }
    };

    const onClickEdit = () => {
        setEditState(true);
        console.log(editState)
    }

    return (
        <>
            <Navbar />
            <Row>
                <Col xl={3}>
                    <ButtonGroup style={{ marginTop: '20px', minWidth: '100%', marginBottom: '20px' }}>
                        <Button label="Kayıtlı Araziler" className={`land-button w-100 ${registerState === '0' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "0" } })} />
                        <Button label="Yeni Arazi Kaydı" className={`land-button w-100 ${registerState === '1' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "1" } })} />
                    </ButtonGroup>

                    {cards.map((card) => (
                        <LandCard
                            key={card.id}
                            title={card.title}
                            bitkiTuru={card.bitkiTuru}
                            araziBoyutu={card.araziBoyutu}
                            siraArasi={card.siraArasi}
                            siraUstu={card.siraUstu}
                            isSelected={selectedCard === card.id}
                            onClick={() => handleCardClick(card.id)}
                            onClickEdit={onClickEdit}
                        />
                    ))}
                </Col>
                <Col xl={9}>
                    {registerState == '0' && editState == false ? <MapComponent style={{ height: "90vh", width: "100%", borderRadius: "5px" }} showPolygon={true} /> :
                        registerState == '1' && editState == false ? <LandRegister /> :
                            registerState == '1' && editState == true ? <LandEditor /> :
                                registerState == '0' && editState == true ? <LandEditor /> : null}
                </Col>
            </Row>
        </>
    );
}