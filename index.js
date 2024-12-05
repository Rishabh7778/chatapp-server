const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const userRoutes = require("./Routes/userRoute");
const messageRoute = require("./Routes/messagesRoute");
const app = express();
const socket = require('socket.io');
require("dotenv").config();


app.use(express.json()); 
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.error("MongoDB connection error:", error));


    
const server = app.listen(process.env.PORT, () => {
    console.log(`Server Listening on port ${process.env.PORT}`);
})


const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        Credential: true,
    },
})

global.onlineUsers = new Map();

io.on("connection", (socket)=> {
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            // Send the entire message data, not just data.msg
            socket.to(sendUserSocket).emit("msg-recieve", {
                fromSelf: false, // For the receiver, this should be false
                message: data.msg,
            });
        }
    });
    
})