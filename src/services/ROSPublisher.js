import ROSLIB from 'roslib';

const ROSMessageSender = (msgTopic, messageType, messageData)  => {
  
    const ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    const sendMsg= new ROSLIB.Topic({
      ros: ros,
      name: msgTopic,
      messageType: messageType
    });

    const message = new ROSLIB.Message({
      data: messageData
    });

    sendMsg.publish(message);

};

export default rosMessageSender
