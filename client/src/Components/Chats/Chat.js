import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import {
  SearchOutlined,
  AttachFile,
  MoreVert,
  InsertEmoticon,
} from "@mui/icons-material";
import "./Chat.css";
import axios from "axios";
import { useStateValue } from "../ContextApi/StateProvider";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";


const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [messages, setMessages] = useState([]);

  const [{ user }] = useStateValue();
  const { roomId } = useParams();


  useEffect(() => {
    if (roomId) {
      axios.get(`${process.env.REACT_APP_BASEURL}/room/${roomId}`)
      .then((response) => {
        setRoomName(response.data.name);
        setUpdatedAt(response.data.updatedAt);
      }).catch((err)=>{
        console.log("roomid",err);
      });
      axios.get(`${process.env.REACT_APP_BASEURL}/messages/${roomId}`).then((response) => {
        setMessages(response.data);
      });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(()=>{
    const pusher = new Pusher('92922959425edccead09', {
      cluster: 'ap2'
    });
    
    const channel = pusher.subscribe("messages");//------------->>>> ss
    channel.bind("inserted", function(message) {
      setMessages((prevMessages)=>[...prevMessages,message])
    });
  },[])



  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input) {
      return;
    } else {
      await axios.post(`${process.env.REACT_APP_BASEURL}/message/new`, {
        message: input,
        name: user.displayName,
        timestamp: new Date(),
        uid: user.uid,
        roomId: roomId,
      });
    }
    setInput("")
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName ? roomName : "welcome to whatsApp"}</h3>
          <p>
            {updatedAt
              ? `Last updated at ${new Date(updatedAt).toString().slice(0, 25)}`
              : "Any group"
              }
          </p>
        </div>
        <div className="chat_tab">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {
        messages.map((message, index) => (
          <p
            className={`chat_message ${
              message.uid === user.uid && "chat_receiver"
            } `}
            key={index}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">
              {new Date(message.timestamp).toString().slice(0, 25)}
            </span>
          </p>
        ))}
      </div>

    {roomName && <div className="chat_footer">
      <InsertEmoticon />
      <form>
        <input
          placeholder="type message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <button onClick={sendMessage}>Send a message</button>
      </form>
    </div>}
    </div>
  );
};

export default Chat;
