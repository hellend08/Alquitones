import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';

const AuthButtons = () => {
    const [user, setUser] = useState(null);

    // Efecto para mantener sincronizado el estado del usuario
    useEffect(() => {
        const checkUser = () => {
            const currentUser = localDB.getCurrentUser();
            setUser(currentUser);
        };

        // Verificar estado inicial
        checkUser();

        // Crear un intervalo para verificar cambios
        const interval = setInterval(checkUser, 1000);

        // Limpiar intervalo al desmontar
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localDB.logout();
        setUser(null); // Actualizar estado local inmediatamente
        window.location.href = '/login';
    };

    const handleAuth = (type) => {
        window.location.href = `/${type}`;
    };


    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div>
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-gray-600 dark:text-gray-300">{user.username[0]}</span>
                    </div>
                    <span className="text-gray-700 font-medium">
                        {user.username}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-(--color-secondary) hover:bg-(--color-primary) text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
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
                className="border-2 border-(--color-secondary) text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-2 px-4 rounded shadow-sm transition-colors duration-200"
            >
                Crear Cuenta
            </button>
            <button
                onClick={() => handleAuth('login')}
                className="bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
            >
                Iniciar Sesión
            </button>
        </div>
    );
};

export default AuthButtons;