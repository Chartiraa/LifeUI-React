
import React, { useEffect, useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2"
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css"
import Joystickv2 from "./Joystickv2";
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { socket } from "../services/socket";


export default () => {

    const [movementModStatus, setMovementModStatus] = useState(false)

    const [movementMod, setMovementMod] = useState('2');

    const [rangeValue, setRangeValue] = useState(20);

    const [plowSpeed, setPlowSpeed] = useState(0);

    const [lifeWidth, setLifeWidth] = useState(120);

    const [lifeHeight, setLifeHeight] = useState(120);

    const [gpsPosX, setGpsPosX] = useState(50);

    const [gpsPosY, setGpsPosY] = useState(40);

    const [turnRadius, setTurnRadius] = useState(50);

    const [initX, setInitX] = useState(5);

    const [depthThreshold, setDepthThreshold] = useState(50);

    const movementMods = [
        { name: 'Autonomous', value: '1' },
        { name: 'Manuel', value: '2' }
    ];

    const handleChange = (e) => {
        if (movementMod == 1 && e.currentTarget.value == '2') {
            Swal.fire({
                icon: "warning",
                title: "Autonomous driving mode is turned off. Do you approve?",
                showDenyButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `Deny`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Switched to manual driving!", "", "success");
                    setMovementMod('2')
                    setMovementModStatus(false)
                    socket.emit("autonomousState", 'Manuel')
                }
            });
        }
        else if (movementMod == 2 && e.currentTarget.value == '1') {
            Swal.fire({
                icon: "warning",
                title: "Autonomous driving mode is turned on. Do you approve?",
                showDenyButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `Deny`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Switched to autonomous driving!", "", "success");
                    setMovementMod('1')
                    setMovementModStatus(true)
                    socket.emit("autonomousState", 'Autonomous')
                    socket.emit("Joystick", { x: 0.0, y: 0.0 })
                }
            });
        }
    }

    const sliderChange = (e) => {
        setRangeValue(e)
        socket.emit("speedFactor", e)
    }

    const startDrive = (data) => {
        socket.emit("lifeHeight", lifeHeight)
        socket.emit("lifeWidth", lifeWidth)
        socket.emit("gpsPosY", gpsPosY)
        socket.emit("gpsPosX", gpsPosX)
        socket.emit("turnRadius", turnRadius)
        socket.emit("depth", depthThreshold)
        socket.emit("initX", initX)
        setTimeout(() => {
            socket.emit("autonomousDrive", 'start')
        }, 1000)
    }

    const pauseDrive = () => {
        socket.emit("autonomousDrive", 'pause')
    }

    const stopDrive = () => {
        socket.emit("autonomousDrive", 'stop')
    }

    const plowController = (data) => {
        if (plowSpeed !== data) {
            setPlowSpeed(data)
            socket.emit("plow", data * 25.5)
        }
    }

    return (
        <div className="text-center" style={{ height: '100%' }}>

            <ButtonGroup>
                {movementMods.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                        name="radio"
                        value={radio.value}
                        checked={movementMod === radio.value}
                        onChange={handleChange}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            <div className='slider mt-5 mb-5'>
                <Slider
                    min={0}
                    max={100}
                    value={rangeValue}
                    labels={{ 0: 'Slow', 50: 'Speed Factor', 100: 'Fast' }}
                    onChange={(e) => sliderChange(e)}
                />
            </div>

            <hr className="border border-black border-2 mt-5"></hr>

            {movementModStatus ? (
                <>
                    <Form.Label>Life Width</Form.Label>
                    <Form.Control required type="text" value={lifeWidth} placeholder="Life Width" onChange={(e) => setLifeWidth(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>Life Height</Form.Label>
                    <Form.Control required type="text" value={lifeHeight} placeholder="Life Height" onChange={(e) => setLifeHeight(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>GPS PosX</Form.Label>
                    <Form.Control required type="text" value={gpsPosX} placeholder="GPS PosX" onChange={(e) => setGpsPosX(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>GPS PosY</Form.Label>
                    <Form.Control required type="text" value={gpsPosY} placeholder="GPS PosY" onChange={(e) => setGpsPosY(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>Turn Radius</Form.Label>
                    <Form.Control required type="text" value={turnRadius} placeholder="Turn Radius" onChange={(e) => setTurnRadius(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>initX</Form.Label>
                    <Form.Control required type="text" value={initX} placeholder="Start point X" onChange={(e) => setInitX(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Form.Label>Depth Threshold</Form.Label>
                    <Form.Control required type="text" value={depthThreshold} placeholder="Depth threshold" onChange={(e) => setDepthThreshold(e.target.value)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} className="mt-4">
                        <Button onClick={startDrive} severity="success" label="Start Drive" style={{ marginRight: '10px', marginBottom: '10px', height: '60px' }} />
                        <Button onClick={stopDrive} severity="danger" label="Stop Drive" style={{ height: '60px' }} />
                    </div>
                    <Button onClick={pauseDrive} severity="warning" label="Pause Drive" style={{ marginBottom: '10px', marginRight: '10px', width: '100%', height: '60px' }} />
                </>
            ) : (
                <div>
                    <Joystickv2 />
                    <div className='slider mb-5'>
                        <label className="mt-1">Plow Arm Speed</label>
                        <Slider
                            min={-10}
                            max={10}
                            value={plowSpeed}
                            labels={{ '-10': 'Open', 10: 'Close' }}
                            onChange={(e) => plowController(e)}
                            onChangeComplete={() => plowController(0)}
                        />
                    </div>
                </div>

            )}
        </div>
    );
};

/*            <Form.Select className="mt-4" onChange={(e) => cameraSelect(e)}>
                <option value="Front Cam">Front Cam</option>
                <option value="Left Cam">Left Cam</option>
                <option value="Right Cam">Right Cam</option>
            </Form.Select>*/