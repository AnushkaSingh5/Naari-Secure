const baseUrl = 'http://localhost:5000/api/auth';
const timestamp = Date.now();

async function testDeleteFlow() {
    console.log('--- Testing Contact Addition and Deletion Flow ---');

    try {
        // 1. Sign up a Girl
        console.log('1. Signing up Girl...');
        const signupRes = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Delete Test Girl',
                email: `girl_del_${timestamp}@test.com`,
                password: 'password123',
                role: 'girl',
                emergencyContacts: [{
                    name: 'Temp Guardian',
                    phone: '1234567890',
                    email: `guardian_del_${timestamp}@test.com`,
                    relation: 'Friend'
                }]
            })
        });

        const signupData = await signupRes.json();
        console.log(`Signup Status: ${signupRes.status}`);
        if (signupRes.status !== 201) {
            console.error('Signup Failed:', signupData);
            return;
        }

        const token = signupData.token;

        // 2. Fetch User Profile to get contact ID and inviteCode
        console.log('\n2. Fetching profile to check contact...');
        const meRes = await fetch(`${baseUrl}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        console.log(`Profile Fetch Status: ${meRes.status}`);

        const contact = meData.emergencyContacts[0];
        console.log(`Contact ID: ${contact._id}`);
        console.log(`Contact Invite Code: ${contact.inviteCode}`);

        if (!contact.inviteCode) {
            console.error('FAIL: Contact does not have an inviteCode!');
            return;
        } else {
            console.log('PASS: Contact has inviteCode!');
        }

        // 3. Delete the contact
        console.log(`\n3. Deleting contact with ID: ${contact._id}...`);
        const delRes = await fetch(`${baseUrl}/delete-contact/${contact._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const delData = await delRes.json();
        console.log(`Delete Status: ${delRes.status}`);
        if (delRes.status === 200) {
            console.log('PASS: Contact deleted successfully without server crash');
            console.log(`Remaining contacts count: ${delData.length}`);
        } else {
            console.error('FAIL: Delete failed:', delData);
        }

    } catch (err) {
        console.error('CRITICAL ERROR:', err.message);
    }
}

// Delay 3s to let server bind to port
setTimeout(testDeleteFlow, 3000);
