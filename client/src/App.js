import React from "react";
import Login from "./Components/Login/Login.js";
import { useStateValue } from "./Components/ContextApi/StateProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import TextBox from "../src/Components/SideBar/TextBox.js";
import Chat from "./Components/Chats/Chat.js";


const App = () => {
  const [{ user }] = useStateValue();
  return (
    <div className="app">
      {!user ?(
        <Login />
      ): ( 
        <div className="app_main">
        <Router>
            <TextBox />
            <Routes>
              <Route path="/" element={<Chat/>}></Route>
              <Route path="/room/:roomId" element={<Chat/>}></Route>
            </Routes>
          </Router>
        </div>
      )
      }
    </div>
  );
};

export default App;

