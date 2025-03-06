import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';

const AuthButtons = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

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

    const avatarName = () => {
        const name = user.username.split(" ");
        const firstName = name[0] ? name[0][0].toUpperCase() : "";
        const lastName = name[1] ? name[1][0].toUpperCase() : "";
        return `${firstName}${lastName ? lastName : ""}`;
    }



    if (user) {
        return (
            <div className="flex items-center ">
                <div className="flex items-center min-w-32" onClick={handleClick}>
                    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-(--color-primary) rounded-full ">
                        <span className="text-xl text-white">{avatarName()}</span>
                    </div>
                    <span className="text-(--color-secundary) font-medium pl-2">
                        {user.username.split(" ")[0]}
                    </span>
                </div>

                {isOpen && (
                    <div className={`absolute z-10 bg-white sm:border sm:border-gray-200 rounded-lg sm:shadow-lg sm:max-h-60 overflow-y-auto text-sm mx-1 p-2 font-normal text-(--color-secondary) w-full md:w-auto ${user.role === 'admin' ? 'mt-45' : 'mt-35'}`}>
                        {user.role === 'admin' && (
                            <a className='relative block rounded-lg p-2 px-4' href="/administracion/dashboard">Dashboard</a>
                        )}
                        <a className='relative block rounded-lg p-2 px-4' href="/profile">Mi Perfil</a>
                        <button
                            onClick={handleLogout}
                            className="p-2 px-4 text-red-800">
                            Cerrar Sesión
                        </button>
                    </div>
                )}


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