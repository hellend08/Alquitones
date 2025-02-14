import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';

const AuthButtons = () => {
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

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                    Bienvenido, {user.username}
                </span>
                <button
                    onClick={handleLogout}
                    className="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
                >
                    Cerrar Sesión
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            <button
                onClick={() => handleAuth('register')}
                className="bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
            >
                Crear Cuenta
            </button>
            <button
                onClick={() => handleAuth('login')}
                className="border-2 border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white font-semibold py-2 px-4 rounded shadow-sm transition-all duration-200"
            >
                Iniciar Sesión
            </button>
        </div>
    );
};

export default AuthButtons;