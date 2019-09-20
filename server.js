require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res)=>{
    res.render("index.html");
});

let messages = [];

io.on("connection", (socket)=>{
    console.log(socket.id);

    socket.on("userName", (momentConnect)=>{
        socket.username = momentConnect.usr;

        socket.broadcast.emit("messageNewUser", momentConnect);

        socket.on("disconnect", (offSocket)=>{
            console.log(offSocket);
            socket.broadcast.emit("leftUser", momentConnect);
        });
    
        socket.on("sendNewMessage", (newMessage)=>{
            messages.push(newMessage);
            socket.broadcast.emit("receivedANewMessage", newMessage);
        });
    });

    console.log(messages);

    socket.emit("allMessages", messages);
});

server.listen(process.env.PORT || 3000);