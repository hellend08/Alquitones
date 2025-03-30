import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const { getCurrentUser } = useAuthState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };

        checkUser();
    }, [getCurrentUser]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9C6615]"></div>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const firstName = user.username ? user.username.split(" ")[0] : "";

    return (
        <>
            {/* Header con bienvenida y dropdown - Color más claro */}
            <div className="bg-gradient-to-r from-[#9F7933] to-[#B89347] text-white py-12 shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Hola {firstName}
                                <span className="inline-block animate-pulse mx-1">👋</span>
                            </h1>
                            <p className="text-lg mt-2 text-white">
                                Bienvenido a tu espacio personal en AlquiTones
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Información Personal */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                    <div className="bg-[#B89347] text-white py-3 px-6">
                        <h2 className="text-xl font-semibold">Información Personal</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Nombre</span>
                                <span className="text-[#413620] font-medium text-lg">{user.username || "No disponible"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Email</span>
                                <span className="text-[#413620] font-medium text-lg">{user.email || "No disponible"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Rol</span>
                                <span className="text-[#413620] font-medium text-lg">{user.role || "No disponible"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-sm">Miembro desde</span>
                                <span className="text-[#413620] font-medium text-lg">{user.createdAt ? formatDate(user.createdAt) : "No disponible"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#B89347] text-white py-3 px-6">
                            <h2 className="text-xl font-semibold">Mis Favoritos</h2>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-[#B89347] mb-3">favorite</span>
                            <p className="text-[#413620] text-lg mb-4">Accede a tus instrumentos favoritos</p>
                            <button
                                onClick={() => navigate('/favoritos')}
                                className="bg-[#B89347] text-white px-4 py-2 rounded-md hover:bg-[#9F7933] transition-colors"
                            >
                                Ver Favoritos
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-[#B89347] text-white py-3 px-6">
                            <h2 className="text-xl font-semibold">Mis Reservas</h2>
                        </div>
                        <div className="p-6 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-[#B89347] mb-3">calendar_month</span>
                            <p className="text-[#413620] text-lg mb-4">Gestiona tus reservas de instrumentos</p>
                            <button
                                onClick={() => navigate('/reservas')} // Cambiado a /reservas para coincidir con la ruta en el componente de perfil
                                className="bg-[#B89347] text-white px-4 py-2 rounded-md hover:bg-[#9F7933] transition-colors"
                            >
                                Ver mis reservas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;