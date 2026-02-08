
async function verifyInviteFlow() {
    const baseUrl = 'http://localhost:5000/api';
    const timestamp = Date.now();

    console.log('--- Testing Guardian Invite Flow ---');

    // 1. Girl Signup
    console.log('\n1. Signing up Girl...');
    let inviteCode = '';
    let girlToken = '';

    try {
        const girlRes = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Girl User',
                email: `girl${timestamp}@test.com`,
                password: 'password123',
                role: 'girl',
                emergencyContacts: [{ name: 'Mom', phone: '123' }]
            })
        });
        const girlData = await girlRes.json();

        if (girlRes.status === 201) {
            console.log('PASS: Girl signup successful');
            girlToken = girlData.token;

            // Fetch profile to get invite code
            const meRes = await fetch(`${baseUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${girlToken}` }
            });
            const meData = await meRes.json();
            inviteCode = meData.emergencyContacts[0].inviteCode;
            console.log(`PASS: Invite Code retrieved: ${inviteCode}`);
        } else {
            throw new Error(`Girl signup failed: ${JSON.stringify(girlData)}`);
        }

        // 2. Guardian Signup
        console.log('\n2. Signing up Guardian...');
        let guardianToken = '';

        const guardianRes = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Guardian User',
                email: `guardian${timestamp}@test.com`,
                password: 'password123',
                role: 'guardian'
            })
        });
        const guardianData = await guardianRes.json();
        if (guardianRes.status === 201) {
            console.log('PASS: Guardian signup successful');
            guardianToken = guardianData.token;
        } else {
            throw new Error(`Guardian signup failed: ${JSON.stringify(guardianData)}`);
        }

        // 3. Accept Invite
        console.log('\n3. Guardian Accepting Invite...');
        const acceptRes = await fetch(`${baseUrl}/guardian/accept-invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${guardianToken}`
            },
            body: JSON.stringify({ inviteCode })
        });
        const acceptData = await acceptRes.json();

        if (acceptRes.status === 200) {
            console.log('PASS: Invite accepted successfully');
            console.log(`Linked to: ${acceptData.linkedUser}`);
        } else {
            throw new Error(`Accept invite failed: ${JSON.stringify(acceptData)}`);
        }

    } catch (e) {
        console.error('FAIL:', e.message);
    }
}

verifyInviteFlow();
