import express from 'express';

const router = express.Router();
let adminToken = ''; // Store admin token in memory (use a database for production)

// Endpoint to register admin's FCM token
router.post('/register-token', (req, res) => {
    adminToken = req.body.token;
    res.status(200).json({ message: 'Admin token registered successfully!' });
});

// Endpoint to retrieve admin's FCM token
router.get('/get-token', (req, res) => {
    res.status(200).json({ token: adminToken });
});

export default router;