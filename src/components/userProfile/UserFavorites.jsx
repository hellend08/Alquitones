// src/components/user/Favorites.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from '../../context/AuthContext';
import { useCategoryState } from '../../context/CategoryContext';

// Paleta de colores AlquiTones
// --color-primary: #9F7933;
// --color-secondary: #001F3F;
// --color-tertiary: #523E1A;
// --color-quaternary: #FDD85D;
// --color-quinary: #FFE8C0;

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { getCurrentUser, toggleFavorite } = useAuthState();
    const { categories } = useCategoryState();
    const navigate = useNavigate();

    // Efectos
    useEffect(() => {
        const checkUserAndLoadFavorites = async () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                // Obtener los favoritos del localStorage o contexto
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                
                // Añadimos logs para depuración
                console.log("Estructura de favoritos cargados:", storedFavorites);
                
                // Intentar normalizar la estructura de los favoritos
                const normalizedFavorites = storedFavorites.map(instrument => {
                    // Si el instrumento tiene objeto category pero no categoryId
                    if (instrument.category && !instrument.categoryId) {
                        if (typeof instrument.category === 'object' && instrument.category.id) {
                            return { ...instrument, categoryId: instrument.category.id };
                        }
                    }
                    
                    return instrument;
                });
                
                setFavorites(normalizedFavorites);
                setFilteredFavorites(normalizedFavorites);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar favoritos:', error);
                setLoading(false);
            }
        };

        checkUserAndLoadFavorites();
    }, [getCurrentUser, navigate]);

    // Filtrar favoritos cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm) {
            const filtered = favorites.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFavorites(filtered);
        } else {
            setFilteredFavorites(favorites);
        }
    }, [searchTerm, favorites]);

    const handleRemoveFavorite = async (instrument) => {
        try {
            await toggleFavorite(instrument);
            // Actualizar el estado local después de eliminar
            setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== instrument.id));
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
        }
    };

    const handleRateInstrument = (instrumentId) => {
        // Redirigir a la página de calificación o abrir un modal
        navigate(`/detail/${instrumentId}`);
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9F7933]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 bg-[#f4f4f4]">
            {/* Encabezado de la página */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-[#001F3F]">Favoritos</h1>
            </div>

            {/* Pestañas de navegación */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex">
                    <div className="border-b-2 border-[#9F7933] text-[#001F3F] py-2 px-4 font-medium">
                        Mis favoritos
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda con contador */}
            <div className="mb-6">
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Buscar en mis favoritos"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#9F7933] focus:ring-1 focus:ring-[#9F7933]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            search
                        </span>
                    </div>
                    <div className="px-4 py-2 text-sm text-[#523E1A]">
                        {filteredFavorites.length} de {favorites.length} favoritos
                    </div>
                </div>
            </div>

            {/* Lista de favoritos */}
            {filteredFavorites.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="inline-block p-3 rounded-full bg-[#FFE8C0] mb-4">
                        <span className="material-symbols-outlined text-4xl text-[#9F7933]">favorite</span>
                    </div>
                    <h2 className="text-xl font-medium text-[#001F3F] mb-2">No tienes instrumentos favoritos</h2>
                    <p className="text-[#523E1A] mb-6">Explora nuestro catálogo y agrega tus instrumentos favoritos aquí.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-[#9F7933] text-white rounded-lg hover:bg-[#523E1A] transition"
                    >
                        Explorar instrumentos
                    </Link>
                </div>
            ) : (
                filteredFavorites.map(instrument => (
                    <div key={instrument.id} className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition">
                        <div className="flex flex-col md:flex-row">
                            {/* Imagen del producto */}
                            <div className="md:w-48 h-48 p-4 flex items-center justify-center bg-white">
                                <img 
                                    src={instrument.mainImage} 
                                    alt={instrument.name} 
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            
                            {/* Información del producto */}
                            <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                                <div className="flex flex-col flex-grow">
                                    <div className="flex flex-col md:flex-row md:justify-between">
                                        <div>
                                            <h2 className="text-lg font-medium text-[#001F3F] hover:text-[#9F7933]">
                                                <Link to={`/detail/${instrument.id}`}>{instrument.name}</Link>
                                            </h2>
                                            <p className="text-sm text-[#523E1A] mb-2">
                                                Categoría: {getCategoryName(instrument.categoryId) || getCategoryName(instrument.category)}
                                            </p>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span className="text-lg font-bold text-[#001F3F]">
                                                ${instrument.pricePerDay.toFixed(2)}
                                                <span className="text-sm font-normal text-[#523E1A]">/día</span>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[#523E1A] my-3 text-sm line-clamp-2">
                                        {instrument.description}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-2 mt-4">
                                    <Link 
                                        to={`/detail/${instrument.id}`}
                                        className="flex items-center justify-center px-4 py-2 bg-[#9F7933] text-white rounded hover:bg-[#523E1A] transition"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                                        Ver instrumento
                                    </Link>
                                    
                                    <button 
                                        onClick={() => handleRemoveFavorite(instrument)}
                                        className="flex items-center justify-center px-4 py-2 border border-gray-300 text-[#001F3F] rounded hover:bg-[#FFE8C0] transition ml-auto"
                                    >
                                        <span className="material-symbols-outlined text-sm mr-1">delete</span>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorites;