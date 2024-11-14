require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const scheduleRoutes = require('./routes/schedule');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/schedule', scheduleRoutes);

// Webhook validation route for Facebook
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = '1'; // Should match the token in Meta's webhook settings
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Main route (use for testing, debugging, etc.)
app.get('/', (req, res) => {
    res.send('Webhook validated');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
