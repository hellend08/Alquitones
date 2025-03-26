// src/components/cardDetails/Reservation.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInstrumentState } from "../../context/InstrumentContext";
import { useAuthState } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import WhatsAppChat from '../crossSections/WhatsAppChat';

function Reservation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getInstrumentById } = useInstrumentState();
    const { getCurrentUser, isAuthenticated } = useAuthState();
    const [selectedDates, setSelectedDates] = useState({
        startDate: localStorage.getItem('reservationStartDate') || '',
        endDate: localStorage.getItem('reservationEndDate') || ''
    });
    const [currentUser, setCurrentUser] = useState(null);
    const [reservationNote, setReservationNote] = useState('');
    const [reservationSuccess, setReservationSuccess] = useState(false);

    useEffect(() => {
        // Comprobar si el usuario está autenticado
        const user = getCurrentUser();
        if (!user) {
            navigate('/login', { state: { from: `/reservation/${id}` } });
            return;
        }
        setCurrentUser(user);

        // Obtener los datos del instrumento
        const fetchData = async () => {
            setLoading(true);
            try {
                const product = await getInstrumentById(parseInt(id));
                setInstrument(product);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar instrumento:', err);
                setError('No se pudo cargar la información del producto');
                setLoading(false);
            }
        };

        fetchData();

        // Comprobar si hay fechas seleccionadas en localStorage
        if (!localStorage.getItem('reservationStartDate')) {
            setError('No se han seleccionado fechas para la reserva');
        }
    }, [id, navigate, getCurrentUser, getInstrumentById]);

    // Calcular el número total de días
    const calculateTotalDays = () => {
        if (!selectedDates.startDate || !selectedDates.endDate) return 1;

        const [startYear, startMonth, startDay] = selectedDates.startDate.split('-').map(Number);
        const [endYear, endMonth, endDay] = selectedDates.endDate.split('-').map(Number);

        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);

        const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día
        return Math.round(Math.abs((end - start) / oneDay)) + 1; // +1 para incluir ambos días
    };

    // Calcular precio total
    const calculateTotalPrice = () => {
        if (!instrument) return 0;
        const totalDays = calculateTotalDays();
        return (instrument.pricePerDay * totalDays).toFixed(2);
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validaciones adicionales
            if (!selectedDates.startDate) {
                throw new Error('Fecha de inicio no seleccionada');
            }

            if (!instrument) {
                throw new Error('No se ha cargado la información del instrumento');
            }

            if (!currentUser || !currentUser.id) {
                throw new Error('Información de usuario no disponible');
            }

            // Construir el objeto de reserva
            const reservationData = {
                instrumentId: instrument.id,
                userId: currentUser.id,
                startDate: selectedDates.startDate,
                endDate: selectedDates.endDate,
                quantity: 1, // Por defecto 1 unidad
                notes: reservationNote
            };

            console.log('Enviando datos de reserva:', reservationData);

            // Llamar a la API para crear la reserva
            const result = await apiService.createReservation(reservationData);
            console.log('Reserva creada exitosamente:', result);

            // Limpiar localStorage después de hacer la reserva
            localStorage.removeItem('reservationStartDate');
            localStorage.removeItem('reservationEndDate');

            // Mostrar mensaje de éxito
            setReservationSuccess(true);
            setLoading(false);
        } catch (err) {
            console.error('Error al crear reserva:', err);

            // Mensaje de error más específico si está disponible
            const errorMessage = err.response?.data?.message || err.message || 'No se pudo completar la reserva. Por favor, intenta de nuevo.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100 min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--color-primary)"></div>
            </div>
        );
    }

    if (error && !reservationSuccess) {
        return (
            <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Ha ocurrido un error</h2>
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate(`/detail/${id}`)}
                            className="bg-(--color-secondary) text-white px-4 py-2 rounded-lg hover:bg-(--color-primary) transition"
                        >
                            Volver al detalle del producto
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (reservationSuccess) {
        return (
            <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">¡Reserva completada con éxito!</h2>
                    <p className="text-gray-700 mb-6">Hemos enviado un correo electrónico con los detalles de tu reserva.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Volver al inicio
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="bg-(--color-secondary) text-white px-4 py-2 rounded-lg hover:bg-(--color-primary) transition"
                        >
                            Ver mis reservas
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100">
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-(--color-secondary) cursor-pointer">
                    <span className="material-symbols-outlined mr-1">arrow_back</span>
                    Volver
                </button>
            </div>

            <h1 className="text-2xl font-bold text-(--color-secondary) mb-6">Finalizar tu reserva</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Detalles del producto */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h2 className="text-xl font-bold text-(--color-secondary) mb-4">Detalles del producto</h2>

                        {instrument && (
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                    <img
                                        src={instrument.mainImage}
                                        alt={instrument.name}
                                        className="w-full h-48 md:h-64 object-cover rounded-lg shadow-sm"
                                    />
                                </div>
                                <div className="md:w-2/3">
                                    <h3 className="text-xl font-semibold text-(--color-secondary)">{instrument.name}</h3>

                                    {instrument.category && (
                                        <div className="text-sm text-gray-500 mb-2">
                                            Categoría: {typeof instrument.category === 'object' ? instrument.category.name : 'Instrumento musical'}
                                        </div>
                                    )}

                                    <div className="border-t border-gray-100 my-3"></div>

                                    <p className="text-gray-600 mb-4 text-sm">{instrument.description}</p>

                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-3">Detalles de la reserva</h4>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Precio por día:</div>
                                                <div className="font-semibold text-lg">${instrument.pricePerDay?.toFixed(2)}</div>
                                            </div>

                                            <div>
                                                <div className="text-sm text-gray-500">Días totales:</div>
                                                <div className="font-semibold text-lg">{calculateTotalDays()}</div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                                            <div className="text-sm text-gray-500 mb-1 sm:mb-0">Período de reserva:</div>
                                            <div className="font-medium bg-gray-50 border border-gray-100 px-3 py-1 rounded-md inline-flex items-center">
                                                <span className="material-symbols-outlined text-xs text-gray-500 mr-1">calendar_today</span>
                                                {selectedDates.startDate}
                                                {selectedDates.endDate && (
                                                    <>
                                                        <span className="mx-2 text-gray-400">→</span>
                                                        <span className="material-symbols-outlined text-xs text-gray-500 mr-1">calendar_today</span>
                                                        {selectedDates.endDate}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {instrument.specifications && instrument.specifications.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Información destacada:</h4>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {instrument.specifications.slice(0, 4).map((spec, idx) => (
                                                        <li key={idx} className="text-sm flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs text-(--color-secondary)">check_circle</span>
                                                            <span>
                                                                <strong>{spec.specification.name}:</strong> {spec.spValue}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Información del usuario */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-(--color-secondary) mb-4">Datos del usuario</h2>

                        {currentUser && (
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-gray-600 mb-2">Información personal:</h3>
                                    <div className="flex flex-col md:flex-row md:justify-between bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="mb-2 md:mb-0">
                                            <div className="font-medium">
                                                {currentUser.firstName && currentUser.lastName
                                                    ? `${currentUser.firstName} ${currentUser.lastName}`
                                                    : currentUser.username
                                                        ? currentUser.username
                                                        : currentUser.name
                                                            ? currentUser.name
                                                            : "Usuario"}
                                            </div>
                                            <div className="text-gray-500 text-sm mt-1">
                                                <i className="fas fa-envelope mr-1"></i> {currentUser.email}
                                            </div>
                                            {currentUser.phone && (
                                                <div className="text-gray-500 text-sm mt-1">
                                                    <i className="fas fa-phone mr-1"></i> {currentUser.phone}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="text-sm text-(--color-secondary) hover:underline flex items-center"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <span className="material-symbols-outlined text-sm mr-1">edit</span>
                                            Editar información
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="reservation-note" className="block text-gray-600 mb-2">
                                        Notas adicionales (opcional):
                                    </label>
                                    <textarea
                                        id="reservation-note"
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                                        rows="4"
                                        placeholder="Información adicional para el proveedor..."
                                        value={reservationNote}
                                        onChange={(e) => setReservationNote(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resumen y confirmación */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                        <h2 className="text-xl font-bold text-(--color-secondary) mb-4">Resumen de reserva</h2>

                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Precio por día:</span>
                                <span className="font-medium">${instrument?.pricePerDay?.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Días:</span>
                                <span className="font-medium">{calculateTotalDays()}</span>
                            </div>

                            <div className="flex justify-between font-medium">
                                <span className="text-gray-600">Subtotal:</span>
                                <span>${calculateTotalPrice()}</span>
                            </div>
                        </div>

                        <div className="flex justify-between font-bold text-lg mb-6">
                            <span>Total:</span>
                            <span className="text-(--color-secondary)">${calculateTotalPrice()}</span>
                        </div>

                        <button
                            className="w-full py-3 bg-(--color-secondary) text-white font-medium rounded-lg hover:bg-(--color-primary) transition flex items-center justify-center gap-2"
                            onClick={handleReservationSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    <span>Confirmar reserva</span>
                                </>
                            )}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Al confirmar, aceptas nuestros términos y condiciones de alquiler.
                        </p>
                    </div>
                </div>
            </div>
            <WhatsAppChat />
        </div>
    );
}

export default Reservation;