let socket = new WebSocket("ws://localhost")

const listeners = {
    
    openListener: (e) => {
        const node = document.createElement("h4")
        node.innerHTML = `connected to server`
        messageContainer.appendChild(node)
    },

    messageListener: (e) => {
        const time = new Date(Date.now()).toLocaleTimeString()
        const node = document.createElement("p")
        const textNode = document.createTextNode(`${time}::server_message : ${e.data}`)    
        node.appendChild(textNode)
        messageContainer.appendChild(node)
    },

    closeListener: () => {
        const node = document.createElement("h4")
        node.innerHTML = `${time}::notification : server is offline`
        messageContainer.appendChild(node)
    }
}

const message = document.getElementById("message")
const messageContainer = document.getElementById("messages-container")
const sendButton = document.getElementById("send-message")
const disconnectButton = document.getElementById("disconnect-button")
const reconnectButton = document.getElementById("reconnect-button")

// initial state
socket.addEventListener("open", () => socket.send("connected"))
socket.onmessage = listeners.messageListener
socket.addEventListener("close", () => console.log("disconnected"))
/**
 * socket.addListener("open", () => socket.send("hallo i'm connected"))
 * this code do the same thing
 * 
 * socket.onopen = () => socket.send("i'm connected")
*/

reconnectButton.addEventListener("click", () => {
    socket = new WebSocket("ws://localhost")
    socket.onopen = listeners.openListener
    socket.onmessage = listeners.messageListener
    socket.onclose = listeners.closeListener
})

sendButton.addEventListener('click', () => {
    
    if (socket.readyState !== 1) {
        const node = document.createElement("h4")
        node.innerHTML = `client is not connected to server`
        messageContainer.appendChild(node)
        return;
    }

    const time = new Date(Date.now()).toLocaleTimeString()
    const node = document.createElement("p")
    node.innerHTML = `${time}::sent_message : ${message.value}`
    messageContainer.appendChild(node)
    socket.send(message.value)
})

disconnectButton.addEventListener("click", () => {
    socket.close()
    const time = new Date(Date.now()).toLocaleTimeString()
    const node = document.createElement("h4")
    node.innerHTML = `${time}::notification : disconnected from server`
    messageContainer.appendChild(node)
})
