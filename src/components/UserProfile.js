import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [color, setColor] = useState("#000000");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await apiClient.get("/api/auth/userinfo");
                console.log("User profile response:", response.data);
                if (response.data) {
                    setUser(response.data);
                    setFirstName(response.data.firstName || "");
                    setLastName(response.data.lastName || "");
                    setColor(response.data.color || "#000000");
                } else {
                    setError({ message: "User profile not found." });
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await apiClient.post("/api/auth/update-profile", {
                firstName,
                lastName,
                color,
            });

            if (response.status === 200) {
                setMessage("Profile updated successfully!");
                setUser((prevUser) => ({
                    ...prevUser,
                    firstName,
                    lastName,
                    color,
                    profileSetup: true, // Assuming that the user has updated their profile
                }));
                setIsEditing(false);
            } else {
                setMessage("Error updating profile. Please try again.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage("Error updating profile. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading user profile...</div>;
    }

    if (error) {
        return <div>Error loading user profile: {error.message}</div>;
    }

    if (!user) {
        return <div>No user profile found.</div>;
    }

    return (
        <div>
            <h2>{user.email}</h2>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Profile Setup:</strong> {user.profileSetup ? 'Yes' : 'No'}</p>
            {message && <p>{message}</p>}

            {isEditing ? (
                <form onSubmit={handleProfileUpdate}>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Profile Color:</label>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    <button type="submit">Save Profile</button>
                </form>
            ) : (
                <div>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Profile Color:</strong> <span style={{ color }}>●</span></p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
}

export default UserProfile;