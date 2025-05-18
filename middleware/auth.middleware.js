const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user in MySQL database
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = {
            userId: users[0].id,
            username: users[0].username
        };
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
}; 