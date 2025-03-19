import React from "react";
import { Link } from "react-router-dom";

function NavigationBar() {
    return (
        <nav style={{ display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#333", color: "#fff" }}>
            <Link to="/" style={{ color: "white"}}>Chatrooms</Link>
            <Link to="/login" style={{ color: "white"}}>Login</Link>
            <Link to="/create" style={{ color: "white"}}>Create Chatroom</Link>
            <Link to="/profile" style={{ color: "white"}}>Profile</Link>
            <Link to="/delete" style={{ color: "white"}}>Delete Chatroom</Link>
        </nav>
    );
}

export default NavigationBar;