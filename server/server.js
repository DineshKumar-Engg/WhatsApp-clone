const express = require("express");
const mongoose =require("mongoose");
const Rooms = require('./DbRoom.js');
const cors =require("cors");
const Messages = require('./dbMessages.js');
const Pusher = require("pusher");
const dotenv = require('dotenv')
dotenv.config()
//

const app =express();
app.use(cors({origin:["http://localhost:4000","https://whatsapp-clone.onrender.com"]}));
app.use(express.json())

const pusher = new Pusher({
    appId: "1491622",
    key: "92922959425edccead09",
    secret: "fca6afb89c1ab8a27746",
    cluster: "ap2",
    useTLS: true
  });

const dbURL = process.env.MONGODB_URL

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

app.get('/room/:id',async(req,res)=>{
Rooms.find({_id:req.params.id},(err,data)=>{
    if(err){
        return res.status(500).send({message:"room id",err})
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

app.listen(4000,()=>{
    console.log("server is live");
})
