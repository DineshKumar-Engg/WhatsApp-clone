const express = require("express");
const mongoose =require("mongoose");
const Rooms = require('./DbRoom');
const cors =require("cors");
const Messages = require('./dbMessages');
const Pusher = require("pusher");
require('dotenv').config();


const app =express();
app.use(cors());
app.use(express.json())

const pusher = new Pusher({
    appId: "1491622",
    key: "92922959425edccead09",
    secret: "fca6afb89c1ab8a27746",
    cluster: "ap2",
    useTLS: true
  });

//mongodb+srv://Dinesh:dinesh@mern.umdox7j.mongodb.net/test
//mongodb+srv://Dinesh:dinesh@webapp.udtnsnu.mongodb.net/whatsappclone?retryWrites=true&w=majority
const dbURL = "mongodb+srv://Dinesh:dinesh@mern.umdox7j.mongodb.net/mern-whatsapp-clone?retryWrites=true&w=majority";
mongoose.connect(dbURL)
const db= mongoose.connection;
db.once("open",()=>{
    console.log("db connected");

    const roomCollection=db.collection("rooms");
    const changeStream =roomCollection.watch();

    changeStream.on("change",(change)=>{
        if(change.operationType === "insert")
       {
        const roomDetails =change.fullDocument;
        pusher.trigger("room","inserted",roomDetails)
       }
        else{
            console.log("not room");
        }
    })

    const msgCollection=db.collection("messages");
    const msgChangeStream =msgCollection.watch();

    msgChangeStream.on("change",(change)=>{
        if(change.operationType === "insert")
       {
        const messageDetails =change.fullDocument;
        pusher.trigger("messages","inserted",messageDetails)
       }
        else{
            console.log("not messages");
        }
    })
})

app.get('/room/:id',(req,res)=>{
    Rooms.find({_id:req.params.id},(err,data)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(201).send(data[0])
        }
    })
})

app.get('/messages/:id',(req,res)=>{
    Messages.find({roomId:req.params.id},(err,data)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(201).send(data)
        }
    })
})



app.post('/message/new',(req,res)=>{
    const dbMessage =req.body;
    Messages.create((dbMessage),(err,data)=>{
        if(err){
            return res.status(500).send(err)
        }else{
            return res.status(201).send(data)
        }
    })
})

app.post('/group/create',(req,res)=>{
    const name = req.body.groupName;
    Rooms.create({name},(err,data)=>{
        if(err){
           return res.status(500).send(err)
        }else{
            return res.status(201).send(data)
        }
    });
});

app.get('/all/rooms',(req,res)=>{
   
    Rooms.find({},(err,data)=>{
        if(err){
           return res.status(500).send(err)
        }else{
            return res.status(201).send(data)
        }
    });
});

app.listen(process.env.PORT || 4000,()=>{
    console.log("server is live");
})
