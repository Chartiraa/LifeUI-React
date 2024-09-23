import React, { useEffect, useState } from "react";
import { ButtonGroup } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";
import "react-rangeslider/lib/index.css";
import Joystickv2 from "./Joystickv2";
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { socket } from "../services/socket";

import "../css/Buttons.css";
import "../css/Switch.css";
import "../css/Dropdown.css";

export default () => {

    const [movementModStatus, setMovementModStatus] = useState(false);

    const [movementMod, setMovementMod] = useState('2');

    const [selectedEquipment, setSelectedEquipment] = useState("");

    const equipments = ["İlaçlama", "Çapalama", "Lazerle Yakma"]

    const movementMods = [
        { name: 'AUTO', value: '1' },
        { name: 'MANUEL', value: '2' },
    ];

    const handleChange = (e) => {
        if (movementMod == '1' && e.currentTarget.value == '2') {
            Swal.fire({
                icon: "warning",
                title: "Otonom sürüş modu kapatıldı. Onaylıyor musunuz?",
                showDenyButton: true,
                confirmButtonText: "Onayla",
                denyButtonText: `Reddet`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Manuel sürüşe geçildi!", "", "success");
                    setMovementMod('2');
                    setMovementModStatus(false);
                    socket.emit("autonomousState", 'Manuel');
                }
            });
        }
        else if (movementMod == '2' && e.currentTarget.value == '1') {
            Swal.fire({
                icon: "warning",
                title: "Otonom sürüş modu açıldı. Onaylıyor musunuz?",
                showDenyButton: true,
                confirmButtonText: "Onayla",
                denyButtonText: `Reddet`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Otonom sürüşe geçildi!", "", "success");
                    setMovementMod('1');
                    setMovementModStatus(true);
                    socket.emit("autonomousState", 'Autonomous');
                    socket.emit("Joystick", { x: 0.0, y: 0.0 });
                }
            });
        }
    };

    const driveController = (value) => {
        socket.emit("autonomousDrive", value);
    };

    const onEquipmentSelect = (e) => {
        setSelectedEquipment(e);
        socket.emit("selectedEquipment", e);
    };

    return (
        <>
            <div className="text-center" style={{ height: '100%', border: '1px solid #8CA5C6', borderRadius: '5px', padding: '15px', backgroundColor: '#FFFFFF' }}>

                <div className="d-flex justify-content-center align-items-center">

                    <ButtonGroup style={{ marginTop: '20px' }}>
                        <Button label="AUTO" className={`p-button-rounded autonomous-button ${movementMod === '1' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "1" } })} />
                        <Button label="MANUEL" className={`p-button-rounded autonomous-button ${movementMod === '2' ? 'active' : ''}`} onClick={() => handleChange({ currentTarget: { value: "2" } })} />
                    </ButtonGroup>
                </div >
                <hr style={{ width: '100%', border: '1px solid #8CA5C6', marginTop: '40px', marginBottom: '40px' }}></hr>
                {movementModStatus ? (
                    <span>safdgdas</span>
                ) : (
                    <>
                        <FloatLabel>
                            <Dropdown showClear inputId="equipment" value={selectedEquipment} onChange={(e) => onEquipmentSelect(e.value)} options={equipments} className="w-full dropdown" />
                            <label style={{ fontWeight: '600' }} htmlFor="equipment">Ekipman Seçin</label>
                        </FloatLabel>

                        <div className="d-flex justify-content-center mt-4">
                            <Button label="START" className="mx-1" onClick={() => driveController("start")} style={{ border: "none", backgroundColor: '#4CAF50', borderRadius: '100px 0 0 100px', boxShadow: "none" }} />
                            <Button label="PAUSE" className="" onClick={() => driveController("pause")} style={{ border: "none", backgroundColor: '#F1C71F', boxShadow: "none" }} />
                            <Button label="STOP" className="mx-1" onClick={() => driveController("stop")} style={{ border: "none", backgroundColor: '#E74C3C', borderRadius: '0 100px 100px 0', boxShadow: "none" }} />
                        </div>
                        <hr style={{ width: '100%', border: '1px solid #8CA5C6', marginTop: '40px', marginBottom: '40px' }}></hr>

                        <div className="mb-5 mt-3">
                            <Joystickv2 />
                        </div>
                    </>
                )
                }
            </div >

        </>
    );
};
