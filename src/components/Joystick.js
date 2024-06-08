import React, { useRef, useEffect, useState } from 'react';
import nipplejs from 'nipplejs';
import { socket } from "../services/socket";

const Joystick = () => {
    const joystickContainer = useRef(null);

    const [joystickData, setJoystickData] = useState({ x: '0', y: '0' })

    useEffect(() => {
        const manager = nipplejs.create({
            zone: joystickContainer.current,
            mode: 'static',
            position: { top: '60%', right: '8%' },
            color: 'red',
        });

        manager.on('move', (evt, nipple) => {
            setJoystickData({x: nipple.vector.x.toFixed(2), y: nipple.vector.y.toFixed(2)})
        });

        manager.on('end', (evt, nipple) => {
            setJoystickData({x: '0', y: '0'})
        });

        return () => {
            manager.destroy();
        };
    }, []); 

    useEffect(() => {
        socket.emit("Joystick", joystickData)
    }, [joystickData])

    return <div ref={joystickContainer} style={{ width: '200px', height: '200px' }} />;
};

export default Joystick;
