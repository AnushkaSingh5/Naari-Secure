async function verifyContacts() {
    const baseUrl = 'http://localhost:5000/api/auth';

    console.log('--- Testing Emergency Contacts Validation (Guardian Only) ---');

    // 3. Test Guardian Signup WITHOUT contacts (Should Pass)
    const guardian = {
        name: 'Guardian User',
        email: `guardian${Date.now()}@test.com`,
        password: 'password123',
        role: 'guardian'
    };

    try {
        console.log('\n3. Testing Guardian signup (No contacts needed)...');
        const res3 = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guardian)
        });
        const data3 = await res3.json();
        if (res3.status === 201) {
            console.log('PASS: Guardian signup successful');
        } else {
            console.error('FAIL: Guardian signup failed', res3.status, JSON.stringify(data3, null, 2));
        }
    } catch (e) { console.error('Error:', e); }
}

verifyContacts();
