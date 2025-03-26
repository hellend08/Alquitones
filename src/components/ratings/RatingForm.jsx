import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const RatingForm = ({ instrumentId, userId, onRatingSubmitted, onCancel, existingRating = null }) => {
    const [rating, setRating] = useState({
        stars: existingRating?.stars || 0,
        comment: existingRating?.comment || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        // Si hay una valoración existente, la cargamos
        if (existingRating) {
            setRating({
                stars: existingRating.stars,
                comment: existingRating.comment
            });
        }
    }, [existingRating]);

    const handleStarClick = (stars) => {
        setRating(prev => ({ ...prev, stars }));
    };

    const handleStarHover = (stars) => {
        setHoveredStar(stars);
    };

    const handleStarLeave = () => {
        setHoveredStar(0);
    };

    const handleCommentChange = (e) => {
        setRating(prev => ({ ...prev, comment: e.target.value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
          // Validación
          if (rating.stars === 0) {
              throw new Error('Por favor, selecciona una puntuación');
          }
  
          // Datos limpios siempre como números
          const ratingData = {
              instrumentId: Number(instrumentId),
              userId: Number(userId),
              stars: Number(rating.stars),
              comment: rating.comment || ""
          };
  
          console.log("Enviando valoración desde formulario:", ratingData);
  
          // Enviar a través del callback proporcionado o directamente
          if (onRatingSubmitted) {
              await onRatingSubmitted(ratingData);
          } else {
              await apiService.submitRating(ratingData);
              alert('¡Valoración enviada con éxito!');
          }
  
          setLoading(false);
      } catch (error) {
          console.error('Error al enviar valoración:', error);
          setError(error.message || 'Error al enviar la valoración');
          setLoading(false);
      }
  };

    // Componente para las estrellas
    const StarRating = () => {
        return (
            <div 
                className="flex items-center mb-4" 
                onMouseLeave={handleStarLeave}
            >
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => handleStarHover(star)}
                    >
                        {(hoveredStar || rating.stars) >= star ? (
                            <span className="text-yellow-400">★</span>
                        ) : (
                            <span className="text-gray-300">☆</span>
                        )}
                    </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    {rating.stars > 0 ? `${rating.stars} de 5 estrellas` : 'Sin puntuar'}
                </span>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntuación
                </label>
                <StarRating />
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario (opcional)
                </label>
                <textarea
                    id="comment"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary)"
                    placeholder="Escribe tu opinión sobre este instrumento..."
                    value={rating.comment}
                    onChange={handleCommentChange}
                />
            </div>

            <div className="flex justify-end space-x-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-primary) transition"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </span>
                    ) : (
                        'Enviar valoración'
                    )}
                </button>
            </div>
        </form>
    );
};

export default RatingForm;