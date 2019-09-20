const socket = window.location.href == "http://localhost:3000" ? io("http://localhost:3000") : io();
const $btn = document.getElementById("btn");
const $usr = document.getElementById("username");
const $message = document.getElementById("message");
const $usrButton = document.getElementById("usrButton");
const $form = document.getElementById("form");
const $name = document.getElementById("name");

$usrButton.addEventListener("click", ()=>{
    if($usr.value.length){
        $usrButton.style.display = "none";
        $usr.style.display = "none";
        $form.classList.remove("-off");
        $name.innerText = $usr.value;
        let date = new Date();
        let momentConnect = {
            date: `${date.getDate()}/${date.getMonth()}`,
            hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
            usr: $usr.value
        }

        socket.emit("userName", momentConnect);
    }
});

function renderMessage(author, message) {
    const $messageField = document.getElementById("messages");

    $messageField.insertAdjacentHTML("afterbegin", "<div><strong>" + author + "</strong>: " + message + "</div>");
}

socket.on("allMessages", (messages) => {
    [].forEach.call(messages, (eachMessage) => {
        renderMessage(eachMessage.usr, eachMessage.message);
    });
});

socket.on("receivedANewMessage", (newMessage) => {
    renderMessage(`(${newMessage.hour}) ${newMessage.usr}`, newMessage.message);
});

socket.on("messageNewUser", (newUser)=>{
    renderMessage(`(${newUser.date}) ${newUser.hour} - ${newUser.usr}`, "Entrou.");
});

socket.on("leftUser", (userLeft)=>{
    renderMessage(`(${userLeft.date}) ${userLeft.hour} - ${userLeft.usr}`, "Saiu.");
});

function sendMessage(){
    if ($usr.value.length && $message.value.length) {
        let date = new Date();
        let messageObject = {
            hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,          
            usr: $usr.value,
            message: $message.value,
        }
        renderMessage(`(${messageObject.hour}) ${messageObject.usr}`, messageObject.message);

        socket.emit("sendNewMessage", messageObject);
    }
    $message.value = "";
}

$btn.addEventListener("click", (e) => {
    e.preventDefault();

    sendMessage();
});

window.addEventListener("keydown", (e)=>{
    if(e.key == "Enter"){
        sendMessage();
    }
});