import { useEffect, useState } from 'react';
import ROSLIB from 'roslib';

export const ROSMessageReceiver = (msgTopic, messageType = 'std_msgs') => {

  const [data, setData] = useState(35);

  /*useEffect(() => {
    // ROS Bridge bağlantısı kurulur
    const ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    ros.on('connection', () => {
      console.log('Connected');
      //setConnectionStatus('Connected');

    });

    ros.on('error', (error) => {
      console.log('Connection Error', error);
      //setConnectionStatus('Connection Error');

    });

    ros.on('close', () => {
      console.log('Closed');
      //setConnectionStatus('Closed');

    });


    const connect = new ROSLIB.Topic({
      ros,
      name: msgTopic,
      messageType: messageType,
    });

    connect.subscribe((message) => {
      setData(message);

    });


    return () => {
      connect.unsubscribe();
    };
  }, [msgTopic, messageType]);*/

  return data;

};

