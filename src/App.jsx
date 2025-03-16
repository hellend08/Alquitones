// App.jsx

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Home from './components/home/Home';
import Admin from './components/admin/Admin';
import { localDB } from './database/LocalDB';
import MainLayout from './Layaouts/MainLayout';
import CardDetails from './components/cardDetails/CardDetails';
import UserProfile from './components/userProfile/UserProfile';
import { CategoryProvider } from "./context/CategoryContext";
import { InstrumentProvider } from "./context/InstrumentContext";

// Protected Route Component solo para rutas que requieren autenticación
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = localDB.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <InstrumentProvider>
      <CategoryProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} >
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<CardDetails />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              
              <Route 
      path="/administracion/*" 
      element={
        <ProtectedRoute adminOnly={true}>
          <Admin />
        </ProtectedRoute>
      } 
    />
              
              {/* Rutas de usuario autenticado */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile/>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CategoryProvider>
    </InstrumentProvider>
  );
}

export default App;