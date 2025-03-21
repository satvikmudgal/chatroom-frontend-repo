import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import socket from "../utils/socket";

function CreateChatroom() {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [showingAllContacts, setShowingAllContacts] = useState(false); 

    // Fetch all contacts
    const fetchAllContacts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/api/contacts/all-contacts");
            setContacts(response.data.contacts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching all users:", error);
            setError("Error fetching contacts. Please try again.");
            setLoading(false);
        }
    };

    // Search contacts by searchTerm
    const searchContacts = async () => {
        if (!searchTerm) {
            setError("Search term is required.");
            return;
        }
        setLoading(true);
        try {
            const response = await apiClient.post("/api/contacts/search", { searchTerm });
            setContacts(response.data.contacts);
            setLoading(false);
        } catch (error) {
            console.error("Error searching for users:", error);
            setError("Error searching for users. Please try again.");
            setLoading(false);
        }
    };

    const handleSelectContact = async (contact) => {
        setSelectedContact(contact);

        try {
            const response = await apiClient.post("/api/messages/get-messages", { id: contact.id });
            setChatMessages(response.data.messages);
        } catch (error) {
            console.error("Error loading messages:", error);
            setError("Error loading messages. Please try again.");
        }
    };

    const handleSendMessage = () => {
        if (!messages.trim()) return;

        socket.emit("sendMessage", {
            sender: "currentUserId",
            recipient: selectedContact.id,
            content: messages,
            messageType: "text",
        });

        const newMessage = {
            sender: { id: "currentUserId", firstName: "Your Name" },
            recipient: selectedContact,
            content: messages,
            messageType: "text",
        };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessages("");
    };

    useEffect(() => {
        socket.on("receiveMessage", (messages) => {
            if (messages.recipient.id === selectedContact.id || messages.sender.id === selectedContact.id) {
                setChatMessages((prevMessages) => [...prevMessages, messages]);
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [selectedContact]);

    return (
        <div>
            <h2>Create Chatroom</h2>

            <div>
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => { searchContacts(); setShowingAllContacts(false); }}>Search Contacts</button>
                <button onClick={() => { fetchAllContacts(); setShowingAllContacts(true); }}>Show All Contacts</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading contacts...</p>}

            <div>
                {showingAllContacts ? (
                    contacts.length === 0 ? (
                        <p>No contacts found.</p>
                    ) : (
                        contacts.map((contact) => (
                            <div key={contact.value} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                                <p><strong>{contact.label || "No name available"}</strong></p>
                                <button onClick={() => handleSelectContact(contact)}>Send Message</button>
                            </div>
                        ))
                    )
                ) : (
                    contacts.length === 0 ? (
                        <p>No search results found.</p>
                    ) : (
                        contacts.map((contact) => (
                            <div key={contact.value} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                                <p><strong>{contact.email}: {contact.label || "No name available"}</strong></p>
                                <button onClick={() => handleSelectContact(contact)}>Send Message</button>
                            </div>
                        ))
                    )
                )}
            </div>

            {selectedContact && (
                <div>
                    <h3>Chat with - {selectedContact.email}: {selectedContact.label} </h3>
                    <div>
                        {chatMessages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <strong>{msg.sender.firstName}:</strong>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={messages}
                            onChange={(e) => setMessages(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateChatroom;