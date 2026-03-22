const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

// Creates a short-lived access token (15 min)
// Contains the user's id and username — no DB lookup needed on future requests
const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

// Creates a long-lived refresh token (7 days)
// Contains only the user id — its only job is to get new access tokens
const signRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

// Cookie settings for the refresh token
// httpOnly: true means JavaScript on the page CANNOT read this cookie
// That's the key security feature — even if someone injects bad JS into your site,
// they can't steal the refresh token
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProd,    // only sent over HTTPS in production
  sameSite: 'strict',       // not sent on cross-site requests (CSRF protection)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username already taken
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Create user — password gets hashed automatically by the pre-save hook in User.js
    const user = await User.create({ username, password });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // .select('+password') because password has select:false in the schema
    const user = await User.findOne({ username }).select('+password');

    // Same error message whether username or password is wrong
    // (don't tell attackers which one failed)
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create both tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Store a HASH of the refresh token in DB (not the token itself)
    // So if the DB is breached, the attacker gets useless hashes, not real tokens
    await RefreshToken.deleteMany({ user: user._id }); // clear old tokens
    await RefreshToken.create({
      token: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Refresh token goes in a cookie the browser manages automatically
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

    // Access token goes in the response body — frontend stores it in memory
    res.json({
      accessToken,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};

// Called when the access token expires (after 15 min)
// The browser sends the httpOnly cookie automatically
const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    // Step 1: verify the JWT signature is valid
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.refreshSecret);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Step 2: check it exists in DB (hasn't been revoked/logged out)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const stored = await RefreshToken.findOne({ token: tokenHash, user: decoded.id });
    if (!stored) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Step 3: issue brand new tokens (rotation — old refresh token is now useless)
    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    await RefreshToken.deleteOne({ token: tokenHash });
    await RefreshToken.create({
      token: crypto.createHash('sha256').update(newRefreshToken).digest('hex'),
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // Delete from DB so the token can never be used again
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await RefreshToken.deleteOne({ token: tokenHash });
    }

    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout } 