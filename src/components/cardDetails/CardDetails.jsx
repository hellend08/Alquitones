// src/components/cardDetails/CardDetails.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { localDB } from '../../database/LocalDB';
import Characteristics from './Characteristics';
import AvailabilityCalendar from './AvailabilityCalendar';

function CardDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedDates, setSelectedDates] = useState(null);
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    const [availabilityError, setAvailabilityError] = useState(null);

    useEffect(() => {
        const product = localDB.getProductById(parseInt(id));
        if (product) {
            setInstrument(product);
            loadSuggestions(parseInt(id));
            getCategories();
            window.scrollTo(0, 0);
            setLoadingAvailability(false);
        } else {
            setAvailabilityError("No se pudo cargar la información del producto");
        }
        
        // Verificar si el usuario está autenticado
        const currentUser = localDB.getCurrentUser();
        setIsAuthenticated(!!currentUser);
    }, [id]);

    const loadSuggestions = (currentId) => {
        try {
            let allProducts = localDB.getAllProducts().filter(p => p.id !== currentId);
            allProducts = allProducts.sort(() => Math.random() - 0.5);
            setSuggestions(allProducts.slice(0, 2));
        } catch (error) {
            console.error("Error al cargar sugerencias:", error);
        }
    };

    const getCategories = () => {
        try {
            const categoriesDB = localDB.getAllCategories();
            setCategories(categoriesDB);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name || "Sin categoría";
    };

    const handleDateSelect = (dates) => {
        setSelectedDates(dates);
    };

    // Calcular el precio total basado en las fechas seleccionadas
    const calculateTotalPrice = () => {
        if (!selectedDates || !selectedDates.startDate || !instrument) return 0;
        
        const start = new Date(selectedDates.startDate);
        const end = selectedDates.endDate ? new Date(selectedDates.endDate) : start;
        
        // Calcular la diferencia en días
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusivo
        
        return (instrument.pricePerDay * diffDays).toFixed(2);
    };

    // Manejar el error de carga
    const handleRetryAvailability = () => {
        setLoadingAvailability(true);
        setAvailabilityError(null);
        
        // Simular una nueva carga
        setTimeout(() => {
            const product = localDB.getProductById(parseInt(id));
            if (product) {
                setInstrument(product);
                setLoadingAvailability(false);
            } else {
                setAvailabilityError("No se pudo cargar la información del producto");
                setLoadingAvailability(false);
            }
        }, 1000);
    };

    if (!instrument && !loadingAvailability && !availabilityError) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    // Obtener solo las primeras 5 imágenes para la vista principal
    const mainViewImages = instrument?.images?.slice(0, 5) || [];
    // Obtener todas las imágenes para la galería
    const allImages = instrument?.images || [];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-(--color-secondary)">
                    {instrument?.name} <span className="text-gray-500 text-sm">cod {instrument?.id}</span>
                </h1>
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-(--color-secondary) cursor-pointer text-2xl">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>
            
            {/* Vista principal - Solo 5 imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {mainViewImages.length > 0 && (
                    <>
                        <img src={mainViewImages[0]} alt={instrument.name} className="w-full h-96 object-cover rounded-lg" />
                        <div className="grid grid-cols-2 gap-2 md:col-span-2">
                            {mainViewImages.slice(1, 5).map((img, index) => (
                                <img key={index} src={img} alt={`Miniatura ${index}`} className="w-full h-47 object-cover rounded-lg" />
                            ))}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowGallery(true)} 
                                    className="absolute -right-40 md:-right-52 lg:-right-80 bottom-8 cursor-pointer border bg-white text-(--color-secondary) px-4 py-2 rounded-lg shadow-lg hover:bg-(--color-primary) hover:text-white transition"
                                >
                                    Ver más 👁
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Sección de Disponibilidad */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow mb-6">
                <h2 className="text-xl font-bold text-(--color-secondary) mb-4">Disponibilidad</h2>
                
                {loadingAvailability ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-(--color-primary)"></div>
                    </div>
                ) : availabilityError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-red-500 mb-2">{availabilityError}</div>
                        <button 
                            onClick={handleRetryAvailability}
                            className="bg-white text-(--color-secondary) border border-(--color-secondary) px-4 py-1 rounded-md hover:bg-(--color-sunset) transition"
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                ) : (
                    <AvailabilityCalendar 
                        availability={instrument.availability || []} 
                        onSelect={handleDateSelect}
                    />
                )}
            </div>

            <div className="mt-6 p-6 bg-white rounded-lg shadow md:flex justify-between items-start md:gap-3">
                <section className="md:w-[70%]">
                    <h2 className="text-xl font-bold text-(--color-secondary)">Características</h2>
                    <div className="mb-6 mt-3">
                        {instrument?.specifications && (
                            <Characteristics specifications={instrument.specifications}/>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-(--color-secondary)">Descripción</h2>
                        <p className="text-(--color-secondary) text-base m-3">
                            {instrument?.description}
                        </p>
                    </div>
                </section>
                
                <div className="flex flex-col gap-4 md:w-[30%]">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-lg font-semibold">Precio por día: 
                            <span className="text-green-600 ml-2">${instrument?.pricePerDay?.toFixed(2)}</span>
                        </p>
                        
                        {selectedDates && selectedDates.startDate && (
                            <div className="mt-4 bg-(--color-sunset) bg-opacity-30 p-3 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Resumen de reserva</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Desde:</span>
                                    <span className="font-medium">{selectedDates.startDate}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Hasta:</span>
                                    <span className="font-medium">{selectedDates.endDate || selectedDates.startDate}</span>
                                </div>
                                <div className="border-t border-gray-300 my-2"></div>
                                <div className="flex justify-between font-medium">
                                    <span>Total:</span>
                                    <span className="text-green-600">${calculateTotalPrice()}</span>
                                </div>
                            </div>
                        )}
                    
                        {isAuthenticated ? (
                            <button 
                                className={`w-full mt-4 py-2 px-4 rounded-lg text-white font-medium transition
                                    ${selectedDates && selectedDates.startDate 
                                        ? 'bg-(--color-secondary) hover:bg-(--color-primary) cursor-pointer' 
                                        : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!selectedDates || !selectedDates.startDate}
                            >
                                {selectedDates && selectedDates.startDate 
                                    ? 'Reservar ahora' 
                                    : 'Selecciona fechas para reservar'}
                            </button>
                        ) : (
                            <div className="mt-4 text-center">
                                <div className="flex flex-col items-center text-center">
                                    <span className="material-symbols-outlined text-3xl text-(--color-secondary) mb-2">lock</span>
                                    <h3 className="text-lg font-semibold text-(--color-secondary) mb-2">Accede a tu cuenta para reservar</h3>
                                    
                                    <button
                                        onClick={() => window.location.href = '/login'}
                                        className="bg-(--color-secondary) hover:bg-(--color-primary) text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 mb-3 w-full"
                                    >
                                        Iniciar sesión
                                    </button>
                                    
                                    <p className="text-sm">
                                        ¿No tienes cuenta? <a href="/register" className="text-(--color-secondary) underline">Crea una aquí</a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <h2 className="mt-10 text-xl font-bold text-(--color-secondary)">Sugerencias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {suggestions.map((product) => (
                    <div key={product.id} className="bg-white shadow-md rounded-lg">
                        <img src={product.mainImage} alt={product.name} className="h-48 w-96 mx-auto object-contain rounded-t-lg" />
                        <div className="p-5 border-t border-gray-300">
                            <h3 className="text-xl font-bold tracking-tight text-(--color-secondary)">{product.name}</h3>
                            <h6 className="font-semibold text-xs my-1 text-gray-400">{getCategoryName(product.categoryId)}</h6>
                            <p className="mb-3 font-normal text-sm text-gray-500">{product.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <div>
                                    <p className="text-xs">Precio por día</p>
                                    <p className="text-lg font-semibold text-(--color-secondary)">${product.pricePerDay.toFixed(2)}</p>
                                </div>
                                <Link to={`/detail/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-(--color-primary) rounded-lg hover:bg-(--color-secondary) transition">
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Galería - Todas las imágenes */}
            {showGallery && (
                <div className="fixed inset-0 bg-black/75 transition-opacity flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full disabled:opacity-75 md:h-[510px] 2xl:h-auto overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Galería de Imágenes</h2>
                            <button onClick={() => setShowGallery(false)} className="text-gray-500 hover:text-gray-700"> ✖ </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {allImages.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt={`Imagen ${index + 1}`} 
                                    className="w-full md:col-span-2 h-47 object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardDetails;