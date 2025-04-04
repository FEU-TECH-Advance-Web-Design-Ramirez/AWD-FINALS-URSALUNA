import express from 'express';
import { Request, Response } from 'express';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role?: string;
}

const router = express.Router();

let users: User[] = [];

// Initialize admin account
const adminAccount: User = {
  id: 1,
  email: 'admin',
  password: 'admin123',
  name: 'Administrator',
  role: 'admin'
};
users.push(adminAccount);

// Create new user
router.post('/', (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  const newUser: User = { id: users.length + 1, email, name, password };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Get all users
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(users);
});

// User login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    res.status(200).json({ 
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Update user
router.put('/:id', (req: Request, res: Response) => {
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user
router.delete('/:id', (req: Request, res: Response) => {
  const userIndex = users.findIndex((u) => u.id == req.params.id);
  userIndex !== -1
    ? (users.splice(userIndex, 1),
      res.status(200).json({ message: "User banned successfully" }))
    : res.status(404).json({ message: "User not found" });
});

export default router; 