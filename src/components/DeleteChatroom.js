import React, { useState } from "react";
import apiClient from "../utils/apiClient"; 

const DeleteChatroom = () => {
    const [dmId, setDmId] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    
    const handleDeleteChatroom = async () => {
        if (!dmId) {
            setError("Please enter a valid dmId.");
            return;
        }

        setLoading(true);
        setError(null); 
        try {
            const response = await apiClient.delete(`/api/contacts/delete-dm/${dmId}`);

            if (response.status === 200) {
                setMessage("DM deleted successfully.");
            } else {
                setError("Failed to delete DM. Please try again.");
            }
        } catch (err) {
            console.error("Error deleting DM:", err);
            setError("An error occurred while deleting the DM. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Delete Direct Messages</h2>
            
            <input
                type="text"
                placeholder="Enter dmId"
                value={dmId}
                onChange={(e) => setDmId(e.target.value)} 
                disabled={loading}
            />
            <button onClick={handleDeleteChatroom} disabled={loading}>
                {loading ? "Deleting..." : "Delete Chatroom"}
            </button>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default DeleteChatroom;