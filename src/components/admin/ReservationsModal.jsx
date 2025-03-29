import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import styles from './Admin.module.css';

const ReservationsModal = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' o 'ENDED'
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Cargar todas las reservas al montar el componente
  useEffect(() => {
    loadReservations();
  }, []);

  // Filtrar reservas cuando cambia la búsqueda o la pestaña activa
  useEffect(() => {
    filterReservations();
  }, [searchTerm, activeTab, reservations]);

  // Función principal para cargar reservas - Evita llamadas infinitas
  const loadReservations = async () => {
    // Evitar múltiples llamadas simultáneas
    if (isLoadingData) return;
    
    setLoading(true);
    setError(null);
    setIsLoadingData(true);
    
    try {
      // Obtener todas las reservas de la API
      const response = await apiService.getAllReservations();
      
      if (!response || !response.data) {
        throw new Error('No se recibieron datos de reservas');
      }
      
      // Verificar el formato de los datos
      if (!Array.isArray(response.data)) {
        console.error('Formato incorrecto de datos:', response.data);
        throw new Error('El formato de los datos recibidos es incorrecto');
      }
      
      // Cargar usuarios una sola vez para todos los datos
      const users = await apiService.getUsers().catch(() => []);
      
      // Limitar el número de instrumentos que cargaremos en paralelo
      const enhancedReservations = await enhanceReservationsWithDetails(response.data, users);
      setReservations(enhancedReservations);
      
    } catch (err) {
      console.error('Error al cargar reservas:', err);
      setError('No se pudieron cargar las reservas. Por favor, intente nuevamente.');
      setReservations([]);
    } finally {
      setLoading(false);
      setIsLoadingData(false);
    }
  };

  // Versión optimizada para evitar demasiadas llamadas a la API
  const enhanceReservationsWithDetails = async (reservationsData, users) => {
    if (!Array.isArray(reservationsData) || reservationsData.length === 0) {
      return [];
    }
    
    try {
      // Crear un mapa para evitar cargar el mismo instrumento varias veces
      const instrumentCache = new Map();
      
      // Procesar hasta 5 reservas a la vez para no sobrecargar
      const batchSize = 5;
      const result = [];
      
      for (let i = 0; i < reservationsData.length; i += batchSize) {
        const batch = reservationsData.slice(i, i + batchSize);
        
        // Procesar este lote en paralelo
        const batchPromises = batch.map(async (reservation) => {
          if (!reservation || !reservation.instrumentId || !reservation.userId) {
            console.warn('Reserva con datos incompletos:', reservation);
            return null;
          }
          
          try {
            // Usar caché para evitar cargar el mismo instrumento varias veces
            let instrument;
            if (instrumentCache.has(reservation.instrumentId)) {
              instrument = instrumentCache.get(reservation.instrumentId);
            } else {
              try {
                instrument = await apiService.getInstrumentById(reservation.instrumentId);
                // Guardar en caché para futuras referencias
                instrumentCache.set(reservation.instrumentId, instrument);
              } catch (err) {
                console.warn(`No se pudo obtener el instrumento ${reservation.instrumentId}`);
                instrument = null;
              }
            }
            
            // Encontrar usuario del array precargado
            const user = users.find(u => u.id === reservation.userId) || { 
              username: `Usuario ${reservation.userId}`,
              email: 'Email no disponible'
            };
            
            return {
              ...reservation,
              instrumentName: instrument?.name || `Instrumento ${reservation.instrumentId}`,
              instrumentImage: instrument?.mainImage || (instrument?.images && instrument.images.length > 0 ? instrument.images[0] : null),
              categoryName: instrument?.category?.name || 'Sin categoría',
              userName: user?.username || user?.firstName || `Usuario ${reservation.userId}`,
              userEmail: user?.email || 'Email no disponible',
              totalDays: calculateDaysBetween(reservation.startDate, reservation.endDate)
            };
          } catch (error) {
            console.error(`Error obteniendo detalles para reserva ${reservation.id}:`, error);
            return {
              ...reservation,
              instrumentName: `Instrumento ${reservation.instrumentId}`,
              userName: `Usuario ${reservation.userId}`,
              userEmail: 'Email no disponible',
              totalDays: calculateDaysBetween(reservation.startDate, reservation.endDate)
            };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        result.push(...batchResults.filter(r => r !== null));
      }
      
      return result;
      
    } catch (error) {
      console.error('Error procesando reservas:', error);
      return reservationsData.map(reservation => ({
        ...reservation,
        instrumentName: `Instrumento ${reservation.instrumentId}`,
        userName: `Usuario ${reservation.userId}`
      }));
    }
  };

  // Filtrar reservas según término de búsqueda y pestaña activa
  const filterReservations = () => {
    if (!Array.isArray(reservations) || reservations.length === 0) {
      setFilteredReservations([]);
      return;
    }

    try {
      let filtered = [...reservations];
      
      // Filtrar por estado (pestaña activa)
      filtered = filtered.filter(reservation => 
        reservation.status === activeTab || 
        (typeof reservation.status === 'string' && reservation.status.toUpperCase() === activeTab)
      );
      
      // Filtrar por término de búsqueda
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(reservation => 
          (reservation.instrumentName || '').toLowerCase().includes(term) ||
          (reservation.userName || '').toLowerCase().includes(term) ||
          (reservation.userEmail || '').toLowerCase().includes(term) ||
          (formatDate(reservation.startDate) || '').toLowerCase().includes(term) ||
          (formatDate(reservation.endDate) || '').toLowerCase().includes(term)
        );
      }
      
      // Ordenar por fecha de inicio (más reciente primero)
      filtered.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
        const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
        return dateB - dateA;
      });
      
      setFilteredReservations(filtered);
    } catch (error) {
      console.error('Error al filtrar reservas:', error);
      setFilteredReservations([]);
    }
  };

  // Función para calcular días entre dos fechas
  const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Verificar que las fechas sean válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.warn('Fechas inválidas:', { startDate, endDate });
        return 0;
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays + 1; // +1 para incluir ambos días
    } catch (error) {
      console.error('Error al calcular días entre fechas:', error);
      return 0;
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      
      // Verificar que la fecha sea válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-UY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return dateString;
    }
  };

  // Iniciar proceso de cancelación de reserva
  const handleInitiateCancel = (reservation) => {
    setReservationToCancel(reservation);
    setConfirmCancelModal(true);
  };

  // Confirmar y ejecutar cancelación de reserva
  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;
    
    setProcessingCancel(true);
    setError(null);
    
    try {
      await apiService.cancelReservation(reservationToCancel.id);
      
      // Actualizar el estado local
      const updatedReservations = reservations.map(res => 
        res.id === reservationToCancel.id 
          ? { ...res, status: 'CANCELLED' } 
          : res
      );
      
      setReservations(updatedReservations);
      setSuccessMessage(`La reserva #${reservationToCancel.id} ha sido cancelada exitosamente.`);
      
      // Cerrar modal de confirmación
      setConfirmCancelModal(false);
      
      // Recargar reservas para asegurar datos actualizados
      setTimeout(() => {
        loadReservations();
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      setError(`Error al cancelar la reserva: ${error.message || 'Intente nuevamente'}`);
    } finally {
      setProcessingCancel(false);
      setReservationToCancel(null);
    }
  };

  // Renderizar estado de reserva con estilo apropiado
  const renderReservationStatus = (status) => {
    if (!status) return <span className={styles.statusBadge}>Desconocido</span>;
    
    let statusClass, label;
    
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        statusClass = styles.disponible;
        label = 'Activa';
        break;
      case 'ENDED':
        statusClass = styles.completado;
        label = 'Finalizada';
        break;
      case 'CANCELLED':
        statusClass = styles.mantenimiento;
        label = 'Cancelada';
        break;
      case 'CONFIRMED':
        statusClass = styles.reservado;
        label = 'Confirmada';
        break;
      case 'PENDING':
        statusClass = styles.pendiente;
        label = 'Pendiente';
        break;
      default:
        statusClass = '';
        label = status || 'Desconocido';
    }
    
    return <span className={`${styles.statusBadge} ${statusClass}`}>{label}</span>;
  };
  
  // Agrupar reservas por usuario
  const groupReservationsByUser = () => {
    if (!Array.isArray(filteredReservations)) {
      console.warn('filteredReservations no es un array:', filteredReservations);
      return [];
    }
    
    const groups = {};
    
    filteredReservations.forEach(reservation => {
      if (!reservation || !reservation.userId) {
        console.warn('Reserva sin userId:', reservation);
        return;
      }
      
      const userId = reservation.userId;
      
      if (!groups[userId]) {
        groups[userId] = {
          userId,
          userName: reservation.userName || `Usuario ${userId}`,
          userEmail: reservation.userEmail || 'Email no disponible',
          reservations: []
        };
      }
      
      groups[userId].reservations.push(reservation);
    });
    
    return Object.values(groups);
  };

  // UI para estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  // UI para estado de error
  if (error && !reservations.length) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadReservations}
          className="bg-(--color-primary) text-white px-4 py-2 rounded-lg hover:bg-(--color-secondary) transition"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // Reservas agrupadas por usuario
  const userGroups = groupReservationsByUser();

  return (
    <div className={styles.reservationsContainer}>
      {/* Header con título y búsqueda */}
      <div className={styles.sectionHeader}>
        <h2 className="text-(--color-secondary) text-2xl font-bold">Gestión de Alquileres</h2>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9C9C9C',
              fontSize: '20px'
            }}>
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por usuario, instrumento o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              style={{ paddingLeft: '35px' }}
            />
          </div>
          <button
            onClick={loadReservations}
            className={styles.addButton}
            disabled={isLoadingData}
          >
            {isLoadingData ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Cargando...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt"></i> Actualizar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs para cambiar entre reservas activas y finalizadas */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'ACTIVE' 
            ? 'border-b-2 border-(--color-primary) text-(--color-secondary)'
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ACTIVE')}
        >
          Reservas Activas
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'ENDED' 
            ? 'border-b-2 border-(--color-primary) text-(--color-secondary)'
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ENDED')}
        >
          Reservas Finalizadas
        </button>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Mensaje de error general */}
      {error && reservations.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Contenido principal - Reservas agrupadas por usuario */}
      {userGroups.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">calendar_month</span>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No hay reservas {activeTab === 'ACTIVE' ? 'activas' : 'finalizadas'}</h3>
          <p className="text-gray-500 mb-3">
            {activeTab === 'ACTIVE' 
              ? 'Actualmente no hay reservas activas en el sistema.'
              : 'No se encontraron reservas finalizadas.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-(--color-secondary) underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {userGroups.map(group => (
            <div key={group.userId} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Información del usuario */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-(--color-secondary)">
                      {group.userName}
                    </h3>
                    <p className="text-sm text-gray-500">{group.userEmail}</p>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-gray-500">
                    {group.reservations.length} reserva{group.reservations.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Tabla de reservas del usuario */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instrumento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Días
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      {activeTab === 'ACTIVE' && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {group.reservations.map(reservation => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{reservation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={reservation.instrumentImage || '/path/to/placeholder.jpg'} 
                                alt={reservation.instrumentName} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/path/to/placeholder.jpg';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {reservation.instrumentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reservation.categoryName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(reservation.startDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            al {formatDate(reservation.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.totalDays || calculateDaysBetween(reservation.startDate, reservation.endDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderReservationStatus(reservation.status)}
                        </td>
                        {activeTab === 'ACTIVE' && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleInitiateCancel(reservation)}
                              className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition"
                            >
                              Cancelar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para cancelar reserva */}
      {confirmCancelModal && reservationToCancel && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <button
              onClick={() => {
                setConfirmCancelModal(false);
                setReservationToCancel(null);
              }}
              className={styles.modalClose}
              disabled={processingCancel}
            >
              &times;
            </button>
            <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">
              Confirmar Cancelación
            </h3>
            
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
                </div>
              </div>
              
              <p className="text-center text-gray-700 mb-4">
                ¿Estás seguro que deseas cancelar la siguiente reserva?
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <p className="font-medium">Detalles de la reserva:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="font-medium">Reserva ID:</span> #{reservationToCancel.id}</li>
                  <li><span className="font-medium">Instrumento:</span> {reservationToCancel.instrumentName}</li>
                  <li><span className="font-medium">Usuario:</span> {reservationToCancel.userName}</li>
                  <li><span className="font-medium">Período:</span> {formatDate(reservationToCancel.startDate)} al {formatDate(reservationToCancel.endDate)}</li>
                </ul>
              </div>
              
              <p className="text-sm text-red-600 italic mb-4">
                Esta acción no se puede deshacer. El cliente será notificado sobre la cancelación.
              </p>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setConfirmCancelModal(false);
                    setReservationToCancel(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  disabled={processingCancel}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  disabled={processingCancel}
                >
                  {processingCancel ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Cancelación'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsModal;