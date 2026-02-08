const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        let transporter;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            // Production/Dev with real credentials
            transporter = nodemailer.createTransport({
                service: 'gmail', // or configured host/port
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        } else {
            // Test Account (Etheral)
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log('--- EMAIL SERVICE (TEST MOCK) ---');
        }

        const info = await transporter.sendMail({
            from: '"NaariSecure" <no-reply@naarisecure.com>',
            to,
            subject,
            html
        });

        console.log(`Email sent: ${info.messageId}`);

        // If testing, log the preview URL
        if (!process.env.EMAIL_USER) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return info;
    } catch (error) {
        console.error('Email send failed:', error);
        // Don't throw error to prevent blocking auth flow, just log it
    }
};

module.exports = sendEmail;
