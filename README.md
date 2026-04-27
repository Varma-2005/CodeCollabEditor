# CollabCodeEditor 🚀

A **real-time collaborative code editor** that allows multiple developers to write, edit, and execute code together in the same virtual workspace. Perfect for pair programming, coding interviews, and team development.

## 🎯 Features

- 🔐 **User Authentication** - Secure sign-up and sign-in with JWT tokens
- 👥 **Real-Time Collaboration** - Live code synchronization across multiple users using WebSockets
- 💾 **Room Management** - Create, join, and manage collaborative coding rooms
- ⚡ **Code Execution** - Compile and run code directly in the browser with support for multiple languages
- 🎨 **Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- 🔒 **Secure Communication** - CORS-enabled and authenticated WebSocket connections
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 📋 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **React Router v7** - Client-side routing
- **React Hook Form** - Form state management
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library

### Backend
- **Node.js + Express 5** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - Real-time, bidirectional communication
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Axios** - HTTP requests to external APIs
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### External APIs
- **Judge0 CE** - Code compilation and execution API

## 📁 Project Structure

```
CollabCodeEditor/
├── client/                          # React Frontend
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx       # Code editor component
│   │   │   └── ProtectedRoute.jsx   # Auth-protected routes
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── SocketContext.jsx    # WebSocket state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── Landing.jsx          # Home page
│   │   │   ├── RoomEditor.jsx       # Collaborative editor page
│   │   │   ├── Rooms.jsx            # Available rooms list
│   │   │   ├── Signin.jsx           # Login page
│   │   │   └── Signup.jsx           # Registration page
│   │   ├── services/
│   │   │   └── api.js               # API service calls
│   │   ├── assets/                  # Images and media
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # App styles
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   ├── package.json                 # Frontend dependencies
│   └── index.html                   # HTML template
│
└── server/                          # Express Backend
    ├── models/
    │   ├── User.js                  # User database model
    │   └── Room.js                  # Room database model
    ├── routes/
    │   ├── authRoutes.js            # Authentication endpoints
    │   ├── compilerRoutes.js        # Code execution endpoints
    │   └── roomRoutes.js            # Room management endpoints
    ├── middleware/
    │   └── auth.js                  # JWT authentication middleware
    ├── socket/
    │   └── socketHandlers.js        # WebSocket event handlers
    ├── server.js                    # Main server file
    ├── package.json                 # Backend dependencies
    └── .env                         # Environment variables (not included)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- RapidAPI Judge0 API Key

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd CollabCodeEditor
```

#### 2. Setup Backend Server

```bash
cd server

# Install dependencies
npm install

# Create .env file with required variables
cat > .env << EOF
PORT=3000
DB_URL=mongodb://localhost:27017/collabcodeeditor
# or use MongoDB Atlas:
# DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/collabcodeeditor

JWT_SECRET_KEY=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# RapidAPI Judge0 Configuration
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
EOF

# Start the server
npm start
# Server will run on http://localhost:3000
```

#### 3. Setup Frontend Client

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
# Client will run on http://localhost:5173
```

### Getting RapidAPI Judge0 Key
1. Visit: https://rapidapi.com/judge0-official/api/judge0-ce
2. Click "Subscribe to Test" button
3. Choose the **FREE Plan** (50 requests/day)
4. Copy your **X-RapidAPI-Key**
5. Add it to your `.env` file as `RAPIDAPI_KEY`

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register a new user
  ```json
  { "username": "user", "email": "user@example.com", "password": "pass" }
  ```
- `POST /signin` - Login user
  ```json
  { "email": "user@example.com", "password": "pass" }
  ```

### Room Routes (`/api/rooms`)
- `GET /` - Get all available rooms
- `GET /:roomId` - Get specific room details
- `POST /` - Create a new room
  ```json
  { "name": "Room Name" }
  ```
- `PUT /:roomId` - Update room
- `DELETE /:roomId` - Delete room

### Compiler Routes (`/api/compiler`)
- `POST /execute` - Execute code
  ```json
  {
    "language_id": 62,
    "source_code": "print('Hello')",
    "stdin": ""
  }
  ```

## 🔌 WebSocket Events

### Client to Server
- `join-room` - Join a collaborative room
- `leave-room` - Leave current room
- `code-update` - Update shared code
- `cursor-move` - Broadcast cursor position

### Server to Client
- `room-joined` - Confirmation of joining room
- `code-updated` - Code changed by another user
- `cursor-updated` - Another user's cursor position
- `room-left` - User left the room

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for secure authentication:
1. User signs up/signs in with email and password
2. Password is hashed using bcryptjs
3. JWT token is generated with 7-day expiration
4. Token is sent with requests and WebSocket connections
5. Backend verifies token before allowing access

## 🛠️ Build & Deployment

### Build Frontend
```bash
cd client
npm run build
# Output: dist/ folder ready for deployment
```

### Build Backend
No build needed for backend. Just deploy the server folder with `node server.js`

### Deployment Options
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Database**: MongoDB Atlas (cloud)

## 📝 Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Create Room**: Create a new collaborative coding room
3. **Share Code**: Invite others to join your room (share room link)
4. **Code Together**: Real-time collaborative editing with live synchronization
5. **Execute Code**: Compile and run code in multiple languages
6. **View Results**: See output and execution time instantly

## 🎨 Supported Programming Languages

Through Judge0 API, supports 60+ programming languages including:
- Python, JavaScript, Java, C, C++, C#
- PHP, Ruby, Go, Rust, TypeScript
- And many more...

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MongoDB Atlas credentials
- Update `DB_URL` in `.env`

### RapidAPI Key Issues
- Verify the key is valid at https://rapidapi.com/dashboard
- Check you have remaining requests for the day (50/day on free plan)
- Ensure `RAPIDAPI_KEY` and `RAPIDAPI_HOST` are set correctly

### CORS Errors
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Check that frontend and backend servers are running

### WebSocket Connection Failed
- Verify backend server is running
- Check that the token is valid
- Ensure frontend is connecting to correct backend URL

## 📚 Environment Variables

### Backend (.env)
```
PORT=3000
DB_URL=mongodb://localhost:27017/collabcodeeditor
JWT_SECRET_KEY=your_secret_key
CLIENT_URL=http://localhost:5173
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

## 🔄 Development Workflow

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev

# Terminal 3 - ESLint check (optional)
cd client
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Bhuvanesh**

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Tutorial](https://docs.mongodb.com)
- [Socket.io Documentation](https://socket.io/docs)
- [Vite Guide](https://vitejs.dev)

## 💡 Future Enhancements

- [ ] Code formatting and syntax highlighting improvements
- [ ] More real-time features (chat, comments)
- [ ] Theme customization (dark mode, light mode)
- [ ] Code snippets library
- [ ] Performance optimization for large files
- [ ] Deployment guides for major platforms
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Notification system
- [ ] Code history and version control

## ❓ FAQ

**Q: Can I run this locally?**
A: Yes! Follow the installation steps above. You'll need Node.js, npm, and MongoDB installed.

**Q: How many users can collaborate in one room?**
A: Theoretically unlimited, but we recommend under 10 for best performance.

**Q: Is my code stored?**
A: Code is stored in MongoDB while in a room. Execution results are temporary.

**Q: Can I deploy this to production?**
A: Yes! Use the build commands and deploy to Vercel (frontend) and any Node.js hosting (backend).

---

**Happy Coding! 🎉**
