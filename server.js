const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db.config');

// Route imports
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

// Middleware imports
const { authenticateToken } = require('./middleware/auth.middleware');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'home')));
app.use(express.static(path.join(__dirname, 'login')));
app.use(express.static(path.join(__dirname, 'loan')));
app.use(express.static(path.join(__dirname, 'kyc')));
app.use(express.static(path.join(__dirname, 'chatbot')));
app.use(express.static(path.join(__dirname, 'Loan_Model')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (message) => {
        // Handle incoming messages
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = parseInt(process.env.PORT) || 5000;

// Function to find an available port
function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const testServer = http.createServer();
        testServer.listen(startPort, () => {
            const port = testServer.address().port;
            testServer.close(() => resolve(port));
        });
        testServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort(startPort + 1)
                    .then(resolve)
                    .catch(reject);
            } else {
                reject(err);
            }
        });
    });
}

// Start server with port handling
findAvailablePort(PORT)
    .then(port => {
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
