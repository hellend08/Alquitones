import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";

const UserFavorites = () => {
    const [user, setUser] = useState(null);
    const { getCurrentUser, favorites, toggleFavorite } = useAuthState();
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

    const handleRemoveFavorite = async (favorite) => {
        try {
            await toggleFavorite(favorite);
        }
        catch (error) {
            alert(error.message);
        }
    };

    const firstName = user.username ? user.username.split(" ")[0] : "";

    return (
        <>
            {/* Header con bienvenida y dropdown */}
            <div className="bg-gradient-to-r from-[#9F7933] to-[#B89347] text-white py-12 shadow-md">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Mis Favoritos
                            </h1>
                            <p className="text-lg mt-2 text-white">
                                Gestiona tus instrumentos favoritos en AlquiTones
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                {/* Favoritos */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                    <div className="bg-[#9C6615] text-white py-3 px-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Productos Favoritos</h2>
                        <span className="bg-white text-[#9C6615] text-sm px-2 py-1 rounded-full">
                            {favorites.length} {favorites.length === 1 ? 'instrumento' : 'instrumentos'}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        {favorites.length > 0 ? (
                            <table className="min-w-full">
                                <thead className="bg-[#FFE8C0]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Imagen</th>
                                        <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Nombre</th>
                                        <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Precio por día</th>
                                        <th className="px-6 py-3 text-center text-[#413620] text-sm font-semibold">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {favorites.map((favorite) => (
                                        <tr key={`fav-${favorite.id || Math.random().toString(36).substr(2, 9)}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    className="w-12 h-12 object-cover rounded"
                                                    src={favorite.mainImage || "/images/placeholder-instrument.jpg"}
                                                    alt={favorite.name || "Instrumento"}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/images/placeholder-instrument.jpg";
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#413620]">
                                                {favorite.name || "Instrumento sin nombre"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[#413620] font-semibold">
                                                ${favorite.pricePerDay?.toFixed(2) || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleRemoveFavorite(favorite)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                <span className="material-symbols-outlined text-5xl mb-3">favorite_border</span>
                                <p className="text-lg">No tienes instrumentos favoritos</p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="mt-4 bg-[#9C6615] text-white px-4 py-2 rounded-md hover:bg-[#9F7833] transition-colors"
                                >
                                    Explorar instrumentos
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserFavorites;