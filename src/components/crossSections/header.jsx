import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = localDB.getCurrentUser();
        setUser(currentUser);
    }, []);

    const handleLogout = () => {
        localDB.logout();
        window.location.href = '/login';
    };

    const handleAuth = (type) => {
        window.location.href = `/${type}`;
    };

    return (
        <header className="bg-gray-200 p-4 flex justify-between items-center">
            <a href="/" className="flex items-center">
                <img src="/src/assets/alquitonesLogo.png" alt="logo" className="h-12" />
            </a>
            <div>
                {user ? (
                    // Usuario autenticado
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">
                            Bienvenido, {user.username}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="bg-golden hover:bg-golden-light text-white font-bold py-2 px-4 rounded"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    // Usuario no autenticado
                    <div className="flex gap-4">
                        <button 
                            onClick={() => handleAuth('register')}
                            className="bg-golden hover:bg-golden-light text-white font-bold py-2 px-4 rounded"
                        >
                            Crear Cuenta
                        </button>
                        <button 
                            onClick={() => handleAuth('login')}
                            className="border-2 border-golden text-golden hover:bg-golden hover:text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;