import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for users (in a real app, this would be a database)
const users = [
  {
    username: "admin",
    password: "admin123", // In a real app, this would be hashed
    role: "admin"
  }
];

// Sample data
const platforms = [
  {
    id: 1,
    name: "Duolingo",
    description: "Learn languages for free",
    url: "https://www.duolingo.com",
    averageRating: 4.5,
    popularity: 1000
  },
  {
    id: 2,
    name: "Babbel",
    description: "Learn a new language with Babbel",
    url: "https://www.babbel.com",
    averageRating: 4.3,
    popularity: 800
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse the request body if it's a string
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  req.body = body;

  // Handle different API endpoints
  const { path } = req.query;
  const endpoint = Array.isArray(path) ? path[0] : path;

  try {
    switch (endpoint) {
      case 'login':
        return await handleLogin(req, res);
      case 'register':
        return await handleRegister(req, res);
      case 'platforms':
        return res.status(200).json(platforms);
      default:
        return res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(200).json({
    success: true,
    user: {
      username: user.username,
      role: user.role
    }
  });
}

async function handleRegister(req: VercelRequest, res: VercelResponse) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (users.some(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = {
    username,
    password,
    role: 'user'
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    user: {
      username: newUser.username,
      role: newUser.role
    }
  });
} 