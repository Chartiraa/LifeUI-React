import React, { useEffect, useState } from "react";
import Terminal4SSH from "../components/Terminal4SSH";
import { socket } from "../services/socket";

export default () => {

  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    socket.on('ipAddress', (data) => {
      setIpAddress(data)
    })
  }, [])

  return (
    <>
      <h1>Settings</h1>
      <h3>IP Address: {ipAddress}</h3>
      <Terminal4SSH/>
    </>
  );
};
