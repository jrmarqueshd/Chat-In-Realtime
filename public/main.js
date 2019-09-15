const socket = window.location.href == "http://localhost:3000" ? io("http://localhost:3000") : io();

function renderMessage(author, message) {
    const $messageField = document.getElementById("messages");

    $messageField.insertAdjacentHTML("afterbegin", "<div><strong>" + author + "</strong>:" + message + "</div>");
}

socket.on("allMessages", (messages) => {
    [].forEach.call(messages, (eachMessage) => {
        renderMessage(eachMessage.usr, eachMessage.message);
    });
});

socket.on("receivedANewMessage", (newMessage) => {
    renderMessage(newMessage.usr, newMessage.message);
});

const $btn = document.getElementById("btn");

$btn.addEventListener("click", (e) => {
    e.preventDefault();

    const $usr = document.getElementById("username");
    const $message = document.getElementById("message");

    if ($usr.value.length && $message.value.length) {
        let messageObject = {
            usr: $usr.value,
            message: $message.value,
        }
        renderMessage(messageObject.usr, messageObject.message);

        socket.emit("sendNewMessage", messageObject);
    }
});