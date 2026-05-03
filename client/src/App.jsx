import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
