// App.jsx

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Home from './components/home/Home';
import Admin from './components/admin/Admin';
import MainLayout from './Layaouts/MainLayout';
import CardDetails from './components/cardDetails/CardDetails';
import Reservation from './components/cardDetails/Reservation';
import UserProfile from './components/userProfile/UserProfile';
import { CategoryProvider } from "./context/CategoryContext";
import { InstrumentProvider } from "./context/InstrumentContext";
import { UserProvider } from "./context/UserContext";
import { AuthProvider, useAuthState } from "./context/AuthContext";

// Protected Route Component solo para rutas que requieren autenticación
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { getCurrentUser } = useAuthState();
  const user =  getCurrentUser();
  console.log("user", user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log("user", user);
  
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
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
                  
                  {/* Ruta de Reserva (protegida) */}
                  <Route 
                    path="/reservation/:id" 
                    element={
                      <ProtectedRoute>
                        <Reservation />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/administracion/*" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <UserProvider>
                          <Admin /> 
                        </UserProvider>
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
    </AuthProvider>
  );
}

export default App;