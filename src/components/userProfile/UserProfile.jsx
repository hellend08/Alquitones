import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import RatingForm from "../ratings/RatingForm";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const { getCurrentUser, favorites, toggleFavorite } = useAuthState();
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
    }, []);

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
    const handleNavigation = (path) => {
        navigate(path);
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
                <p className="text-xl">Cargando...</p>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleRemoveFavorite = async (favorite) => {
        try {
            await toggleFavorite(favorite);
        }
        catch (error) {
            alert(error.message);
        }
    };

    const openRatingModal = (reservation) => {
        if (!reservation.instrumentId) {
            alert("Este instrumento no puede ser puntuado");
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
            await apiService.submitRating({
                instrumentId: selectedInstrument.id,
                userId: user.id,
                stars: ratingData.stars,
                comment: ratingData.comment.trim()
            });

            await fetchUserReservations(user.id);
            alert(`✅ Valoración enviada para ${selectedInstrument.name}`);
            setShowRatingModal(false);
        } catch (error) {
            alert(`❌ Error: ${error.message || "No se pudo enviar la valoración"}`);
        }
    };


    const handleCancelReservation = async (reservationId) => {
        if (!reservationId) {
            alert("No se puede cancelar esta reserva");
            return;
        }

        const confirmCancel = window.confirm(
            "¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        );

        if (!confirmCancel) return;

        try {
            setReservationsLoading(true);
            await apiService.cancelReservation(reservationId);

            // Actualiza las reservas después de cancelar
            await fetchUserReservations(user.id);

            alert("✅ Reserva cancelada exitosamente");
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
            alert(`❌ Error: ${error.message || "No se pudo cancelar la reserva"}`);
        } finally {
            setReservationsLoading(false);
        }
    };

    const firstName = user.username ? user.username.split(" ")[0] : "";

    return (
        <>
            <div className="bg-(--color-primary) text-white text-center py-15">
                <h1 className="text-4xl font-bold">Hola {firstName}, ¡buenas tardes!</h1>
                <p className="text-lg mt-2">¡Te damos la bienvenida a tu perfil!</p>
            </div>

            {/* Información Personal */}
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
                        <td className="px-4 py-2">{user.createdAt ? formatDate(user.createdAt) : "No disponible"}</td>
                    </tr>
                </tbody>
            </table>

            {/* Botones principales */}
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

            {/* Favoritos */}
            <div className="container mx-auto py-8 md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 text-center mt-8">Productos Favoritos</h3>
                <div className="overflow-x-auto mt-8">
                    <table className="min-w-full bg-white border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-(--color-primary) text-white">
                                <th className="px-4 py-2 text-center">Imagen</th>
                                <th className="px-4 py-2 text-center">Nombre</th>
                                <th className="px-4 py-2 text-center">Precio por dia</th>
                                <th className="px-4 py-2 text-center">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.length > 0 ? favorites.map((favorite) => (
                                <tr key={`fav-${favorite.id || Math.random().toString(36).substr(2, 9)}`}>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">
                                        <img
                                            className="w-10 h-10 object-cover mx-auto"
                                            src={favorite.mainImage || "/images/placeholder-instrument.jpg"}
                                            alt={favorite.name || "Instrumento"}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/placeholder-instrument.jpg";
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">{favorite.name || "Instrumento sin nombre"}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">${favorite.pricePerDay || "N/A"}</td>
                                    <td className="px-4 py-2 border-b border-gray-300 text-center">
                                        <span className="material-symbols-outlined cursor-pointer" onClick={() => handleRemoveFavorite(favorite)}>delete</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                        No tienes instrumentos favoritos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tabla de reservas mejorada */}
                <h3 className="text-xl font-semibold text-gray-800 text-center mt-12">Tus Reservas</h3>
                {reservationsLoading ? (
                    <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-(--color-primary)"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto mt-8">
                        {userReservations?.length > 0 ? (
                            <table className="min-w-full bg-white border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-(--color-primary) text-white">
                                        <th className="px-4 py-2 text-center">Imagen</th>
                                        <th className="px-4 py-2 text-center">Nombre</th>
                                        <th className="px-4 py-2 text-center">Categoría</th>
                                        <th className="px-4 py-2 text-center">Estado</th>
                                        <th className="px-4 py-2 text-center">Fecha Inicio</th>
                                        <th className="px-4 py-2 text-center">Fecha Fin</th>
                                        <th className="px-4 py-2 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userReservations.map((reservation) => (
                                        <tr key={`res-${reservation.id || Math.random().toString(36).substr(2, 9)}`}>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                <img
                                                    className="w-10 h-10 object-cover mx-auto"
                                                    src={reservation.instrumentImage || "/images/placeholder-instrument.jpg"}
                                                    alt={reservation.instrumentName || "Instrumento"}
                                                    onError={(e) => {
                                                        e.target.onerror = null; // Prevent infinite loop
                                                        e.target.src = "/images/placeholder-instrument.jpg";
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {reservation.instrumentName || `Instrumento ${reservation.instrumentId || ""}`}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {reservation.category || "Sin categoría"}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${(reservation.status || "").toLowerCase() === "reservado"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : (reservation.status || "").toLowerCase() === "finalizado"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}>
                                                    {reservation.status || "Reservado"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {reservation.startDate ? formatDate(reservation.startDate) : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {reservation.endDate ? formatDate(reservation.endDate) : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 text-center border-b border-gray-300">
                                                {(reservation.status || "").toLowerCase() === "finalizado" && (
                                                    <button
                                                        className="bg-(--color-secondary) text-white px-2 py-1 rounded-md text-xs hover:bg-(--color-primary)"
                                                        onClick={() => openRatingModal(reservation)}
                                                    >
                                                        Puntuar
                                                    </button>
                                                )}
                                                {(reservation.status || "").toLowerCase() === "reservado" && (
                                                    <button
                                                        className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600"
                                                        onClick={() => handleCancelReservation(reservation.id)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">calendar_today</span>
                                <p className="text-gray-500">No tienes reservas actualmente</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-4 text-(--color-secondary) hover:underline"
                                >
                                    Explorar instrumentos disponibles
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de puntuación */}
            {showRatingModal && selectedInstrument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Valorar {selectedInstrument.name}</h3>
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

export default UserProfile;