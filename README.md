# Smart Code Translator

An AI-powered full-stack application that helps developers work across programming languages.

## Features
- Translate code between C, C++, C#, Java and Python
- Analyze time and space complexity with Big-O notation
- Get AI-powered optimization suggestions
- Understand code with beginner-friendly explanations
- Operation history with pagination
- Email/password auth + Google SSO

## Tech Stack
- **Frontend**: React + Vite, Monaco Editor
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **AI**: Google Gemini
- **Auth**: JWT + Google OAuth

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB Atlas account
- Google Cloud Console account
- Gemini API key

### Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
```
Create a `.env` file in the `client/` directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
```bash
npm run dev
```

## Usage
1. Register or sign in with Google
2. Write or paste code in the editor
3. Select source and target languages
4. Choose an action: Translate, Analyze, Optimize or Explain
5. Click Run and view results
6. Browse past operations in History

## Author
Your Name
