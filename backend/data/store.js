const bcrypt = require('bcryptjs');

// Pre-seeded users: Student (Aarav S.) and Peer Tutor (Rahul M.)
// Passwords hashed using bcryptjs
const salt = bcrypt.genSaltSync(10);

const users = [
  {
    id: 'student1',
    email: 'aarav@campus.edu',
    name: 'Aarav S.',
    role: 'student',
    location: 'Hostel BH 13',
    avatar: 'AS',
    activeCourse: 'Programming (C++)',
    passwordHash: bcrypt.hashSync('Student@123', salt),
    createdAt: new Date().toISOString()
  },
  {
    id: 'tutor1',
    email: 'rahul@campus.edu',
    name: 'Rahul M.',
    role: 'peer',
    title: 'Senior Peer • C++',
    location: 'Hostel BH 13',
    avatar: 'RM',
    activeCourse: 'Programming (C++)',
    passwordHash: bcrypt.hashSync('Tutor@123', salt),
    rank: 2,
    xp: 1300,
    level: 'Senior Peer',
    rating: 4.9,
    ratingCount: 28,
    solvedCount: 28,
    responseTime: '< 45s',
    badges: ['Top Explainer', 'C++ Expert', 'Hostel BH 13 Mentor', 'Night Owl'],
    createdAt: new Date().toISOString()
  }
];

// In-memory active help requests
let requests = [];

// Seed initial demo request
const initialRequest = {
  id: 'req-demo-001',
  studentId: 'student1',
  studentName: 'Aarav S.',
  studentLocation: 'Hostel BH 13',
  studentAvatar: 'AS',
  course: 'Programming (C++)',
  doubtTitle: 'Pointer logic',
  doubtDetail: 'Stuck on Question 3 pointer logic error',
  hostelLocation: 'Hostel BH 13',
  distance: '3 min away',
  status: 'pending', // 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined'
  responseWindowSeconds: 45,
  peerId: 'tutor1',
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
      id: 'msg-1',
      senderId: 'tutor1',
      senderName: 'Rahul M.',
      senderRole: 'peer',
      senderAvatar: 'RM',
      text: "Hey! I'm here. Which part of the pointer question is confusing?",
      timestamp: '11:42 PM'
    },
    {
      id: 'msg-2',
      senderId: 'student1',
      senderName: 'Aarav S.',
      senderRole: 'student',
      senderAvatar: 'AS',
      text: "I keep mixing up the pointer and the value it points to.",
      timestamp: '11:43 PM'
    },
    {
      id: 'msg-3',
      senderId: 'tutor1',
      senderName: 'Rahul M.',
      senderRole: 'peer',
      senderAvatar: 'RM',
      type: 'code',
      codeSnippet: {
        title: 'POINTER DEFINITION - C++',
        code: `int value = 10;\nint* ptr = &value;\n*ptr = 20;`,
        explanation: 'The pointer stores the memory address, not the value at that address.'
      },
      text: 'Here is a quick pointer definition snippet to look at:',
      timestamp: '11:43 PM'
    },
    {
      id: 'msg-4',
      senderId: 'student1',
      senderName: 'Aarav S.',
      senderRole: 'student',
      senderAvatar: 'AS',
      text: "Ohh -- so *ptr means 'the value at that address'?",
      timestamp: '11:44 PM'
    },
    {
      id: 'msg-5',
      senderId: 'tutor1',
      senderName: 'Rahul M.',
      senderRole: 'peer',
      senderAvatar: 'RM',
      text: "Exactly. You got it!",
      timestamp: '11:44 PM'
    }
  ],
  rating: null
};

requests.push(initialRequest);

module.exports = {
  users,
  requests,
  findUserByEmailOrId: (identifier) => {
    if (!identifier) return null;
    const q = String(identifier).toLowerCase().trim();
    return users.find(u => u.email.toLowerCase() === q || u.id.toLowerCase() === q);
  },
  findUserById: (id) => users.find(u => u.id === id),
  addUser: (user) => {
    users.push(user);
    return user;
  },
  getRequestById: (id) => requests.find(r => r.id === id),
  getActiveRequestForUser: (userId, role) => {
    return requests.find(r => {
      if (role === 'student') {
        return r.studentId === userId && r.status !== 'completed' && r.status !== 'declined';
      } else {
        return (r.peerId === userId || !r.peerId) && r.status !== 'completed' && r.status !== 'declined';
      }
    });
  },
  getRecentRequests: () => requests
};
