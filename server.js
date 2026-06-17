const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || EMAIL_USER;

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple API endpoint for the contact form
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
    }

    console.log(`Received contact form submission from ${name} (${email}): ${message}`);

    if (!EMAIL_USER || !EMAIL_PASS) {
        return res.status(500).json({
            success: false,
            message: 'Email service is not configured. Set EMAIL_USER and EMAIL_PASS in your environment.'
        });
    }

    const mailOptions = {
        from: `"Portfolio Contact" <${EMAIL_USER}>`,
        to: EMAIL_TO,
        subject: `Portfolio Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        replyTo: email
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email. Check server logs for details.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
