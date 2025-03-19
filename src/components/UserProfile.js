import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await apiClient.get("/api/auth/userinfo");
                console.log("User profile response:", response.data);
                if (response.data) {
                    setUser(response.data);
                }
                else {
                    setError({message: "User profile not found."});
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
            <p>User ID: {user.id}</p>
            <p>Profile Setup: {user.profileSetup ? 'Yes' : 'No'}</p>
        </div>
    );
}

export default UserProfile;