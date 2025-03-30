import { useState, useEffect } from 'react';
import { useAuthState } from '../../context/AuthContext';
import UserDropdown from '../userProfile/UserDropdown';

const AuthButtons = () => {
    const { getCurrentUser } = useAuthState();
    const [user, setUser] = useState(null);

    // Efecto para mantener sincronizado el estado del usuario
    useEffect(() => {
        const checkUser = () => {
            const currentUser = getCurrentUser();
            setUser(currentUser);
        };

        // Verificar estado inicial
        checkUser();

        // Crear un intervalo para verificar cambios
        const interval = setInterval(checkUser, 1000);

        // Limpiar intervalo al desmontar
        return () => clearInterval(interval);
    }, [getCurrentUser]);

    const handleAuth = (type) => {
        window.location.href = `/${type}`;
    };

    if (user) {
        return <UserDropdown />;
    }

    return (
        <div className="flex gap-4">
            <button
                onClick={() => handleAuth('register')}
                className="border-2 border-[#9C6615] text-[#9C6615] hover:bg-[#9C6615] hover:text-white font-semibold sm:text-xs md:text-sm py-2 px-4 rounded shadow-sm transition-colors duration-200"
            >
                Crear Cuenta
            </button>
            <button
                onClick={() => handleAuth('login')}
                className="bg-[#9F7933] hover:bg-[#523E1A] text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
            >
                Iniciar Sesión
            </button>
        </div>
    );
};

export default AuthButtons;