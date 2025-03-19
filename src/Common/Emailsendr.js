const nodemailer = require('nodemailer');

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'santoshkumarsharmabagda@gmail.com',  // Your email
        pass: 'ihqt onaj jspt ahgq',      // Your app password (not your email password)
    },
});

// Common function to send emails
const sendEmail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: 'santoshkumarsharmabagda@gmail.com',
            to: to,                     // List of recipients
            subject: subject,           // Subject line
            text: text,                 // Plain text body
            html: html || text,         // HTML body (optional)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Example usage
module.exports = sendEmail;

