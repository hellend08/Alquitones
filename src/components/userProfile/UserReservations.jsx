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
    const [reservationsLoading, setReservationsLoading] = useState(true);
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
            } else {
                console.error("Formato de respuesta inválido:", response);
                setUserReservations([]);
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
            setUserReservations([]);
        } finally {
            setReservationsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    return (
        <>
            {/* Header con bienvenida y dropdown */}
            <div className="bg-gradient-to-r from-[#9F7933] to-[#B89347] text-white py-12 shadow-md">
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
                        <div className="mt-4 md:mt-0 flex items-center">

                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                {/* Tabla de reservas */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#523E1A] text-white py-3 px-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Todas Mis Reservas</h2>
                        {!reservationsLoading && (
                            <span className="bg-white text-[#523E1A] text-sm px-2 py-1 rounded-full">
                                {userReservations.length} {userReservations.length === 1 ? 'reserva' : 'reservas'}
                            </span>
                        )}
                    </div>

                    {reservationsLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9C6615]"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {userReservations?.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-[#FFE8C0]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Instrumento</th>
                                            <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Categoría</th>
                                            <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Estado</th>
                                            <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Fecha Inicio</th>
                                            <th className="px-6 py-3 text-left text-[#413620] text-sm font-semibold">Fecha Fin</th>
                                            <th className="px-6 py-3 text-center text-[#413620] text-sm font-semibold">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {userReservations.map((reservation) => (
                                            <tr key={`res-${reservation.id || Math.random().toString(36).substr(2, 9)}`} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            className="w-10 h-10 object-cover rounded mr-3"
                                                            src={reservation.instrumentImage || "/images/placeholder-instrument.jpg"}
                                                            alt={reservation.instrumentName || "Instrumento"}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "/images/placeholder-instrument.jpg";
                                                            }}
                                                        />
                                                        <span className="text-[#413620] font-medium">
                                                            {reservation.instrumentName || `Instrumento ${reservation.instrumentId || ""}`}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[#413620]">
                                                    {reservation.category || "Sin categoría"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${(reservation.status || "").toLowerCase() === "reservado"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : (reservation.status || "").toLowerCase() === "finalizado"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {reservation.status || "Reservado"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[#413620]">
                                                    {reservation.startDate ? formatDate(reservation.startDate) : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-[#413620]">
                                                    {reservation.endDate ? formatDate(reservation.endDate) : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button
                                                        className="bg-[#9C6615] text-white px-3 py-1 rounded-md text-sm hover:bg-[#9F7833] transition"
                                                        onClick={() => openRatingModal(reservation)}
                                                    >
                                                        Puntuar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center">
                                    <span className="material-symbols-outlined text-5xl text-gray-400 mb-3">calendar_today</span>
                                    <p className="text-lg text-gray-500">No tienes reservas actualmente</p>
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="mt-4 bg-[#9C6615] text-white px-4 py-2 rounded-md hover:bg-[#9F7833] transition-colors"
                                    >
                                        Explorar instrumentos
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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