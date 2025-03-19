import React, { useState, useEffect} from "react";
import apiClient from "../utils/apiClient";
import { io } from "socket.io-client";

function ChatInterface() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const socket = io("http://localhost:5173"); 

    useEffect(() => {
        fetchAllUsers();
        fetchCurrentUser();

        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("receiveMessage");
        }
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await apiClient.get("/api/contacts/all-contacts");
            console.log("All users response:", response.data);
            setAllUsers(response.data.contacts);
        }

        catch (error) {
            console.error("Error fetching all users:", error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await apiClient.get("/api/auth/userinfo");
            setCurrentUser(response.data);
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            setSearchResults();
            return;
        }
        try {
            const response = await apiClient.post("/api/contacts/search", { searchTerm });
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
        if (!newMessage.trim() || !selectedUser || !currentUser) return;

        const senderId = currentUser.id;

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
                {allUsers.map((user) => (
                    <div key={user.id} onClick={() => handleUserSelect(user)}>
                        {user.email}
                    </div>
                ))}
            </div>

            <div>
                {searchResults.map((user) => (
                    <div key={user.id} onClick={() => handleUserSelect(user)}>
                        {user.email} 
                    </div>
                ))}
            </div>

            {selectedUser && (
                <div>
                    <h2>Chat with {selectedUser.firstName} {selectedUser.lastName}</h2>
                    <div>
                        {/* Display messages */}
                        {messages.map((message, index) => (
                            <div key={index}>
                                <p>{message.content}</p>
                            </div>
                        ))}
                    </div>
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