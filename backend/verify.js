// Using global fetch (Node 18+)
// If node < 18, this fails. I'll assume Node 18+ or use http.
// Actually, safely I'll use http or just assume fetch is available if I'm on recent node.
// Let's use standard http to be safe or just assume fetch exists.
// The user has Windows. Node version is likely recent.
// I'll try to use the built-in fetch.

async function verify() {
    const baseUrl = 'http://localhost:5000/api/auth';
    const user = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'girl'
    };

    console.log('1. Testing Signup...');
    try {
        const signupRes = await fetch(`${baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const signupData = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        if (signupRes.status !== 201) {
            console.error('Signup Failed:', signupData);
            return;
        }
        console.log('Signup Success, Token received:', !!signupData.token);

        // Store token
        const token = signupData.token;

        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        if (loginRes.status !== 200) {
            console.error('Login Failed:', loginData);
            return;
        }
        console.log('Login Success, Token received:', !!loginData.token);

        console.log('\n3. Testing Protected Route (with token)...');
        const meRes = await fetch(`${baseUrl}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meData = await meRes.json();
        console.log('Protected Route Status:', meRes.status);
        if (meRes.status !== 200) {
            console.error('Protected Route Failed:', meData);
        } else {
            console.log('Protected Route Success, User:', meData.email);
        }

        console.log('\n4. Testing Protected Route (without token)...');
        const failRes = await fetch(`${baseUrl}/me`);
        console.log('Protected Route (No Token) Status:', failRes.status);
        if (failRes.status === 401) {
            console.log('Protected Route Correctly Denied Access');
        } else {
            console.error('Protected Route INCORRECTLY Allowed Access or failed with other error');
        }

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
    console.error('Fetch API not available. Please inspect manually.');
} else {
    // Wait for server to start (simple 5s delay)
    setTimeout(verify, 5000);
}
