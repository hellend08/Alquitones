// src/components/ratings/RatingForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { apiService } from '../../services/apiService';
import { useEffect } from 'react';

const RatingForm = ({ instrumentId, userId, onRatingSubmitted, existingRating, onCancel }) => {
  const [rating, setRating] = useState(existingRating?.stars || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [instrumentName, setInstrumentName] = useState('');

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const instrument = await apiService.getInstrumentById(instrumentId);
        setInstrumentName(instrument.name);
      } catch (error) {
        console.error("Error cargando instrumento:", error);
      }
    };

    if (instrumentId) fetchInstrument();
  }, [instrumentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Por favor, selecciona una puntuación');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ratingData = {
        instrumentId: parseInt(instrumentId),
        userId: parseInt(userId),
        stars: rating,
        comment: comment.trim()
      };

      await apiService.submitRating(ratingData);
      setLoading(false);

      if (onRatingSubmitted) {
        onRatingSubmitted(ratingData);
      }
    } catch (err) {
      console.error('Error al enviar valoración:', err);
      setError('No se pudo enviar la valoración. Inténtalo de nuevo más tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <h3 className="text-lg font-medium text-(--color-secondary) mb-4">
      {existingRating ? 'Editar valoración' : 'Valorar instrumento'}
      {instrumentName && `: ${instrumentName}`} {/* Usamos instrumentName aquí */}
    </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Puntuación</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl focus:outline-none transition-transform hover:scale-110"
                aria-label={`${star} estrellas`}
              >
                <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {rating === 1 && "Malo"}
              {rating === 2 && "Regular"}
              {rating === 3 && "Bueno"}
              {rating === 4 && "Muy bueno"}
              {rating === 5 && "Excelente"}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Comentario (opcional)
          </label>
          <textarea
            id="comment"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-(--color-primary) focus:border-transparent resize-none"
            placeholder="Comparte tu experiencia con este instrumento..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-(--color-secondary) text-white rounded-md hover:bg-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed"
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
              existingRating ? 'Actualizar valoración' : 'Enviar valoración'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

RatingForm.propTypes = {
  instrumentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onRatingSubmitted: PropTypes.func,
  existingRating: PropTypes.shape({
    stars: PropTypes.number,
    comment: PropTypes.string
  }),
  onCancel: PropTypes.func
};

export default RatingForm;