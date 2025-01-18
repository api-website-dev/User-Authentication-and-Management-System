import nodemailer from 'nodemailer';

export const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
    try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // Use true for port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
                connectionTimeout: 10000, // 10 seconds timeout
            },
        });
        // Verify SMTP configuration
        await transporter.verify();
        console.log('SMTP is ready to send emails');
        // Options for sending email
        const options = {
            from: sent_from,
            to: send_to,
            replyTo: reply_to,
            subject: subject,
            html: message,
        };
        // Send email
        const info = await transporter.sendMail(options);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
        throw error; // Re-throw error for the caller to handle
    }
};