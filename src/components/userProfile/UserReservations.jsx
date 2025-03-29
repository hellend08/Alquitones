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
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9C6615]"></div>
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
        <>
            {/* Header con bienvenida */}
            <div className="bg-gradient-to-r from-[#9F7933] to-[#9F7833] text-white py-12 shadow-md">
                <div className="container mx-auto px-6">
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

            <div className="container mx-auto py-6 px-4 max-w-6xl">
                {/* Barra de búsqueda y total */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <div className="relative w-full sm:w-80 mb-4 sm:mb-0">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="bg-gray-100 rounded-full py-2 px-4 pl-10 w-full text-gray-700 focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2 text-gray-500">search</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        {searchTerm ?
                            `${filteredTotal} de ${totalReservations} ${totalReservations === 1 ? 'reserva' : 'reservas'}` :
                            `${totalReservations} ${totalReservations === 1 ? 'reserva' : 'reservas'}`}
                    </div>
                </div>

                {/* Listado de reservas (ya no agrupadas por fecha) */}
                {reservationsLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9C6615]"></div>
                    </div>
                ) : (
                    <div>
                        {orderedReservations.length > 0 ? (
                            <div className="space-y-4">
                                {orderedReservations.map((reservation) => {
                                    const isRatable = canRateReservation(reservation);
                                    const statusClass = isRatable ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";

                                    return (
                                        <div key={reservation.id || `reservation-${Math.random()}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                <div className="flex-shrink-0 md:w-1/6 mb-3 md:mb-0">
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${statusClass}`}>
                                                        {getStatusLabel(reservation.status)}
                                                    </div>
                                                    <img
                                                        src={reservation.instrumentImage || "/images/placeholder-instrument.jpg"}
                                                        alt={reservation.instrumentName || "Instrumento"}
                                                        className="w-20 h-20 mt-2 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "/images/placeholder-instrument.jpg";
                                                        }}
                                                    />
                                                </div>

                                                <div className="md:w-3/6 md:px-4">
                                                    <div className="text-gray-500 text-sm">
                                                        {reservation.provider || "ALQUITONES"}
                                                    </div>
                                                    <div className="font-medium text-gray-800 my-1">
                                                        {`Período: ${formatDate(reservation.startDate)} al ${formatDate(reservation.endDate)}`}
                                                    </div>
                                                    <div className="text-gray-700 font-semibold">
                                                        {reservation.instrumentName || `Instrumento ${reservation.instrumentId || ""}`}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {reservation.category || "Sin categoría"} | Días: {reservation.days ||
                                                            (reservation.startDate && reservation.endDate ?
                                                                calcularDias(reservation.startDate, reservation.endDate) : "7"
                                                            )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:w-2/6 mt-3 md:mt-0 justify-center items-center">
                                                    <button
                                                        onClick={() => openRatingModal(reservation)}
                                                        className={`text-white text-center px-6 py-2 rounded-md transition-colors w-full max-w-xs
                                                            ${isRatable ?
                                                                "bg-[#9C6615] hover:bg-[#9F7833] cursor-pointer" :
                                                                "bg-gray-400 cursor-not-allowed opacity-70"
                                                            }`}
                                                        disabled={!isRatable}
                                                    >
                                                        {isRatable ? "Valorar" : "Reserva en curso"}
                                                    </button>

                                                    {!isRatable && (
                                                        <p className="text-xs text-gray-500 mt-1 text-center">
                                                            Solo puedes valorar reservas finalizadas
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                                {searchTerm ? (
                                    <>
                                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">
                                            search_off
                                        </span>
                                        <h3 className="text-xl font-medium text-[#413620] mb-2">No se encontraron resultados</h3>
                                        <p className="text-gray-500 mb-4">No hay reservas que coincidan con "{searchTerm}"</p>
                                        <button
                                            onClick={() => {
                                                setSearchTerm("");
                                                setFilteredReservations(userReservations);
                                            }}
                                            className="bg-[#9C6615] text-white px-6 py-2 rounded-md hover:bg-[#9F7833] transition-colors"
                                        >
                                            Ver todas las reservas
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-3">
                                            calendar_today
                                        </span>
                                        <h3 className="text-xl font-medium text-[#413620] mb-2">No tienes reservas actualmente</h3>
                                        <p className="text-gray-500 mb-6">Explora nuestra colección de instrumentos y reserva uno hoy</p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="bg-[#9C6615] text-white px-6 py-2 rounded-md hover:bg-[#9F7833] transition-colors"
                                        >
                                            Explorar instrumentos
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

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
        </>
    );
};

export default UserReservations;