# AI-Enabled Proctoring Exam System

A full-stack web application for conducting proctored exams with AI-powered monitoring using face detection, noise detection, and tab switching prevention.

## Features

- **User Authentication**: JWT-based login for admins and candidates
- **Admin Dashboard**: Manage tests, candidates, and view results
- **Test Creation & Management**: Create, edit, publish, and delete tests
- **Candidate Management**: Add and view candidates
- **Proctored Test Taking**: Real-time monitoring with face detection, noise detection, and tab switching alerts
- **Results & Analytics**: View scores and detailed results with charts

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Axios, React Router, Recharts, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **AI Proctoring**: face-api.js for face detection, Web Audio API for noise, visibilitychange for tab switching

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following:
   ```
   MONGO_URI=mongodb://localhost:27017/proctoring-system
   JWT_SECRET=your-secret-key
   ```

4. Start MongoDB (if local).

5. Seed the database with dummy data:
   ```
   node seed.js
   ```

6. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000.

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Download face-api.js models (already done if following steps):
   - Models are in `client/public/models/`

4. Start the development server:
   ```
   npm run dev
   ```
   The app will run on http://localhost:5173.

## Usage

1. **Admin Login**: Use `admin@example.com` / `admin123` to log in as admin.
2. **Candidate Login**: Use `candidate@example.com` / `candidate123` to log in as candidate.
3. **Create Tests**: As admin, create tests with questions.
4. **Take Tests**: As candidate, start tests with proctoring enabled.
5. **Monitor**: Real-time alerts for violations.

## Deployment

### Backend Deployment (e.g., Heroku)

1. Set environment variables in Heroku.
2. Deploy the server folder.

### Frontend Deployment (e.g., Vercel)

1. Build the client:
   ```
   npm run build
   ```
2. Deploy the `dist` folder to Vercel.

### Database

Use MongoDB Atlas for cloud database.

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create test
- `PUT /api/tests/:id/publish` - Publish test
- `DELETE /api/tests/:id` - Delete test
- `GET /api/candidates` - Get candidates
- `POST /api/candidates` - Add candidate
- `GET /api/results` - Get results
- `POST /api/results/submit` - Submit test
- `POST /api/proctor/log` - Log proctor event

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push and create PR

## License

MIT