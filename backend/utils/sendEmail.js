const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    try {
        let info;
        let sentViaApi = false;

        // 1. Try Brevo API (HTTP port 443 - Never blocked by Render/Vercel)
        if (process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL) {
            try {
                const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': process.env.BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'NaariSecure',
                            email: process.env.BREVO_SENDER_EMAIL
                        },
                        to: [{ email: to }],
                        subject: subject,
                        htmlContent: html
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(`Email sent successfully via Brevo API: ${data.messageId || JSON.stringify(data)}`);
                    sentViaApi = true;
                    return data;
                } else {
                    const errorText = await res.text();
                    console.error(`Brevo API response error: ${res.status} - ${errorText}. Trying next fallback...`);
                }
            } catch (brevoError) {
                console.error(`Brevo API send failed: ${brevoError.message}. Trying next fallback...`);
            }
        }
        
        // 2. Try Resend API (HTTP port 443 - Never blocked by Render/Vercel)
        if (!sentViaApi && process.env.RESEND_API_KEY) {
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
                    sentViaApi = true;
                    return data;
                } else {
                    const errorText = await res.text();
                    console.error(`Resend API response error: ${res.status} - ${errorText}. Falling back to Gmail SMTP...`);
                }
            } catch (resendError) {
                console.error(`Resend API send failed: ${resendError.message}. Falling back to Gmail SMTP...`);
            }
        }

        let sentViaRealSmtp = false;

        // 3. Try Gmail SMTP (Will work locally but blocked on Render free tier)
        if (!sentViaApi && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    connectionTimeout: 5000, // 5 seconds
                    greetingTimeout: 5000,
                    socketTimeout: 5000,
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

        // 4. Fallback to Ethereal (Mock test account)
        if (!sentViaApi && !sentViaRealSmtp) {
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                connectionTimeout: 5000, // 5 seconds
                greetingTimeout: 5000,
                socketTimeout: 5000,
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
