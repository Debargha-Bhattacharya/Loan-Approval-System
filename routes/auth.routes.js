const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
require('dotenv').config();

// Register User
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: "Error registering user", error: err });
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching user" });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    });
});

// Verify Customer ID before password reset
router.post('/verify', (req, res) => {
    const { customerId } = req.body;

    if (!customerId) {
        return res.status(400).json({ message: "Customer ID is required." });
    }

    db.query('SELECT id FROM users WHERE customer_id = ?', [customerId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid Customer ID" });
        }

        res.status(200).json({ message: "Customer ID verified" });
    });
});

module.exports = router;
