const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 4000;

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('A user connected');
    
    // Send a message to the client
    ws.send('Welcome to the chat!');

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Handle when a client disconnects
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

// Upgrade HTTP server to WebSocket server
app.server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle WebSocket upgrade requests
app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
