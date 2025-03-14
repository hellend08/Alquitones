import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { localDB } from '../../database/LocalDB';
import SearchResults from './SearchResults';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

    // Establecer la fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];

    // Función para generar un array de todas las fechas en un rango (INCLUSIVO)
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate || startDate);
        
        currentDate.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        // Modificado para incluir la fecha final
        while (currentDate <= end) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    };

    const handleSearch = () => {
        const allProducts = localDB.getAllProducts();
        
        // Filtrar por término de búsqueda
        let filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Filtrar por disponibilidad de fechas si hay fechas seleccionadas
        if (startDate) {
            const datesInRange = getDatesInRange(startDate, endDate);
            
            filteredProducts = filteredProducts.filter(product => {
                // Si no tiene datos de disponibilidad, no lo incluimos
                if (!product.availability || product.availability.length === 0) return false;

                // Verificar disponibilidad en TODAS las fechas del rango
                return datesInRange.some(date => {
                    const availItem = product.availability.find(a => a.date === date);
                    return availItem && availItem.availableQuantity > 0;
                });
            });

            // Añadir detalles de disponibilidad para las fechas seleccionadas
            filteredProducts = filteredProducts.map(product => {
                const availabilityDetails = datesInRange
                    .map(date => {
                        const availItem = product.availability?.find(a => a.date === date);
                        return {
                            date,
                            availableQuantity: availItem ? availItem.availableQuantity : 0
                        };
                    })
                    .filter(detail => detail.availableQuantity > 0);

                return {
                    ...product,
                    availabilityDetails
                };
            });
        }

        setSearchResults(filteredProducts);
        setShowResults(true);
        onSearch({
            products: filteredProducts, 
            dateRange: startDate ? { startDate, endDate } : null
        });
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Realizar búsqueda inmediata si hay texto
        if (value.trim()) {
            handleSearch();
        } else {
            // Si no hay texto, ocultar resultados
            setSearchResults(null);
            setShowResults(false);
        }
    };

    const handleResultSelect = (selectedResult) => {
        // Si se selecciona un resultado, establecer el término de búsqueda
        if (selectedResult) {
            setSearchTerm(selectedResult.name);
            setShowResults(false);
            // Opcionalmente, podrías realizar la búsqueda específica del producto
            handleSearch();
        } else {
            // Si es null, significa clic fuera del componente
            setShowResults(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
        setShowResults(true);
    };

    return (
        <div className="max-w-lg mx-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col mx-4 lg:mx-0 gap-3">
                {/* Fechas */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                        <input 
                            type="date" 
                            id="start-date"
                            min={today}
                            value={startDate}
                            onChange={(e) => {
                                const newDate = e.target.value;
                                setStartDate(newDate);
                                // Ajustar fecha final si es necesario
                                if (endDate && newDate > endDate) {
                                    setEndDate(newDate);
                                }
                                handleSearch(); // Buscar al cambiar fechas
                            }}
                            className="p-2.5 w-full text-sm text-gray-900 border border-white bg-white rounded-lg"
                            placeholder="Fecha inicio"
                        />
                    </div>
                    <div className="flex-1">
                        <input 
                            type="date" 
                            id="end-date"
                            min={startDate || today}
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                handleSearch(); // Buscar al cambiar fechas
                            }}
                            className="p-2.5 w-full text-sm text-gray-900 border border-white bg-white rounded-lg"
                            placeholder="Fecha fin"
                        />
                    </div>
                </div>

                {/* Búsqueda de producto */}
                <div className="flex">
                    <input 
                        type="search" 
                        id="search-dropdown" 
                        className="p-2.5 w-full text-sm text-gray-900 border-s-2 border border-white bg-white rounded-s-lg" 
                        placeholder="Busca tu instrumento" 
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                    <button 
                        type="submit" 
                        className="top-0 end-0 p-2.5 text-sm font-medium h-full bg-gray-100 hover:bg-gray-200 
                            border border-gray-300 rounded-r-lg"
                    >
                        <span className="material-symbols-outlined text-gray-600">search</span>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </form>
            
            <SearchResults 
                results={searchResults} 
                isVisible={showResults && searchResults !== null && searchResults.length > 0}
                onResultSelect={handleResultSelect}
            />
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchBar;