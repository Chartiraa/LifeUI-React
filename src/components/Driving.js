
import React, { useState } from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { ButtonGroup, ToggleButton, Form } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2"
import Slider from 'react-rangeslider'
import "react-rangeslider/lib/index.css"

export default () => {

    let movementModStatus = false

    const [movementMod, setMovementMod] = useState('2');

    const [rangeValue, setRangeValue] = useState(35);

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
                    movementModStatus = false
                }
            });
        }
        else if (movementMod == 2 && e.currentTarget.value == '1') {
            setMovementMod('1')
            movementModStatus = true
        }
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
            <Form.Select className="mt-5">
                <option value="1">Front Cam</option>
                <option value="2">Left Cam</option>
                <option value="3">Right Cam</option>
            </Form.Select>
            <Form.Select className="mt-2">
                <option value="carMod">Car Drive</option>
                <option value="doubleMod">Double Turn</option>
                <option value="crabMod">Crab Walk</option>
                <option value="fokrliftMod">Forklift Drive</option>
                <option value="centerMod">Center Turn</option>
            </Form.Select>
            <hr className="border border-black border-2 mt-5"></hr>
            <div className='slider mt-5'>
                <Slider
                    min={0}
                    max={100}
                    value={rangeValue}
                    labels={{0: 'Slow', 100: 'Fast'}}
                    onChange={(e) => setRangeValue(e)}
                />
            </div>
        </div>
    );
};
