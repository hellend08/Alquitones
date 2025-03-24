import React, { useState, useEffect } from "react";
import { localDB } from "../../database/LocalDB";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const { getCurrentUser } = useAuthState();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("likedProducts");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });


    // Datos de ejemplo para arriendos (en una aplicación real, estos vendrían de una API o base de datos)
    const arriendosEjemplo = [
        {
            "ID": 1,
            "Imagen": "https://example.com/images/guitar.jpg",
            "Nombre": "Guitarra Eléctrica",
            "Categoria": "Cuerda",
            "Estado": "Disponible",
            "Duracion": "7 días"
        },
        {
            "ID": 2,
            "Imagen": "https://example.com/images/piano.jpg",
            "Nombre": "Piano Acústico",
            "Categoria": "Teclado",
            "Estado": "En uso",
            "Duracion": "10 días"
        },
        {
            "ID": 3,
            "Imagen": "https://example.com/images/drum.jpg",
            "Nombre": "Batería",
            "Categoria": "Percusión",
            "Estado": "Disponible",
            "Duracion": "5 días"
        },
        {
            "ID": 4,
            "Imagen": "https://example.com/images/violin.jpg",
            "Nombre": "Violín",
            "Categoria": "Cuerda",
            "Estado": "En reparación",
            "Duracion": "3 días"
        },
        {
            "ID": 5,
            "Imagen": "https://example.com/images/trumpet.jpg",
            "Nombre": "Trompeta",
            "Categoria": "Viento",
            "Estado": "Disponible",
            "Duracion": "7 dias"
        }
    ];

    useEffect(() => {
        const checkUser = () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setLoading(false);
        };

        // Verificar estado inicial
        checkUser();
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Cargando...</p>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    //liked products

    const removeFromLikedProducts = (index) => {
        const newLikedProducts = favorites.filter((product, i) => i !== index);
        localStorage.setItem("likedProducts", JSON.stringify(newLikedProducts));
        setFavorites(newLikedProducts);
    };


    // Obtener el primer nombre para el saludo
    const firstName = user.username ? user.username.split(" ")[0] : "";

    return (
        <>
            <div className="bg-(--color-primary) text-white text-center py-15">
                <h1 className="text-4xl font-bold">Hola {firstName}, ¡buenas tardes!</h1>
                <p className="text-lg mt-2">¡Te damos la bienvenida a tu perfil!</p>
            </div>
            <table className="mt-8 container md:w-2/3 mx-auto px-6 py-8">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left font-bold text-2xl">Información Personal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="px-4 py-2 font-semibold">Nombre:</td>
                        <td className="px-4 py-2">{user.username || "No disponible"}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold">Email:</td>
                        <td className="px-4 py-2">{user.email || "No disponible"}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold">Rol:</td>
                        <td className="px-4 py-2">{user.role || "No disponible"}</td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 font-semibold">Te uniste el: </td>
                        <td className="px-4 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "No disponible"}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-8 flex justify-around container md:w-2/3 mx-auto">
                <button
                    onClick={() => handleNavigation('/')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-(--color-primary)"
                >
                    Agendar Arriendo
                </button>
                <button
                    onClick={() => handleNavigation('/')}
                    className="bg-(--color-secondary) text-white px-6 py-2 rounded-lg hover:bg-(--color-primary) flex items-center"
                >
                    Ver Catálogo
                    <span className="material-symbols-outlined pl-4">arrow_forward</span>
                </button>
            </div>

            <div className="container mx-auto py-8 md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 text-center mt-8">Productos Favoritos</h3>
                <div className="overflow-x-auto mt-8">
                    <table className="min-w-full bg-white border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-(--color-primary) text-white">
                                <th className="px-4 py-2 text-center">ID</th>
                                <th className="px-4 py-2 text-center">Imagen</th>
                                <th className="px-4 py-2 text-center">Nombre</th>
                                <th className="px-4 py-2 text-center">Precio por dia</th>
                                <th className="px-4 py-2 text-center">Estado</th>
                                <th className="px-4 py-2 text-center">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.map((likedProducts, index) => (
                                <tr key={likedProducts.ID || index}>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{index + 1}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center"><img className="w-10" src={likedProducts.mainImage} /></td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">{likedProducts.name}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">{likedProducts.pricePerDay}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">{likedProducts.status}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center ">
                                        <span class="material-symbols-outlined" onClick={() => removeFromLikedProducts(index)}>
                                            delete
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mt-12">Últimos 5 Arriendos</h3>
                <div className="overflow-x-auto mt-8">
                    <table className="min-w-full bg-white border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-(--color-primary) text-white  ">
                                <th className="px-4 py-2 text-center">ID</th>
                                <th className="px-4 py-2 text-center">Imagen</th>
                                <th className="px-4 py-2 text-center">Nombre</th>
                                <th className="px-4 py-2 text-center">Categoria</th>
                                <th className="px-4 py-2 text-center">Estado</th>
                                <th className="px-4 py-2 text-center">Duracion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arriendosEjemplo.map((arriendo, index) => (
                                <tr key={arriendo.ID || index}>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{index + 1}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300"><img className="w-10" src={arriendo.Imagen} /></td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{arriendo.Nombre}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{arriendo.Categoria}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{arriendo.Estado}</td>
                                    <td className="px-4 py-2 text-center border-b border-gray-300">{arriendo.Duracion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default UserProfile;