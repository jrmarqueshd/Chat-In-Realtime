const socket = window.location.href == "http://localhost:3000" ? io("http://localhost:3000") : io();
const $btn = document.getElementById("btn");
const $usr = document.getElementById("username");
const $message = document.getElementById("message");
const $users = document.getElementById("users");

function renderMessage(author, message) {
    const $messageField = document.getElementById("messages");

    $messageField.insertAdjacentHTML("afterbegin", "<div><strong>" + author + "</strong>:" + message + "</div>");
}

socket.on("id", (socketId)=>{
    $usr.value = socketId;
});

socket.on("usersConnect", (users)=>{
    [].forEach.call(users, (each)=>{
        $users.innerText = each+", ";
    });
});

socket.on("allMessages", (messages) => {
    [].forEach.call(messages, (eachMessage) => {
        renderMessage(eachMessage.usr, eachMessage.message);
    });
});

socket.on("receivedANewMessage", (newMessage) => {
    renderMessage(newMessage.usr, newMessage.message);
});

$btn.addEventListener("click", (e) => {
    e.preventDefault();

    if ($usr.value.length && $message.value.length) {
        let messageObject = {
            usr: $usr.value,
            message: $message.value,
        }
        renderMessage(messageObject.usr, messageObject.message);

        socket.emit("sendNewMessage", messageObject);
    }
});