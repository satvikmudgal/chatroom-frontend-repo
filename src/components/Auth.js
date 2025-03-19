import React, { useState } from "react";
import apiClient from "../utils/apiClient";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
          let response;
          if (isLoggedIn) {

            response = await apiClient.post("/api/auth/login", { email, password });
            console.log("Login successful:", response.data);
            alert("Login successful!");
          }
          else {
            response = await apiClient.post("/api/auth/signup", { email, password });
            console.log("Signup successful:", response.data);
            alert("Signup successful! Please log in.");
          }
        }
        catch (error) {
            console.error(isLoggedIn ? "Login error:" : "Signup error:", error);
            alert("Login failed. Please check your credentials.");
        }
    };

    const toggleAuthMode = () => {
        setIsLoggedIn(!isLoggedIn);
    }

    return (
        <div>
          <h2>{isLoggedIn ? "Login" : "Signup"}</h2>
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
            <button type="submit">{isLoggedIn ? "Login" : "Signup"}</button>
          </form>
          <button onClick={toggleAuthMode}>
            {isLoggedIn ? "Switch to Signup" : "Switch to Login"}
          </button>
        </div>
      );

}

export default Auth;

