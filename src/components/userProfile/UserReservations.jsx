import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import RatingForm from "../ratings/RatingForm";

const UserReservations = () => {
    const [user, setUser] = useState(null);
    const { getCurrentUser } = useAuthState();
    const [loading, setLoading] = useState(true);
    const [userReservations, setUserReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                fetchUserReservations(currentUser.id);
            }
            setLoading(false);
        };

        checkUser();
    }, [getCurrentUser]);

    const fetchUserReservations = async (userId) => {
        try {
            setReservationsLoading(true);
            const response = await apiService.getUserReservations(userId);

            if (response?.data && Array.isArray(response.data)) {
                console.log("Reservas obtenidas:", response.data);
                setUserReservations(response.data);
                setFilteredReservations(response.data);
            } else {
                console.error("Formato de respuesta inválido:", response);
                setUserReservations([]);
                setFilteredReservations([]);
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setUserReservations([]);
        } finally {
            setReservationsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        try {
            // Crea una nueva fecha en la zona horaria del usuario
            const date = new Date(dateString);

            // Verifica que la fecha sea válida
            if (isNaN(date.getTime())) {
                return dateString;
            }

            // Usar toLocaleDateString para formatear según la zona horaria local
            return date.toLocaleDateString('es-UY', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone: 'UTC' // Importante: usar UTC para evitar desfases
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString;
        }
    };

    // Función para traducir el estado de la reserva a un texto más amigable
    const getStatusLabel = (status) => {
        if (!status) return "Desconocido";

        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return "En curso";
            case 'ENDED':
                return "Finalizada";
            case 'CANCELLED':
                return "Cancelada";
            case 'CONFIRMED':
                return "Confirmada";
            case 'PENDING':
                return "Pendiente";
            default:
                return status;
        }
    };

    // Función para determinar si una reserva se puede valorar
    const canRateReservation = (reservation) => {
        return reservation.status && reservation.status.toUpperCase() === 'ENDED';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9F7933]"></div>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const openRatingModal = (reservation) => {
        if (!reservation.instrumentId) {
            alert("No se puede puntuar este instrumento (ID no disponible)");
            return;
        }

        if (!canRateReservation(reservation)) {
            alert("Solo puedes valorar reservas finalizadas");
            return;
        }

        setSelectedInstrument({
            id: reservation.instrumentId,
            name: reservation.instrumentName || `Instrumento ${reservation.instrumentId}`
        });

        setShowRatingModal(true);
    };

    const handleRatingSubmit = async (ratingData) => {
        try {
            const ratingPayload = {
                instrumentId: Number(selectedInstrument.id),
                userId: Number(user.id),
                stars: Number(ratingData.stars),
                comment: ratingData.comment || ""
            };

            console.log("Enviando valoración:", ratingPayload);

            await apiService.submitRating(ratingPayload);

            await fetchUserReservations(user.id);

            alert(`✅ Valoración enviada correctamente para ${selectedInstrument.name}`);
            setShowRatingModal(false);
        } catch (error) {
            console.error("Error al enviar valoración:", error);
            alert(`❌ Error: ${error.message || "No se pudo enviar la valoración"}`);
        }
    };

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        if (!searchValue.trim()) {
            // Si la búsqueda está vacía, mostrar todas las reservas
            setFilteredReservations(userReservations);
            return;
        }

        // Filtrar reservas que coincidan con el término de búsqueda
        const filtered = userReservations.filter(reservation => {
            // Buscar en el nombre del instrumento
            const instrumentName = (reservation.instrumentName || '').toLowerCase();
            // Buscar en el estado
            const status = (reservation.status || '').toLowerCase();
            // Buscar en la categoría
            const category = (reservation.category || '').toLowerCase();
            // Buscar en fechas (formato dd/mm/yyyy)
            const startDate = reservation.startDate ? formatDate(reservation.startDate).toLowerCase() : '';
            const endDate = reservation.endDate ? formatDate(reservation.endDate).toLowerCase() : '';

            return instrumentName.includes(searchValue) ||
                status.includes(searchValue) ||
                category.includes(searchValue) ||
                startDate.includes(searchValue) ||
                endDate.includes(searchValue);
        });

        setFilteredReservations(filtered);
    };

    function calcularDias(fechaInicio, fechaFin) {
        // Crear objetos Date con las fechas
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        // Convertir a UTC para evitar problemas con horario de verano
        const inicioUTC = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
        const finUTC = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate());

        // Calcular la diferencia en milisegundos y convertir a días
        return Math.floor((finUTC - inicioUTC) / (1000 * 60 * 60 * 24));
    }

    // Ordenar reservas en orden inverso (más recientes primero)
    const orderedReservations = [...filteredReservations].sort((a, b) => {
        const dateA = new Date(a.startDate || "");
        const dateB = new Date(b.startDate || "");
        return dateB - dateA; // Orden descendente (inverso)
    });

    const totalReservations = userReservations.length;
    const filteredTotal = filteredReservations.length;

    return (
        <div className="container mx-auto p-4 md:p-6 bg-[#f4f4f4]">
            {/* Encabezado de la página */}
            <div className="bg-gradient-to-r from-[#9F7933] to-[#B89347] text-white py-12 shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Historial de Reservas
                            </h1>
                            <p className="text-lg mt-2 text-white">
                                Consulta y gestiona tus reservas en AlquiTones
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda con contador */}
            <div className="mb-6">
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Buscar reserva"
                            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-[#9F7933] focus:ring-1 focus:ring-[#9F7933]"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            search
                        </span>
                    </div>
                    <div className="px-4 py-2 text-sm text-[#523E1A]">
                        {filteredTotal} de {totalReservations} {totalReservations === 1 ? 'reserva' : 'reservas'}
                    </div>
                </div>
            </div>

            {/* Listado de reservas */}
            {reservationsLoading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9C6615]"></div>
                </div>
            ) : (
                orderedReservations.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        {searchTerm ? (
                            <>
                                <span className="material-symbols-outlined text-4xl text-[#9F7933] mb-3">
                                    search_off
                                </span>
                                <h2 className="text-xl font-medium text-[#001F3F] mb-2">No se encontraron resultados</h2>
                                <p className="text-[#523E1A] mb-6">No hay reservas que coincidan con "{searchTerm}"</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilteredReservations(userReservations);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-[#9F7933] text-white rounded-lg hover:bg-[#523E1A] transition"
                                >
                                    Ver todas las reservas
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl text-[#9F7933] mb-3">
                                    calendar_today
                                </span>
                                <h2 className="text-xl font-medium text-[#001F3F] mb-2">No tienes reservas actualmente</h2>
                                <p className="text-[#523E1A] mb-6">Explora nuestra colección de instrumentos y reserva uno hoy</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center px-4 py-2 bg-[#9F7933] text-white rounded-lg hover:bg-[#523E1A] transition"
                                >
                                    Explorar instrumentos
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orderedReservations.map((reservation) => {
                            const isRatable = canRateReservation(reservation);
                            const statusClass = isRatable ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";

                            return (
                                <div key={reservation.id || `reservation-${Math.random()}`} className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Imagen del instrumento */}
                                        <div className="md:w-48 h-48 p-4 flex items-center justify-center bg-white">
                                            <img
                                                src={reservation.instrumentImage || "/images/placeholder-instrument.jpg"}
                                                alt={reservation.instrumentName || "Instrumento"}
                                                className="max-h-full max-w-full object-contain"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/images/placeholder-instrument.jpg";
                                                }}
                                            />
                                        </div>

                                        {/* Información de la reserva */}
                                        <div className="flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
                                            <div className="flex flex-col flex-grow">
                                                <div className="flex flex-col md:flex-row md:justify-between">
                                                    <div>
                                                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${statusClass} mb-2`}>
                                                            {getStatusLabel(reservation.status)}
                                                        </div>
                                                        <h2 className="text-lg font-medium text-[#001F3F]">
                                                            {reservation.instrumentName || `Instrumento ${reservation.instrumentId || ""}`}
                                                        </h2>
                                                        <p className="text-sm text-[#523E1A] mb-2">
                                                            {reservation.category || "Sin categoría"}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 md:mt-0">
                                                        <div className="text-gray-500 text-sm">
                                                            {reservation.provider || "ALQUITONES"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="font-medium text-gray-800 my-1">
                                                    {`Período: ${formatDate(reservation.startDate)} al ${formatDate(reservation.endDate)}`}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Días: {reservation.days ||
                                                        (reservation.startDate && reservation.endDate ?
                                                            calcularDias(reservation.startDate, reservation.endDate) : "7"
                                                        )}
                                                </p>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-2 mt-4">
                                                <button
                                                    onClick={() => openRatingModal(reservation)}
                                                    className={`text-white flex items-center justify-center px-4 py-2 rounded transition
                                                        ${isRatable ?
                                                            "bg-[#9F7933] hover:bg-[#523E1A] cursor-pointer" :
                                                            "bg-gray-400 cursor-not-allowed opacity-70"
                                                        }`}
                                                    disabled={!isRatable}
                                                >
                                                    <span className="material-symbols-outlined text-sm mr-1">star</span>
                                                    {isRatable ? "Valorar" : "Reserva en curso"}
                                                </button>

                                                {!isRatable && (
                                                    <p className="text-xs text-gray-500 mt-1 md:ml-2 self-center">
                                                        Solo puedes valorar reservas finalizadas
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* Modal de puntuación */}
            {showRatingModal && selectedInstrument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#413620]">
                                Valorar {selectedInstrument.name}
                            </h3>
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <RatingForm
                            instrumentId={selectedInstrument.id}
                            userId={user.id}
                            onRatingSubmitted={handleRatingSubmit}
                            onCancel={() => setShowRatingModal(false)}
                            existingRating={null}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserReservations;