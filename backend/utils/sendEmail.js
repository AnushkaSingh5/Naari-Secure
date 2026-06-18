const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        let transporter;
        let info;
        let sentViaRealSmtp = false;

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                // Production/Dev with real credentials
                transporter = nodemailer.createTransport({
                    service: 'gmail', // or configured host/port
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });
                info = await transporter.sendMail({
                    from: `"NaariSecure" <${process.env.EMAIL_USER}>`,
                    to,
                    subject,
                    html
                });
                console.log(`Email sent successfully via Gmail: ${info.messageId}`);
                sentViaRealSmtp = true;
            } catch (smtpError) {
                console.error(`Gmail SMTP send failed: ${smtpError.message}. Falling back to Ethereal...`);
            }
        }

        if (!sentViaRealSmtp) {
            // Test Account (Ethereal fallback)
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
            console.log('--- EMAIL SERVICE (TEST MOCK FALLBACK) ---');
            
            info = await transporter.sendMail({
                from: '"NaariSecure" <no-reply@naarisecure.com>',
                to,
                subject,
                html
            });

            console.log(`Email sent via Ethereal fallback: ${info.messageId}`);
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }

        return info;
    } catch (error) {
        console.error('Email send failed completely:', error);
        // Don't throw error to prevent blocking auth flow, just log it
    }
};

module.exports = sendEmail;
