
import React, { useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2"
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css"
import Joystick from "./Joystick";
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { socket } from "../services/socket";


export default () => {

    const [movementModStatus, setMovementModStatus] = useState(false)

    const [movementMod, setMovementMod] = useState('2');

    const [rangeValue, setRangeValue] = useState(30);

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
            setMovementMod('1')
            setMovementModStatus(true)
            socket.emit("autonomousState", 'Autonomous')
        }
    }

    const sliderChange = (e) => {
        socket.emit("speedFactor", e)
    }

    const turnType = (e) => {
        socket.emit("turnType", e.target.value)
    }

    const cameraSelect = (e) => {
        socket.emit("cameraSelect", e.target.value)
    }
    const startDrive = () => {
        socket.emit("autonomousDrive", 'start')
    }

    const stopDrive = () => {
        socket.emit("autonomousDrive", 'stop')
    }

    return (
        <div className="text-center">

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

            <Form.Select className="mt-5" onChange={(e) => cameraSelect(e)}>
                <option value="Front Cam">Front Cam</option>
                <option value="Left Cam">Left Cam</option>
                <option value="Right Cam">Right Cam</option>
            </Form.Select>
            <Form.Select className="mt-2" onChange={(e) => turnType(e)}>
                <option value="carMod">Car Drive</option>
                <option value="doubleMod">Double Turn</option>
                <option value="crabMod">Crab Walk</option>
                <option value="forkliftMod">Forklift Drive</option>
                <option value="centerMod">Center Turn</option>
            </Form.Select>
            <hr className="border border-black border-2 mt-5"></hr>
            {movementModStatus ? (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button onClick={startDrive} severity="success" label="Start Drive" style={{marginRight: '10px', marginBottom: '10px', height: '60px'}}/>
                    <Button onClick={stopDrive} severity="danger" label="Stop Drive" style={{height: '60px'}}/>
                </div>
            ) : (
                <div>
                    <div className='slider mt-5'>
                        <Slider
                            min={0}
                            max={100}
                            value={rangeValue}
                            labels={{ 0: 'Slow', 100: 'Fast' }}
                            onChange={(e) => setRangeValue(e)}
                            onChangeComplete={() => sliderChange(rangeValue)}
                        />
                    </div>
                    <Joystick />
                </div>
            )}
        </div>
    );
};
