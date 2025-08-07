import React, { useEffect, useState, useContext, useRef } from 'react';
import { SocketContext } from '../context/socketContext.jsx';
import { BoxMessage } from './BoxMessage.jsx';


const MessagesGroup = ({id}) => {
  // MessagesGroup component
  // Displays the messages in a specific group chat
  // Uses the SocketContext to communicate with the server
  // Uses useState to manage the messages state
    const [messagesGroup, setMessagesGroup] = useState([]);
      const socket = useContext(SocketContext);
      const scrollDown = useRef(null);
      
      
    useEffect(() => {
      // When the component mounts, it requests the messages for the specific group from the server
      socket.emit('getgroup', id)
      // Handler to receive the messages for the group from the server
      const groupFrontHandler = (groupdata) => {
        setMessagesGroup(groupdata.messages);
      }
      // Handler to receive a new message for the group from the server
      const newmessageFrontGroupHandler = (newmessagefront) => {
        setMessagesGroup(prevMessages => [...prevMessages, newmessagefront.mensaje]);
      }
      // Listen for the group messages and new messages
      socket.on('groupFront', groupFrontHandler);
      socket.on('newmessagefrontgroup', newmessageFrontGroupHandler);

      // Cleanup function to remove the listeners when the component unmounts
      return () => {
        socket.off('groupFront', groupFrontHandler);
        socket.off('newmessagefrontgroup', newmessageFrontGroupHandler);
      }
    }, [socket,id]);
    useEffect(() => {
      // Scroll to the bottom of the messages when new messages are added
        scrollDown.current.scrollIntoView({ behavior: 'smooth' });
      }, [messagesGroup]);
    return (
        <div style={{height: "100%", margin: "10px", width: "100%"}}>
          {/* Map through the messages and render each one using BoxMessage component */}
                {messagesGroup.map(msg => (
                    <BoxMessage key={messagesGroup.indexOf(msg)} msg={msg} />
                ))}
                {/* Use a ref to scroll to the bottom of the messages */}
                <div ref={scrollDown}></div>
        </div>
    )
}
export default MessagesGroup;