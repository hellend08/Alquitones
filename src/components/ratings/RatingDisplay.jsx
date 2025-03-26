// src/components/ratings/RatingDisplay.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiService } from '../../services/apiService';

const RatingDisplay = ({ instrumentId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const data = await apiService.getRatingsByInstrument(instrumentId);
        setRatings(data || []);
        
        // Calcular promedio de valoraciones
        if (data && data.length > 0) {
          const sum = data.reduce((total, rating) => total + rating.stars, 0);
          setAverageRating((sum / data.length).toFixed(1));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 text-sm mb-4">
        {error}
      </div>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-gray-500 text-center my-4">
        Este instrumento aún no tiene valoraciones.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-bold text-(--color-secondary) mb-4">
        Valoraciones de usuarios
      </h3>
      
      <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="text-4xl font-bold text-(--color-secondary) mr-4">
          {averageRating}
        </div>
        <div>
          <div className="flex text-yellow-400 text-xl mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= Math.round(averageRating) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            Basado en {ratings.length} {ratings.length === 1 ? 'valoración' : 'valoraciones'}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {ratings.map((rating, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= rating.stars ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <div className="text-gray-500 text-sm">
                {rating.createdAt && new Date(rating.createdAt).toLocaleDateString()}
              </div>
            </div>
            {rating.comment && (
              <p className="text-gray-700 italic">{rating.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

RatingDisplay.propTypes = {
  instrumentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default RatingDisplay;