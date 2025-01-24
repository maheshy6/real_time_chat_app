const express = require('express'); // Web framework
const http = require('http');      // Create HTTP server
const { Server } = require('socket.io'); // Import Socket.io

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // Store online users

// Serve static files for the client
app.use(express.static('./client'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user login
    socket.on('login', (username) => {
        users[socket.id] = username; // Save the username with the socket ID
        io.emit('update-users', Object.values(users)); // Send updated user list to everyone
        console.log(`${username} logged in.`);
    });

    // Handle message sending
    socket.on('send-message', (message) => {
        const username = users[socket.id]; // Get the sender's username
        io.emit('receive-message', { username, message }); // Broadcast the message
    });

    // Handle typing indicator
    socket.on('typing', (status) => {
        const username = users[socket.id];
        socket.broadcast.emit('typing', { username, status }); // Notify others
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id]; // Remove the user
        io.emit('update-users', Object.values(users)); // Update the user list
        console.log(`${username} disconnected.`);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});