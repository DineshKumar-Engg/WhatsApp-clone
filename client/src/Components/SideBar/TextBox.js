import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../ContextApi/StateProvider";
import { DonutLarge,Chat,MoreVert, SearchOutlined} from "@mui/icons-material";
import './TextBox.css'
import SideBarChats from "../SideBarChats.js/SideBarChats";
import axios from "axios"
import Pusher from "pusher-js"


const TextBox = () => {
  const [{user}] = useStateValue();
  const [rooms,setRooms] =useState([])

  useEffect(()=>{
    axios.get("https://whatsappclone-project.herokuapp.com/all/rooms").then((response)=>{
      setRooms(response.data)
    })
  },[])
  
  useEffect(()=>{
    const pusher = new Pusher('92922959425edccead09', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe("room");
    channel.bind("inserted", function(room) {
     setRooms((prevRooms)=>[...prevRooms,room])
     
    });
  },[])


  return (
    <div className="text_main">
      <div className="text_header">
        <Avatar src={user.photoURL} />
        <div className="text_components">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
        </div>
        <div className="text_search">
        <div className="text_searchField">
        <SearchOutlined/>
        <input placeholder="Search..." ></input>
        </div>
        </div>
        <div className="text_result">
          <SideBarChats addNewChat/>
          {rooms.map((room,index)=>(
            <SideBarChats key={index} id={room._id} name={room.name} />
          ))}
        </div>
    </div>
  );
};

export default TextBox;
