import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, avatar } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const normalizedPhone = phone?.trim() || null;
    if (normalizedPhone && !/^\d{10,}$/.test(normalizedPhone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Phone number must contain at least 10 digits' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, phone_verified, avatar_url, password_hash)
       VALUES ($1, $2, $3, FALSE, $4, $5)
       RETURNING id, name, email, phone, phone_verified, avatar_url AS avatar, created_at`,
      [name.trim(), email.trim().toLowerCase(), normalizedPhone, avatar || null, hash],
    );
    const user = result.rows[0];
    const token = signToken(user.id);
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await pool.query(
      'SELECT id, name, email, phone, phone_verified, avatar_url AS avatar, password_hash, created_at FROM users WHERE email = $1',
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    delete user.password_hash;
    const token = signToken(user.id);
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, phone_verified, avatar_url AS avatar, created_at FROM users WHERE id = $1',
      [req.userId],
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load profile' });
  }
});

router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, avatar, phone_verified } = req.body || {};
    const currentResult = await pool.query('SELECT phone FROM users WHERE id = $1', [req.userId]);
    const currentUser = currentResult.rows[0];
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = [];
    const params = [];
    let normalizedPhone = currentUser.phone;

    if (name !== undefined) {
      updates.push(`name = $${params.length + 1}`);
      params.push(name.trim());
    }

    if (phone !== undefined) {
      normalizedPhone = phone.trim() || null;
      if (normalizedPhone && !/^\d{10,}$/.test(normalizedPhone.replace(/\D/g, ''))) {
        return res.status(400).json({ error: 'Phone number must contain at least 10 digits' });
      }
      updates.push(`phone = $${params.length + 1}`);
      params.push(normalizedPhone);
      if (phone_verified === undefined) {
        updates.push(`phone_verified = $${params.length + 1}`);
        params.push(false);
      }
    }

    if (avatar !== undefined) {
      updates.push(`avatar_url = $${params.length + 1}`);
      params.push(avatar || null);
    }

    if (phone_verified !== undefined) {
      updates.push(`phone_verified = $${params.length + 1}`);
      params.push(Boolean(phone_verified));
    }

    if (!updates.length) {
      const result = await pool.query(
        'SELECT id, name, email, phone, phone_verified, avatar_url AS avatar, created_at FROM users WHERE id = $1',
        [req.userId],
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${params.length + 1}
       RETURNING id, name, email, phone, phone_verified, avatar_url AS avatar, created_at`,
      [...params, req.userId],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

export default router;
