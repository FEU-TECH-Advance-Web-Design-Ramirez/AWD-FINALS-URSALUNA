// Base API URL
const API_BASE_URL = 'https://demo-api-skills.vercel.app/api/LanguageLearner';

// Get the base URL for redirections
const BASE_URL = window.location.href.split('/pages/')[0];

async function login(email, password) {
    try {
        // Verify if user exists and check password
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // If credentials match, redirect based on role
            if (user.role === 'admin') {
                window.location.href = BASE_URL + '/pages/admin-home-page/index.html';
            } else {
                window.location.href = BASE_URL + '/pages/home-page/index.html';
            }
        } else {
            alert('Invalid email or password. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login error: ' + error.message + '. Please try again.');
    }
}

async function register(email, password, name, isAdmin = false) {
    try {
        // First check if user already exists
        const checkResponse = await fetch(`${API_BASE_URL}/users`);
        const existingUsers = await checkResponse.json();
        
        if (existingUsers.some(user => user.email === email)) {
            alert('Email already registered. Please use a different email.');
            return;
        }

        // Create new user with specified role
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: crypto.randomUUID(),
                email: email,
                name: name,
                role: isAdmin ? 'admin' : 'learner',
                password: password
            })
        });

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = BASE_URL + '/pages/login-page/index.html';
        } else {
            throw new Error('Failed to create account');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration error: ' + error.message + '. Please try again.');
    }
}

// Function to handle logout
async function logout() {
    try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            // Call API to invalidate session
            const response = await fetch(`${API_BASE_URL}/sessions/${sessionToken}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to invalidate session');
            }
        }

        // Clear session token
        localStorage.removeItem('sessionToken');
        
        // Redirect to login page
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/pages/'));
        window.location.href = baseUrl + '/pages/login-page/index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Still redirect to login page even if session invalidation fails
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/pages/'));
        window.location.href = baseUrl + '/pages/login-page/index.html';
    }
}

// Function to check if user is logged in
async function checkAuth() {
    const sessionToken = localStorage.getItem('sessionToken');
    const isLoginPage = window.location.pathname.includes('login-page');
    const isSignUpPage = window.location.pathname.includes('sign-up-page');
    const isLandingPage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

    if (!sessionToken) {
        if (!isLoginPage && !isSignUpPage && !isLandingPage) {
            // If no session and trying to access protected page, redirect to login
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/pages/'));
            window.location.href = baseUrl + '/pages/login-page/index.html';
        }
        return;
    }

    try {
        // Verify session with API
        const response = await fetch(`${API_BASE_URL}/sessions/${sessionToken}`);
        if (!response.ok) {
            // Invalid or expired session
            localStorage.removeItem('sessionToken');
            if (!isLoginPage && !isSignUpPage && !isLandingPage) {
                const currentUrl = window.location.href;
                const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/pages/'));
                window.location.href = baseUrl + '/pages/login-page/index.html';
            }
            return;
        }

        // Valid session
        if (isLoginPage || isSignUpPage) {
            // If logged in and trying to access login/signup pages, redirect to home
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.indexOf('/pages/'));
            window.location.href = baseUrl + '/pages/home-page/index.html';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        // On error, clear session and stay on current page
        localStorage.removeItem('sessionToken');
    }
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }

            login(email, password);
        });
    }

    // Get the registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;
            const isAdmin = document.getElementById('isAdmin')?.checked || false;

            if (!email || !password || !name) {
                alert('Please fill in all fields');
                return;
            }

            register(email, password, name, isAdmin);
        });
    }

    // Check authentication status
    checkAuth();
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 