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
let users = [];
let index2 = 0;

io.engine.generateId = (newId) =>{
    return index2++;
}

io.on("connection", (socket)=>{
    console.log(socket);
    socket.emit("id", socket.id);
    users.push(socket.id);

    socket.broadcast.emit("usersConnect", users);

    socket.on("disconnect", (offSocket)=>{
        console.log(offSocket);
    });

    socket.on("sendNewMessage", (newMessage)=>{
        messages.push(newMessage);
        socket.broadcast.emit("receivedANewMessage", newMessage);
    });

    socket.emit("allMessages", messages);
});

server.listen(process.env.PORT || 3000);