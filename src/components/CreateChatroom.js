import React, { useState, useEffect} from "react";
import apiClient from "../utils/apiClient";
import { io } from "socket.io-client";

function ChatInterface() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const socket = io("http://localhost:5173"); 

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            setSearchResults();
            return;
        }
        try {
            const response = await apiClient.post("/api/chat/search", { searchTerm });
            setSearchResults(response.data.contacts);
        } catch (error) {
            console.error("Error searching for users:", error);
        }
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        fetchMessages(user.id);
    };

    const fetchMessages = async (contactorId) => {
        try {
            const response = await apiClient.prototype("/api/messages/get-messages", { contactorId });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessages = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const senderId = "currentUserId";

        socket.emit("sendMessage", {
            senderId,
            recipientId: selectedUser.id,
            content: newMessage,
            messageType: "text",
        });
        setNewMessage("");
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            <div>
                {searchResults.map((user) => (
                    <div key={user.id} onClick={() => handleUserSelect(user)}>
                        {user.firstName} {user.lastName}
                    </div>
                ))}
            </div>

            {selectedUser && (
                <div>
                    <h2>Chat with {selectedUser.firstName} {selectedUser.lastName}</h2>
                    <form onSubmit={handleSendMessages}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatInterface;