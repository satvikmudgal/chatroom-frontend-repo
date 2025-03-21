import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

function ChatList() {
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
              const response = await apiClient.get("/api/auth/userinfo");
              setCurrentUser(response.data);
          } catch (error) {
              console.error("Error fetching current user:", error);
          }
      };

      const fetchChatrooms = async () => {
          try {
              const response = await apiClient.get("/api/contacts/get-contacts-for-list");
              setContacts(response.data.contacts); // Assume this returns all user contacts
          } catch (error) {
              console.error("Error fetching chatrooms:", error);
          }
      };

      fetchCurrentUser(); 
      fetchChatrooms(); 

  }, []);

    return (
        <div>
          <h2>Recent Chats</h2>
          <ul>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`/chatroom/${contact.id}`}>{contact.email}</Link>
                </li>
              ))
            ) : (
              <p>No recent chats.</p>
            )}
          </ul>
        </div>
      );
    }
    

export default ChatList;