const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const {
  generateToken,
  verifyToken,
  requireRole
} = require('./middleware/auth');

const {
  users,
  requests,
  findUserByEmailOrId,
  findUserById,
  addUser,
  getRequestById,
  getActiveRequestForUser,
  getRecentRequests
} = require('./data/store');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

// Strict Security: Prohibit any direct file path probing, dotfiles, or directory traversal
app.use((req, res, next) => {
  const cleanPath = decodeURIComponent(req.path).toLowerCase();
  if (
    cleanPath.includes('.env') ||
    cleanPath.includes('.git') ||
    cleanPath.includes('.js') ||
    cleanPath.includes('.json') ||
    cleanPath.includes('backend') ||
    cleanPath.includes('store') ||
    cleanPath.includes('data') ||
    cleanPath.includes('node_modules') ||
    cleanPath.includes('..')
  ) {
    return res.status(403).json({ success: false, message: 'Forbidden: Direct file access is strictly blocked.' });
  }
  next();
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Helper to remove sensitive fields
function safeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

// ---------------- AUTH ROUTES ---------------- //

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'ID/Email and password are required.' });
    }

    const user = findUserByEmailOrId(identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Role check if specified by login role selection
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account role mismatch: This account is registered as '${user.role}', but you selected '${role}'.`
      });
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { id, email, name, password, role, location, activeCourse, title } = req.body;

    if (!id || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'ID, email, password, and role are required.' });
    }

    if (!['student', 'peer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be student or peer.' });
    }

    if (findUserByEmailOrId(email) || findUserByEmailOrId(id)) {
      return res.status(409).json({ success: false, message: 'User with this ID or email already exists.' });
    }

    if (String(password).length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const initials = (name || id).trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    const newUser = {
      id: String(id).trim(),
      email: String(email).trim().toLowerCase(),
      name: name ? String(name).trim() : String(id).trim(),
      role,
      location: location ? String(location).trim() : 'Hostel BH 13',
      avatar: initials,
      activeCourse: activeCourse || 'Programming (C++)',
      title: role === 'peer' ? (title || 'Peer Explainer') : undefined,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    if (role === 'peer') {
      newUser.rank = users.filter(u => u.role === 'peer').length + 1;
      newUser.xp = 100;
      newUser.level = 'Junior Peer';
      newUser.rating = 5.0;
      newUser.ratingCount = 1;
      newUser.solvedCount = 1;
      newUser.responseTime = '< 1 min';
      newUser.badges = ['New Peer Explainer'];
    }

    addUser(newUser);

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: safeUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Get current profile
app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, user: safeUser(user) });
});

// ---------------- PEER LEADERBOARD ---------------- //
app.get('/api/leaderboard', (req, res) => {
  const tutors = users
    .filter(u => u.role === 'peer')
    .map(safeUser)
    .sort((a, b) => (b.xp || 0) - (a.xp || 0));

  return res.json({ success: true, leaderboard: tutors });
});

// ---------------- HELP REQUESTS & ZOMATO FLOW ---------------- //

// Get active request for logged in student/peer
app.get('/api/requests/active', verifyToken, (req, res) => {
  const activeReq = getActiveRequestForUser(req.user.id, req.user.role);
  return res.json({ success: true, request: activeReq || null });
});

// Student broadcasts a new doubt
app.post('/api/requests/broadcast', verifyToken, requireRole('student'), (req, res) => {
  const { course, doubtTitle, doubtDetail, hostelLocation } = req.body;
  const student = findUserById(req.user.id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student profile not found.' });
  }

  // Check if student already has an active pending or in-progress request
  const existing = getActiveRequestForUser(req.user.id, 'student');
  if (existing && existing.status !== 'completed' && existing.status !== 'declined') {
    return res.json({ success: true, message: 'Using existing active doubt', request: existing });
  }

  const newReq = {
    id: `req-${Date.now()}`,
    studentId: student.id,
    studentName: student.name,
    studentAvatar: student.avatar || 'AS',
    studentLocation: student.location || 'Hostel BH 13',
    course: course || student.activeCourse || 'Programming (C++)',
    doubtTitle: doubtTitle ? String(doubtTitle).slice(0, 100) : 'Pointer logic',
    doubtDetail: doubtDetail ? String(doubtDetail).slice(0, 1000) : 'Stuck on Question 3 pointer logic error',
    hostelLocation: hostelLocation || 'Hostel BH 13',
    distance: '3 min away',
    status: 'pending',
    responseWindowSeconds: 45,
    peerId: 'tutor1', // In 1 student & 1 peer scenario, routed to Rahul M.
    peerName: 'Rahul M.',
    peerAvatar: 'RM',
    peerTitle: 'Senior Peer • C++',
    meetingLocation: 'BH 13 Common Room',
    meetingNotes: 'Go to the BH 13 common room by the whiteboard',
    walkTime: '3 min',
    estimatedWindow: '10:00 minutes',
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Date.now()}-1`,
        senderId: student.id,
        senderName: student.name,
        senderRole: 'student',
        senderAvatar: student.avatar || 'AS',
        text: `Hey! I need help with ${doubtTitle || 'Pointer logic'}: ${doubtDetail || 'Stuck on Question 3'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    rating: null
  };

  requests.unshift(newReq);

  // Real-time alert event
  io.emit('peer_explainer_alert', {
    request: newReq,
    soundTrigger: true,
    message: 'New nearby student needs help!'
  });

  return res.status(201).json({ success: true, request: newReq });
});

// Peer accepts the doubt
app.post('/api/requests/:id/accept', verifyToken, requireRole('peer'), (req, res) => {
  const { id } = req.params;
  const request = getRequestById(id);
  const tutor = findUserById(req.user.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ success: false, message: `Request is already ${request.status}.` });
  }

  request.status = 'accepted';
  request.peerId = tutor.id;
  request.peerName = tutor.name;
  request.peerAvatar = tutor.avatar || 'RM';
  request.peerTitle = tutor.title || 'Senior Peer • C++';
  request.acceptedAt = new Date().toISOString();

  // Add initial tutor greeting message if not already added
  request.messages.push({
    id: `msg-${Date.now()}`,
    senderId: tutor.id,
    senderName: tutor.name,
    senderRole: 'peer',
    senderAvatar: tutor.avatar || 'RM',
    text: "Hey! I'm here. Which part of the pointer question is confusing?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  io.emit('match_confirmed', { request });
  io.emit('session_updated', { request });

  return res.json({ success: true, message: 'Help request accepted!', request });
});

// Peer declines the doubt
app.post('/api/requests/:id/decline', verifyToken, requireRole('peer'), (req, res) => {
  const { id } = req.params;
  const request = getRequestById(id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  if (request.status !== 'pending') {
    return res.status(400).json({ success: false, message: `Cannot decline a request that is already ${request.status}.` });
  }

  request.status = 'declined';
  io.emit('request_declined', { id, message: 'Peer is unavailable right now' });
  io.emit('session_updated', { request });

  return res.json({ success: true, message: 'Request declined', request });
});

// Send a chat message (Security: caller must belong to this session)
app.post('/api/requests/:id/message', verifyToken, (req, res) => {
  const { id } = req.params;
  const { text, codeSnippet, type } = req.body;
  const request = getRequestById(id);
  const user = findUserById(req.user.id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  // Security: prevent unauthorized users from posting to another user's session
  if (req.user.id !== request.studentId && req.user.id !== request.peerId) {
    return res.status(403).json({ success: false, message: 'Forbidden: You are not a participant in this session.' });
  }

  const cleanText = String(text || '').slice(0, 1000);

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    senderAvatar: user.avatar || user.name.slice(0, 2).toUpperCase(),
    text: cleanText,
    type: type || (codeSnippet ? 'code' : 'text'),
    codeSnippet: codeSnippet || null,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  request.messages.push(newMsg);

  io.emit('chat_message', { requestId: id, message: newMsg });

  return res.json({ success: true, message: newMsg });
});

// Mark help completed (Security: participant check)
app.post('/api/requests/:id/complete', verifyToken, (req, res) => {
  const { id } = req.params;
  const request = getRequestById(id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  if (req.user.id !== request.studentId && req.user.id !== request.peerId) {
    return res.status(403).json({ success: false, message: 'Forbidden: You are not a participant in this session.' });
  }

  request.status = 'completed';
  request.completedAt = new Date().toISOString();

  io.emit('session_completed', { request });
  io.emit('session_updated', { request });

  return res.json({ success: true, message: 'Session marked as completed', request });
});

// Student rates session (Security: only the student who asked can rate!)
app.post('/api/requests/:id/rate', verifyToken, requireRole('student'), (req, res) => {
  const { id } = req.params;
  const { stars, feedbackTags, thanksNote } = req.body;
  const request = getRequestById(id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  // Security: only the student who asked can rate
  if (req.user.id !== request.studentId) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only the student of this doubt can submit a rating.' });
  }

  const tutor = findUserById(request.peerId || 'tutor1');
  const ratingValue = Math.min(5, Math.max(1, parseInt(stars, 10) || 5));

  // XP calculation
  const xpEarned = ratingValue === 5 ? 50 : ratingValue >= 4 ? 35 : 20;

  if (tutor) {
    const prevXp = tutor.xp || 1200;
    tutor.xp = prevXp + xpEarned;
    tutor.solvedCount = (tutor.solvedCount || 28) + 1;
    tutor.ratingCount = (tutor.ratingCount || 28) + 1;
    tutor.rating = Number(((tutor.rating * (tutor.ratingCount - 1) + ratingValue) / tutor.ratingCount).toFixed(1));

    // Dynamic rank promotion
    if (tutor.xp >= 1350 && tutor.rank > 1) {
      tutor.rank = 1;
    } else if (tutor.xp >= 1250 && tutor.rank > 2) {
      tutor.rank = 2;
    }

    request.rating = {
      stars: ratingValue,
      feedbackTags: Array.isArray(feedbackTags) ? feedbackTags.slice(0, 5) : ['Patient Explainer', 'Quick Solution'],
      thanksNote: thanksNote ? String(thanksNote).slice(0, 300) : 'Thanks for clearing my pointer doubts!',
      xpAwarded: xpEarned,
      peerNewRank: tutor.rank,
      peerNewXp: tutor.xp,
      submittedAt: new Date().toISOString()
    };

    io.emit('peer_ranked_up', {
      peerId: tutor.id,
      peerName: tutor.name,
      xpEarned,
      newXp: tutor.xp,
      newRank: tutor.rank,
      message: `Happy student, happy peer! ${tutor.name}'s peer rank increased to #${tutor.rank} (+${xpEarned} XP)!`
    });
  }

  request.status = 'completed';
  io.emit('session_updated', { request });

  return res.json({
    success: true,
    message: 'Rating recorded successfully! Peer ranking upgraded.',
    request,
    peerStats: tutor ? safeUser(tutor) : null
  });
});

// Socket connection
io.on('connection', (socket) => {
  socket.on('join', ({ userId, role }) => {
    if (userId) socket.join(`user_${userId}`);
    if (role) socket.join(`role_${role}`);
  });

  socket.on('join_request', ({ requestId }) => {
    if (requestId) socket.join(`req_${requestId}`);
  });
});

// Catch-all 404 handler for any unmapped route
app.use((req, res) => {
  return res.status(404).json({ success: false, message: 'Resource or endpoint not found.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Peer Explainer Server running on http://localhost:${PORT}`);
});
