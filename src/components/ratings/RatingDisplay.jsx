import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const RatingsDisplay = ({ instrumentId }) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchRatings = async () => {
            setLoading(true);
            try {
                const data = await apiService.getRatingsByInstrument(instrumentId);
                
                // Ordenar por fecha de creación (más recientes primero)
                const sortedRatings = Array.isArray(data) 
                    ? [...data].sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
                    : [];
                
                setRatings(sortedRatings);
                
                // Calcular el promedio de estrellas si hay valoraciones
                if (sortedRatings.length > 0) {
                    const total = sortedRatings.reduce((sum, rating) => sum + rating.stars, 0);
                    setAverageRating((total / sortedRatings.length).toFixed(1));
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar valoraciones:', err);
                setError('No se pudieron cargar las valoraciones');
                setLoading(false);
            }
        };

        if (instrumentId) {
            fetchRatings();
        }
    }, [instrumentId]);

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-UY', options);
    };

    // Componente para mostrar estrellas
    const StarDisplay = ({ rating }) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="py-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-(--color-primary)"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-4 text-red-500 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Resumen de valoraciones */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                    <span className="text-3xl font-bold text-(--color-secondary) mr-2">{averageRating}</span>
                    <StarDisplay rating={Math.round(averageRating)} />
                </div>
                <div className="text-gray-600">
                    {ratings.length} {ratings.length === 1 ? 'valoración' : 'valoraciones'}
                </div>
            </div>

            {/* Lista de valoraciones */}
            {ratings.length > 0 ? (
                <div className="space-y-6">
                    {ratings.map((rating) => (
                        <div key={rating.id || `rating-${rating.userId}-${Math.random().toString(36).substring(2)}`} className="border-b border-gray-200 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <StarDisplay rating={rating.stars} />
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(rating.createdAt)}
                                    </div>
                                </div>
                                
                                {/* Se podría agregar información de usuario aquí */}
                                <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    Usuario #{rating.userId}
                                </div>
                            </div>
                            
                            {/* Contenido del comentario */}
                            {rating.comment && (
                                <div className="mt-2 text-gray-700">
                                    {rating.comment}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <span className="text-gray-500">No hay valoraciones disponibles</span>
                    <p className="text-sm text-gray-400 mt-1">Sé el primero en valorar este instrumento</p>
                </div>
            )}
        </div>
    );
};

export default RatingsDisplay;