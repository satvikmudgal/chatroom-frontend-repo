import React, { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
        setAuthToken(token);
      }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
          let response;
          if (isSignedUp) {
              // Signup
              response = await apiClient.post("/api/auth/signup", { email, password });
              console.log("Signup successful:", response.data);
              setIsSignedUp(false); // Switch to login mode after signup
              alert("Signup successful! Please log in.");
          } else {
              // Login
              response = await apiClient.post("/api/auth/login", { email, password });
              console.log("Login successful:", response.data);
              setIsLoggedIn(true);
              localStorage.setItem("authToken", response.data.token);
              alert("Login successful!");
          }
      } catch (error) {
          console.error(isSignedUp ? "Signup error:" : "Login error:", error);
          alert("Authentication failed. Please check your credentials.");
      }
    };

    const handleLogout = async () => {
      try {
        await apiClient.post("/api/auth/logout");
        console.log("Logout successful");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setAuthToken(null);
        alert("Logout successful!");
      } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
      }
    };

    const toggleAuthMode = () => {
        setIsSignedUp(!isSignedUp);
    }

    return (
      <div>
          {isLoggedIn ? (
              <>
                  <h2>Welcome! You are logged in</h2>
                  <button onClick={handleLogout}>Logout</button>
              </>
          ) : (
              <>
                  <h2>{isSignedUp ? "Signup" : "Login"}</h2>
                  <form onSubmit={handleLogin}>
                      <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                      <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                      <button type="submit">{isSignedUp ? "Signup" : "Login"}</button>
                  </form>
                  <button onClick={toggleAuthMode}>
                      {isSignedUp ? "Switch to Login" : "Switch to Signup"}
                  </button>
              </>
          )}
      </div>
  );

}

export default Auth;

