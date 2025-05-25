import express from 'express';

const router = express.Router();
let adminToken = ''; // Store admin token in memory (use a database for production)

// Endpoint to register admin's FCM token
router.post('/register-token', (req, res) => {
    try {
        adminToken = req.body.token;
        res.status(200).json({ message: 'Admin token registered successfully!' });
    } catch (error) {
        console.error('Error registering token:', error);
        res.status(500).json({ error: 'Failed to register token' });
    }
});

// Endpoint to retrieve admin's FCM token
router.get('/get-token', (req, res) => {
    res.status(200).json({ token: adminToken });
});

export default router;