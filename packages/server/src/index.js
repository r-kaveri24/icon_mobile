import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

app.use(cors());
app.use(express.json());

// Health
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: 'connected', version: '1.0.0' });
});

// Auth: Register -> Clerk
app.post('/auth/register', async (req, res) => {
  try {
    if (!CLERK_SECRET_KEY) {
      return res.status(500).json({ success: false, error: 'Server misconfiguration: CLERK_SECRET_KEY missing' });
    }

    const { name, email, password, confirmPassword } = req.body || {};
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    const nameParts = String(name).trim().split(' ').filter(Boolean);
    const first_name = nameParts[0] || undefined;
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

    const clerkResp = await axios.post(
      'https://api.clerk.com/v1/users',
      {
        email_address: [email],
        password,
        first_name,
        last_name,
      },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const u = clerkResp?.data;
    const primaryEmail = Array.isArray(u?.email_addresses) ? (u.email_addresses[0]?.email_address || email) : email;
    const user = {
      id: u?.id || 'user_' + Math.random().toString(36).slice(2),
      email: primaryEmail,
      name: [u?.first_name, u?.last_name].filter(Boolean).join(' ') || name,
      role: 'CUSTOMER',
      createdAt: u?.created_at || new Date().toISOString(),
      updatedAt: u?.updated_at || new Date().toISOString(),
    };

    return res.json({ success: true, data: { user, token: '' } });
  } catch (err) {
    const msg = err?.response?.data || err?.message || 'Registration failed';
    console.error('[Server] Clerk register error:', msg);
    return res.status(400).json({ success: false, error: 'Registration failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});