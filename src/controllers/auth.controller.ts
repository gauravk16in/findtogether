import { Request, Response } from 'express';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // In a real application, you would validate the user against the database.
  // For this demo, we'll just simulate a successful login.
  console.log(`Login attempt for user: ${email}`);

  res.status(200).json({
    message: 'Login successful',
    token: 'mock-jwt-token-for-demo-purposes',
    user: {
      email: email,
      role: 'officer'
    }
  });
};
