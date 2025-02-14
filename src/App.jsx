import './App.css';
import Auth from './components/auth/Auth';
import Home from './components/home/Home';

function App() {
  // Determinar qué componente mostrar basado en la URL
  const path = window.location.pathname;

  // Renderizar Auth para rutas de login y registro
  if (path === '/login' || path === '/register') {
    return <Auth />;
  }

  // Por defecto, mostrar Home (que ya incluye el Header)
  return <Home />;
}

export default App;