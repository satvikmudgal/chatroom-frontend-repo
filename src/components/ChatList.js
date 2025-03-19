import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

function ChatList() {
    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        apiClient.get("/api/contacts/all-contacts")
            .then((res) => setChatrooms(res.data.contacts))
            .catch((err) => console.error("Error fetching chatrooms:", err));
    }
    , []);

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