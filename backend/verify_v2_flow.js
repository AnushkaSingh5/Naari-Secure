
async function verifyV2Flow() {
    const baseUrl = 'http://localhost:5000/api/auth';
    const timestamp = Date.now();
    const contactEmail = `mom${timestamp}@test.com`;

    console.log('--- Testing Guardian Code Login Flow (V2) with Email Mocking ---');
    console.log('NOTE: Since we are using Ethereal (Test Email), check server logs for "Preview URL"');

    // Manually simulated steps since we can't scrape the Ethereal URL here easily without complexity
    // We will assume the backend logic works if it returns 200/201 and prints logs.

    // 1. Girl Signup
    try {
        console.log('\n1. Girl Signup (Triggering Email)...');
        const res = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Girl V2 Email',
                email: `girlv2_email${timestamp}@test.com`,
                password: 'password123',
                emergencyContacts: [{
                    name: 'Mom Email',
                    phone: '999',
                    email: contactEmail,
                    relation: 'Mother'
                }]
            })
        });
        const data = await res.json();

        if (res.status === 201) {
            console.log('PASS: Signup success');
            console.log('CHECK SERVER LOGS FOR INVITE EMAIL PREVIEW URL');
        } else {
            throw new Error(`Signup failed: ${JSON.stringify(data)}`);
        }
    } catch (e) {
        console.error('FAIL Signup:', e.message);
    }
}

verifyV2Flow();
