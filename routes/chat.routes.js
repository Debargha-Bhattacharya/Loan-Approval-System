const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

router.post('/message', async (req, res) => {
    try {
        const { content, is_bot } = req.body;
        const userId = req.user.userId; // From JWT token

        const [result] = await db.query(
            'INSERT INTO chat_messages (user_id, message, is_bot) VALUES (?, ?, ?)',
            [userId, content, is_bot]
        );

        res.status(201).json({
            id: result.insertId,
            user_id: userId,
            message: content,
            is_bot,
            created_at: new Date()
        });
    } catch (error) {
        console.error('Message save error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/history', async (req, res) => {
    try {
        const userId = req.user.userId; // From JWT token

        const [messages] = await db.query(
            'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        res.json(messages);
    } catch (error) {
        console.error('Message history error:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 