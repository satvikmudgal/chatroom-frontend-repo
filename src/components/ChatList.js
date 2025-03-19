import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

function ChatList() {
    const [chatrooms, setChatrooms] = useState([]);
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
              const response = await apiClient.get("/api/contacts/all-contacts");
              setChatrooms(response.data.contacts); // Assume this returns all user contacts
          } catch (error) {
              console.error("Error fetching chatrooms:", error);
          }
      };

      fetchCurrentUser(); 
      fetchChatrooms(); 

  }, []);

    return (
        <div>
          <h2>Available Chatrooms</h2>
          <ul>
            {chatrooms.length > 0 ? (
              chatrooms.map((room) => (
                <li key={room.id}>
                  <Link to={`/chatroom/${room.id}`}>{room.name}</Link>
                </li>
              ))
            ) : (
              <p>No chatrooms available.</p>
            )}
          </ul>
        </div>
      );
    }
    

export default ChatList;