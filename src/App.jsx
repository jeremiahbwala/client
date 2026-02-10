import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navigation from './components/Navigation.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Classroom from './pages/Classroom';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import Profile from './pages/Profile';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        
        <Route 
          path="/classroom/:id" 
          element={
            <PrivateRoute>
              <Classroom />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/community" 
          element={
            <PrivateRoute>
              <Community />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/community/:id" 
          element={
            <PrivateRoute>
              <PostDetail />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/community/create" 
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/instructor/dashboard" 
          element={
            <PrivateRoute role="instructor">
              <InstructorDashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/instructor/create-course" 
          element={
            <PrivateRoute role="instructor">
              <CreateCourse />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;