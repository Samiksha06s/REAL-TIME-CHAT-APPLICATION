const socket = new WebSocket('ws://localhost:4000'); // WebSocket URL
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const replyingToDiv = document.getElementById('replyingTo');

let replyingToMessage = null; // Keeps track of the message being replied to

// Handle incoming WebSocket messages
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const message = data.message;
    const messageId = data.id;
    const replyTo = data.replyTo;

    // Display the message
    displayMessage(message, messageId, replyTo);
};

// Send message when 'Send' button is clicked
sendButton.onclick = function() {
    const message = messageInput.value;
    if (message.trim() !== "") {
        const data = {
            message: message,
            replyTo: replyingToMessage ? replyingToMessage.id : null // Attach the replyTo ID if replying
        };
        socket.send(JSON.stringify(data));  // Send message to WebSocket server
        messageInput.value = "";  // Clear the input field
        replyingToMessage = null;  // Reset the reply-to message
        replyingToDiv.textContent = '';  // Clear the "Replying to" text
    }
};

// Function to display message
function displayMessage(message, messageId, replyTo) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.dataset.id = messageId;

    if (replyTo) {
        const replyToElement = document.createElement('div');
        replyToElement.classList.add('message', 'reply-to');
        replyToElement.textContent = `Replying to: ${replyTo}`;
        messageElement.appendChild(replyToElement);
    }

    messageElement.textContent = message;
    messageElement.onclick = () => setReplyTo(messageId, message);

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll to the bottom
}

// Function to set the message as "replying to"
function setReplyTo(messageId, message) {
    replyingToMessage = { id: messageId, message: message };
    replyingToDiv.textContent = `Replying to: ${message}`;
}
