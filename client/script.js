const socket = io();

// DOM Elements
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-button');
const userList = document.getElementById('user-list');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');

let username;

// Login user
loginButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('login', username);
        loginContainer.classList.add('hidden'); // Hide login container
        chatContainer.classList.remove('hidden'); // Show chat container
    }
});


// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('send-message', message);
        messageInput.value = '';
    }
});

// Typing indicator
messageInput.addEventListener('input', () => {
    const status = messageInput.value.trim() ? true : false;
    socket.emit('typing', status);
});

// Handle incoming messages
socket.on('receive-message', ({ username, message }) => {
    const li = document.createElement('li');
    li.textContent = `${username}: ${message}`;
    messageList.appendChild(li);
});

// Update online users
socket.on('update-users', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});

// Show typing indicator
socket.on('typing', ({ username, status }) => {
    typingIndicator.textContent = status ? `${username} is typing...` : '';
});