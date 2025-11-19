# AI Proctoring System

A comprehensive web-based examination platform with advanced AI-powered proctoring capabilities to ensure exam integrity and prevent cheating.

## 🚀 Features

### For Candidates
- **Secure Registration**: Complete profile setup with personal information
- **User Dashboard**: View profile, available tests, and test history
- **Profile Management**: Edit personal information
- **AI-Monitored Testing**: Real-time proctoring during exams
- **Enhanced Exam UI**: One-question-per-page navigation with progress bars
- **Results Tracking**: View detailed test results and performance

### For Administrators
- **Test Management**: Create, publish, unpublish, and delete tests
- **AI Test Generation**: Automatically generate test questions using Google Gemini AI
- **Candidate Oversight**: View all registered candidates with complete profiles
- **Results Monitoring**: Access comprehensive test results and analytics
- **User Management**: Manage candidate accounts and permissions
- **Delete Functionality**: Remove tests and results as needed

### AI Proctoring Features
- **Face Detection**: Real-time facial recognition using advanced AI
- **Tab Switching Detection**: Monitors browser tab changes
- **Audio Monitoring**: Detects background noise and suspicious audio
- **Violation Logging**: Automatic recording of proctoring violations
- **Real-time Alerts**: Immediate notifications for suspicious activities
- **Proctoring Logs**: Detailed logs of all proctoring events during exams

## 🛠️ Tech Stack

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **React Router** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library for React
- **Face-API.js** - JavaScript API for face detection and recognition

### Backend
- **Node.js** - JavaScript runtime built on Chrome's V8 engine
- **Express.js** - Fast, unopinionated, minimalist web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing library

### Additional Libraries
- **Axios** - Promise-based HTTP client
- **React Icons** - Popular icons library
- **Web Audio API** - Audio processing for noise detection
- **Google Generative AI** - AI-powered test question generation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git** (for cloning the repository)

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhinandan46/Proctoring-System.git
   cd Proctoring-System
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup:**
   - Create a `.env` file in the `server` directory
   - Add the following environment variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     GOOGLE_AI_API_KEY=your_google_generative_ai_api_key
     ```

5. **Start MongoDB:**
   - Ensure MongoDB is running on your system
   - Or update `MONGO_URI` to point to your MongoDB Atlas cluster for cloud database

## 🚀 Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the frontend client:**
   ```bash
   cd client
   npm start
   ```
   The client will run on `http://localhost:3000`

### Production Build

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server:**
   ```bash
   cd server
   npm start
   ```

## 📖 Usage

### For Candidates:
1. **Register**: Create an account with complete profile information
2. **Login**: Access your dashboard
3. **Take Tests**: Select available tests and complete them under AI supervision
4. **View Results**: Check your test scores and performance history

### For Administrators:
1. **Login**: Access admin dashboard
2. **Manage Tests**: Create new tests, publish/unpublish existing ones
3. **Monitor Candidates**: View all registered users and their profiles
4. **Review Results**: Analyze test performance and proctoring data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for password security
- **Role-Based Access**: Separate permissions for admins and candidates
- **Input Validation**: Comprehensive validation on both client and server
- **AI Proctoring**: Advanced cheating prevention mechanisms

## 🎨 UI/UX Features

- **Modern Design**: Glassmorphism effects with backdrop blur
- **Dark Mode**: Complete dark/light theme support
- **Responsive Layout**: Mobile-friendly design
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Consistent Styling**: Unified design language across all components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Face-API.js for providing excellent face detection capabilities
- React community for the amazing ecosystem
- MongoDB for reliable database solutions

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This system is designed for educational purposes and should be used in accordance with institutional policies and regulations.