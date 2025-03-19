import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Auth from "./components/Auth";
import Chatroom from "./components/Chatroom";
import ChatList from "./components/ChatList";
import CreateChatroom from "./components/CreateChatroom";
import UserProfile from "./components/UserProfile";
import DeleteChatroom from "./components/DeleteChatroom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<ChatList />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/create" element={<CreateChatroom />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/delete" element={<DeleteChatroom />} />
      </Routes>
    </Router>
  )
  
}

export default App;
