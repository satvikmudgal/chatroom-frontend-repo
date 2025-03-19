import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";

function Chatroom() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);

    });

        return () => {
            socket.off("receiveMessage");
        };
    }
    , []); 

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const messageData = {
            sender: "username",
            recipient: roomId,
            content: newMessage,
            messageType: "text",
        };

        socket.emit("sendMessage", messageData);
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
    }

    return (
        <div>
            <h2>Chatroom</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default Chatroom;