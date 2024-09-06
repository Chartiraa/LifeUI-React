import React, { useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { ButtonGroup } from '@themesberg/react-bootstrap';
import { Button } from "primereact/button";
import { Slider } from 'primereact/slider';
import "../css/Slider.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { socket } from "../services/socket";
import '../css/Buttons.css';  // Özelleştirilmiş CSS'i buraya dahil edin
import joystick from '../assets/img/joystick.png'
import joystickBase from '../assets/img/joystick-base.png'

export default function Joystickv2() {
    const [joystickAxis, setJoystickAxis] = useState(["x", "z"]);
    const [joystickData, setJoystickData] = useState({ x: 0.0, y: 0.0 });
    const [lockState, setLockState] = useState("Free");
    const [activeDriveMode, setActiveDriveMode] = useState("regular");  // Sürüş modunun state'i
    const [activeControlMode, setActiveControlMode] = useState("free"); // Kontrol butonlarının state'i
    const [power, setPower] = useState(false);
    const [rangeValue, setRangeValue] = useState(50); // Varsayılan orta hızda


    const handleMove = (data) => {
        if (joystickData.x !== ParseFloat(data.x, 1) || joystickData.y !== ParseFloat(data.y, 1)) {
            setJoystickData({ x: ParseFloat(data.x, 1), y: ParseFloat(data.y, 1) });
        }
    };

    const sliderChange = (e) => {
        setRangeValue(e);
        socket.emit("speedFactor", e);
    };

    const handleStop = () => {
        setJoystickData({ x: 0, y: 0 });
    };

    const axisSelect = (e) => {
        setJoystickAxis(e.target.value.split(","));
        socket.emit("turnType", e.target.value);
    };

    const lockSelect = (e) => {
        setLockState(e.target.value);
    };

    function ParseFloat(str, val) {
        str = str.toString();
        str = str.slice(0, (str.indexOf(".")) + val + 1);
        return Number(str);
    }

    useEffect(() => {
        if (joystickAxis[0] === "x" && joystickAxis[1] === "y") {
            let conditions = { x: joystickData.x, y: joystickData.y };
            socket.emit("Joystick", conditions);
        } else if (joystickAxis[0] === "x" && joystickAxis[1] === "z") {
            let conditions = { x: joystickData.x, z: joystickData.y };
            socket.emit("Joystick", conditions);
        } else if (joystickAxis[0] === "y" && joystickAxis[1] === "z") {
            let conditions = { y: 0, z: joystickData.y };
            socket.emit("Joystick", conditions);
        }
    }, [joystickData]);

    // Sürüş modunu değiştiren fonksiyon
    const driveMod = (mode) => {
        setActiveDriveMode(mode);
    }

    // Hareket kontrol modunu değiştiren fonksiyon
    const controlMode = (mode) => {
        setActiveControlMode(mode);
    }

    return (
        <>
            {/* Sürüş Modları Buton Grubu */}
            <ButtonGroup className="mb-3 d-flex justify-content-between">
                <Button
                    label="NORMAL SÜRÜŞ"
                    className={`w-50 mr-1 mod-button ${activeDriveMode === "regular" ? "active" : ""}`}
                    onClick={() => driveMod("regular")}
                />
                <Button
                    label="YENGEÇ SÜRÜŞ"
                    className={`w-50 mod-button ${activeDriveMode === "crab" ? "active" : ""}`}
                    onClick={() => driveMod("crab")}
                />
            </ButtonGroup>

            {/* Hareket Kontrol Butonları */}
            <ButtonGroup className="mb-3 d-flex justify-content-between">
                <Button
                    label="Serbest"
                    className={`w-25 axis-button ${activeControlMode === "free" ? "active" : ""}`}
                    onClick={() => controlMode("free")}
                />
                <Button
                    label="Yatay"
                    className={`w-25 axis-button ${activeControlMode === "horizontal" ? "active" : ""}`}
                    onClick={() => controlMode("horizontal")}
                />
                <Button
                    label="Dikey"
                    className={`w-25 axis-button ${activeControlMode === "vertical" ? "active" : ""}`}
                    onClick={() => controlMode("vertical")}
                />
                <Button
                    label="Dönüş"
                    className={`w-25 axis-button ${activeControlMode === "center" ? "active" : ""}`}
                    onClick={() => controlMode("center")}
                />
            </ButtonGroup>

            <div className='slider mb-5'>
                <Slider className={`slider ${power ? 'p-inputswitch-checked' : ''}`} value={rangeValue} max="100" min="0" onChange={(e) => sliderChange(e.value)} />
            </div>

            <div style={{ justifyContent: 'center', display: 'flex', marginTop: '30px', marginBottom: '30px' }}>
                <Joystick controlPlaneShape={lockState} size={200} stickSize={110} stickImage={joystick} baseImage={joystickBase} move={handleMove} stop={handleStop}></Joystick>
            </div>
        </>
    );
}
