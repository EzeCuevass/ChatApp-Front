import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from '../context/socketContext.jsx';
import { BoxMessage } from './BoxMessage.jsx';


const MensajesChat = () => {
  // MensajesChat component
  // Displays the messages in the general chat
  // Uses the SocketContext to communicate with the server
  // Uses useState to manage the messages state
  const [mensajes, setMensajes] = useState([]);
  const socket = useContext(SocketContext);
  const scrollDown = useRef(null);

  
  useEffect(() => {
    // When the component mounts, it requests the messages from the server
    socket.emit('get')
    // Handler to receive the messages from the server
    const mensajesFrontHandler = (messages) => {
      setMensajes(messages);
    };
    // Handler to receive a new message from the server
    const newMessageFrontHandler = (newmessage) => {
      setMensajes(prevmessages => [...prevmessages, newmessage]);
    };
    // Print all the messages in the screen
    socket.on('mensajesFront', mensajesFrontHandler);
    
    // Add new message to the screen
    socket.on("newmessagefront", newMessageFrontHandler);

    // Cleanup function to remove the listeners when the component unmounts
    return () => {
      socket.off('mensajesFront', mensajesFrontHandler);
      socket.off('newmessagefront', newMessageFrontHandler);
    };
  }, [socket])
  useEffect(() => {
    // Scroll to the bottom of the messages when new messages are added
    scrollDown.current.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);
  return (
    <div style={{height: "100%", margin: "10px", width: "100%"}}>
        {mensajes.map(msg => (
          // Map through the messages and render each one using BoxMessage component
          <BoxMessage key={msg._id} msg={msg} />
        ))}
        {/* Use a ref to scroll to the bottom of the messages */}
        <div ref={scrollDown}></div>
    </div>
  );
}

export default MensajesChat;