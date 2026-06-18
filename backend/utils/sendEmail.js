const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        let info;
        
        // 1. Try Resend API (HTTP port 443 - Never blocked by Render/Vercel)
        if (process.env.RESEND_API_KEY) {
            try {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'NaariSecure <onboarding@resend.dev>', // Default sender for Resend free accounts
                        to: to,
                        subject: subject,
                        html: html
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(`Email sent successfully via Resend API: ${data.id}`);
                    return data;
                } else {
                    const errorText = await res.text();
                    console.error(`Resend API response error: ${res.status} - ${errorText}`);
                }
            } catch (resendError) {
                console.error(`Resend API send failed: ${resendError.message}. Trying Gmail SMTP...`);
            }
        }

        let sentViaRealSmtp = false;

        // 2. Try Gmail SMTP (Will work locally but blocked on Render free tier)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
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
                return info;
            } catch (smtpError) {
                console.error(`Gmail SMTP send failed: ${smtpError.message}. Falling back to Ethereal...`);
            }
        }

        // 3. Fallback to Ethereal (Mock test account)
        if (!sentViaRealSmtp) {
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
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
            return info;
        }

    } catch (error) {
        console.error('Email send failed completely:', error);
    }
};

module.exports = sendEmail;
