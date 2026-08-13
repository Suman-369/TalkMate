# Chat Application - Setup & Flow Guide

## 🎯 Application Flow

### User Journey:

1. **Initial Load** → User sees Login page (if not authenticated)
2. **Sign In / Sign Up** → User creates account or logs in
3. **Dashboard** → After auth, user sees chat interface with sidebar
4. **Create Chat** → User clicks "New" button to create a new chat
5. **Chat Creation Modal** → Modal appears to enter chat title
6. **Chat Interface** → Chat is created and user can start messaging
7. **Switch Chats** → Click any chat in sidebar to load it
8. **Logout** → User info at bottom of sidebar with logout button

## ✨ Key Features Implemented

### 1. **Authentication System**

- Redux state management for auth (`authSlice.js`)
- Protected routes - shows login/register if not authenticated
- Login page with error handling
- Register page with form validation
- User data persisted in Redux store
- Logout functionality

### 2. **Efficient Frontend-Backend Connection**

- Centralized API service (`services/api.js`)
- Axios instance with credentials support
- Configured for both local development and production
- Base URL from environment variables
- All API calls go through dedicated service

### 3. **Chat Management**

- Chat list in sidebar
- Create new chats with modal dialog
- Select and switch between chats
- Load chat messages on selection
- Real-time messaging via WebSocket

### 4. **UI/UX Improvements**

- Clean, modern dark theme
- Modal for creating chats instead of prompt
- User info card in sidebar footer
- Logout button in user section
- Empty states with helpful messages
- Loading indicators
- Error handling and display
- Smooth animations and transitions

## 📁 File Structure

```
frontend/
├── src/
│   ├── store/
│   │   ├── authSlice.js          (NEW - Auth state management)
│   │   ├── chatSlice.js          (UPDATED - MongoDB _id support)
│   │   └── store.js              (UPDATED - Added authSlice)
│   ├── services/
│   │   └── api.js                (NEW - Centralized API calls)
│   ├── components/
│   │   ├── ProtectedRoute.jsx     (NEW - Route protection)
│   │   └── chat/
│   │       ├── CreateChatModal.jsx (NEW - Chat creation modal)
│   │       ├── CreateChatModal.css (NEW - Modal styles)
│   │       ├── ChatSidebar.jsx     (UPDATED - User info + logout)
│   │       └── ChatSidebar.css     (UPDATED - Added user footer styles)
│   ├── pages/
│   │   ├── Home.jsx              (UPDATED - New auth flow)
│   │   ├── Login.jsx             (UPDATED - Uses API service & Redux)
│   │   └── Register.jsx          (UPDATED - Uses API service & Redux)
│   ├── AppRoutes.jsx             (UPDATED - Protected routes)
│   └── App.css                   (UPDATED - Error & button styles)
├── .env                          (NEW - API configuration)
└── vite.config.js                (Already configured for proxy)

backend/
├── src/
│   ├── app.js                    (UPDATED - Dynamic CORS config)
│   └── (other files remain same)
└── .env                          (Already exists)
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+
- MongoDB connection string
- Backend deployed on Render (or local)

### Frontend Setup

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   - Edit `frontend/.env`:

   ```
   VITE_API_URL=https://chat-app-u7gk.onrender.com
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

### Backend Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   - Update `backend/.env`:

   ```
   PORT=3000
   MONGODB_URI=your_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run Server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

## 🔄 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Chat Management

- `POST /api/chat` - Create new chat (requires auth)
- `GET /api/chat` - Get all user's chats (requires auth)
- `GET /api/chat/messages/:id` - Get chat messages (requires auth)

All requests include credentials (cookies with JWT token).

## 🔐 Authentication Flow

1. User submits login/register form
2. Frontend sends request to backend
3. Backend validates and creates JWT token
4. Token stored in HTTP-only cookie (secure)
5. Redux stores user data in state
6. `authSlice` marks `isAuthenticated = true`
7. Protected routes now show chat interface
8. All API requests automatically include cookie

## 🎨 Theming

The app uses CSS custom properties for theming:

- Dark theme by default
- Smooth transitions between themes
- Colors defined in `styles/theme.css`
- All components inherit theme colors

## 📱 Responsive Design

- Mobile sidebar (hidden by default, toggle with button)
- Adapts to different screen sizes
- Touch-friendly buttons and controls
- Proper mobile spacing

## ⚙️ Socket Connection

WebSocket connects to the same origin:

- Local dev: `http://localhost:3000`
- Production: Backend URL
- Credentials enabled for secure connection

## 🛠️ Development Tips

### To test locally with backend:

1. Start backend on `localhost:3000`
2. Start frontend on `localhost:5173`
3. Vite proxy handles `/api` calls
4. Socket.IO proxy handles real-time connection

### To test with production backend:

1. Use deployed backend URL
2. Frontend API calls go directly to backend
3. Socket.IO connects to backend
4. CORS allows cross-origin requests

## 🚨 Common Issues & Solutions

### Issue: CORS errors

**Solution**: Update `backend/src/app.js` `allowedOrigins` array with frontend URL

### Issue: Cookies not being sent

**Solution**: Ensure `withCredentials: true` in axios (already done in `api.js`)

### Issue: Socket connection fails

**Solution**: Check backend URL in vite.config.js proxy or environment variables

### Issue: 401 Unauthorized

**Solution**: User not authenticated - clear cookies and login again

## 📊 State Management

### Redux Store Structure

```javascript
{
  auth: {
    user: { email, _id, fullName },
    isAuthenticated: boolean,
    loading: boolean,
    error: string
  },
  chat: {
    chats: [],
    activeChatId: string,
    input: string,
    isSending: boolean,
    loading: boolean
  }
}
```

## 🎯 Next Steps

### To enhance further:

1. Add user profile page
2. Add chat edit/delete functionality
3. Add message search
4. Add typing indicators
5. Add user presence/online status
6. Add message reactions/emojis
7. Add file upload support
8. Add end-to-end encryption

---

**Version**: 1.0
**Last Updated**: May 2026
