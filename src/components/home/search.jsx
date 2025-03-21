// SearchBar.jsx con navegación de meses mejorada
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { localDB } from '../../database/LocalDB';
import SearchResults from './SearchResults';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [hoveredDate, setHoveredDate] = useState(null);
    const datePickerRef = useRef(null);

    // Para la navegación de meses
    const [viewStartDate, setViewStartDate] = useState(new Date());

    // Establecer la fecha mínima como hoy
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Función para formatear fechas para mostrar al usuario
    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return '';
        try {
            // Crear la fecha a partir del string exacto
            const date = new Date(dateStr + 'T00:00:00');
            // Formatear para mostrar, pero sin alterar el valor original
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            console.error('Error al formatear fecha:', e);
            return dateStr; // Devolver el string original si hay error
        }
    };

    // Función para generar un array de todas las fechas en un rango (INCLUSIVO)
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate || startDate);

        currentDate.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Asegurar que las fechas de inicio y fin estén siempre incluidas
        dates.push(startDate);

        // Si hay fecha final diferente a la inicial, incluirla
        if (endDate && endDate !== startDate) {
            // Añadir fechas intermedias
            while (currentDate < end) {
                currentDate.setDate(currentDate.getDate() + 1);
                const dateStr = currentDate.toISOString().split('T')[0];
                dates.push(dateStr);
            }

            // Asegurar que la fecha final esté incluida
            if (!dates.includes(endDate)) {
                dates.push(endDate);
            }
        }

        return dates;
    };

    useEffect(() => {
        // Manejar clics fuera del datepicker para cerrarlo
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setShowDatepicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        const allProducts = localDB.getAllProducts();

        // Filtrar por término de búsqueda
        let filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Filtrar por disponibilidad de fechas si hay fechas seleccionadas
        if (startDate) {
            const datesInRange = getDatesInRange(startDate, endDate || startDate);

            filteredProducts = filteredProducts.filter(product => {
                // Si no tiene datos de disponibilidad, lo incluimos de todas formas (para mantener compatibilidad)
                if (!product.availability || product.availability.length === 0) return true;

                // Verificar si ALGUNA fecha del rango está disponible
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
            dateRange: startDate ? { 
                startDate: startDate, // Usar valor exacto
                endDate: endDate || startDate // Usar valor exacto
            } : null
        });
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Realizar búsqueda inmediata si hay texto
        if (value.trim()) {
            const allProducts = localDB.getAllProducts();
            const filteredResults = allProducts.filter(product =>
                product.name.toLowerCase().includes(value.toLowerCase()) ||
                product.description.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filteredResults);
            setShowResults(true);
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
        } else {
            // Si es null, significa clic fuera del componente
            setShowResults(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch();
        setShowResults(false);
    };

    const toggleDatepicker = () => {
        setShowDatepicker(!showDatepicker);
        if (!showDatepicker) {
            // Resetear la vista a la fecha actual cuando se abre
            setViewStartDate(new Date());
        }
    };

    // Navegación de meses
    const goToPreviousMonth = () => {
        const newDate = new Date(viewStartDate);
        newDate.setMonth(newDate.getMonth() - 1);

        // No permitir navegar a meses pasados
        if (newDate.getMonth() >= today.getMonth() || newDate.getFullYear() > today.getFullYear()) {
            setViewStartDate(newDate);
        }
    };

    const goToNextMonth = () => {
        const newDate = new Date(viewStartDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewStartDate(newDate);
    };

    // Para generar el calendario
    const generateCalendar = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
        let dayOfWeek = firstDay.getDay();
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const calendar = [];
        let week = [];

        // Días del mes anterior para completar la primera semana
        for (let i = 0; i < dayOfWeek; i++) {
            const prevDate = new Date(year, month, -dayOfWeek + i + 1);
            week.push({
                date: prevDate,
                isCurrentMonth: false,
                isSelectable: false
            });
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelectable = date >= today;
            const dateStr = date.toISOString().split('T')[0];

            week.push({
                date,
                dateStr,
                isCurrentMonth: true,
                isSelectable,
                isStart: dateStr === startDate,
                isEnd: dateStr === endDate,
                isInRange: startDate && endDate &&
                    dateStr >= startDate &&
                    dateStr <= endDate,
                isHovered: hoveredDate &&
                    startDate &&
                    !endDate &&
                    dateStr > startDate &&
                    dateStr <= hoveredDate
            });

            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        // Días del mes siguiente para completar la última semana
        if (week.length > 0) {
            const remainingDays = 7 - week.length;
            for (let i = 1; i <= remainingDays; i++) {
                const nextDate = new Date(year, month + 1, i);
                week.push({
                    date: nextDate,
                    isCurrentMonth: false,
                    isSelectable: false
                });
            }
            calendar.push(week);
        }

        return calendar;
    };

    const handleDateClick = (dateStr, isSelectable) => {
        if (!isSelectable) return;

        if (!startDate || (startDate && endDate) || dateStr < startDate) {
            // Al seleccionar la fecha de inicio, aseguramos que sea exactamente la misma
            const exactDate = dateStr;
            setStartDate(exactDate);
            setEndDate('');
        } else {
            // Al seleccionar la fecha final, aseguramos que sea exactamente la misma
            const exactDate = dateStr;
            setEndDate(exactDate);
            setShowDatepicker(false);

            // Aplicar la búsqueda automáticamente cuando se selecciona el rango completo
            if (startDate) {
                handleSearch();
            }
        }
    };

    const handleDateHover = (dateStr) => {
        if (startDate && !endDate) {
            setHoveredDate(dateStr);
        }
    };

    // Crear calendario para el mes actual y el siguiente según la fecha de vista
    const currentMonth = viewStartDate.getMonth();
    const currentYear = viewStartDate.getFullYear();

    const calendar1 = generateCalendar(currentYear, currentMonth);
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    const calendar2 = generateCalendar(nextMonthDate.getFullYear(), nextMonthDate.getMonth());

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Verificar si se puede navegar hacia atrás (no permitir meses pasados)
    const canGoBack = () => {
        const testDate = new Date(viewStartDate);
        testDate.setMonth(testDate.getMonth() - 1);
        return testDate.getMonth() >= today.getMonth() || testDate.getFullYear() > today.getFullYear();
    };

    return (
        <div className="max-w-lg mx-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col mx-4 lg:mx-0 gap-3">
                {/* Selector de rango de fechas */}
                <div className="flex items-center relative">
                    <div
                        className="flex items-center justify-between w-full bg-white rounded-lg border border-gray-300 cursor-pointer p-2.5"
                        onClick={toggleDatepicker}
                    >
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-500 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                            <span className="text-sm text-gray-700">
                                {startDate || 'Seleccionar fechas'}
                            </span>
                        </div>
                        {startDate && (
                            <div className="flex items-center">
                                <span className="mx-2 text-gray-500">hasta</span>
                                <span className="text-sm text-gray-700">
                                    {endDate || 'Seleccionar'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Datepicker */}
                    {showDatepicker && (
                        <div
                            ref={datePickerRef}
                            className="absolute top-full left-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full max-w-2xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={goToPreviousMonth}
                                    disabled={!canGoBack()}
                                    className={`p-1 rounded-full ${canGoBack() ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <h2 className="text-lg font-medium">Seleccionar fechas</h2>
                                <button
                                    onClick={goToNextMonth}
                                    className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Primer mes */}
                                <div className="w-full md:w-1/2">
                                    <div className="mb-4 text-center">
                                        <span className="text-lg font-medium">
                                            {monthNames[currentMonth]} {currentYear}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Días de la semana */}
                                        {dayNames.map(day => (
                                            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                                                {day}
                                            </div>
                                        ))}

                                        {/* Días del mes */}
                                        {calendar1.flat().map((day, index) => {
                                            const {
                                                date,
                                                dateStr,
                                                isCurrentMonth,
                                                isSelectable,
                                                isStart,
                                                isEnd,
                                                isInRange,
                                                isHovered
                                            } = day;

                                            let dayClass = "h-8 w-8 flex items-center justify-center text-sm";

                                            if (!isCurrentMonth) {
                                                dayClass += " text-gray-400";
                                            } else if (!isSelectable) {
                                                dayClass += " text-gray-400";
                                            } else {
                                                dayClass += " cursor-pointer";

                                                if (isStart || isEnd) {
                                                    dayClass += " bg-blue-600 text-white rounded-full";
                                                } else if (isInRange || isHovered) {
                                                    dayClass += " bg-blue-100";
                                                } else {
                                                    dayClass += " hover:bg-gray-100";
                                                }

                                                // Si es hoy
                                                if (date.toDateString() === today.toDateString()) {
                                                    if (!isStart && !isEnd) {
                                                        dayClass += " border border-blue-600";
                                                    }
                                                }
                                            }

                                            return (
                                                <div
                                                    key={`day1-${index}`}
                                                    className={dayClass}
                                                    onClick={() => handleDateClick(dateStr, isSelectable)}
                                                    onMouseEnter={() => handleDateHover(dateStr)}
                                                >
                                                    {date.getDate()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Segundo mes */}
                                <div className="w-full md:w-1/2">
                                    <div className="mb-4 text-center">
                                        <span className="text-lg font-medium">
                                            {monthNames[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Días de la semana */}
                                        {dayNames.map(day => (
                                            <div key={`next-${day}`} className="text-center text-xs font-medium text-gray-500 py-1">
                                                {day}
                                            </div>
                                        ))}

                                        {/* Días del mes */}
                                        {calendar2.flat().map((day, index) => {
                                            const {
                                                date,
                                                dateStr,
                                                isCurrentMonth,
                                                isSelectable,
                                                isStart,
                                                isEnd,
                                                isInRange,
                                                isHovered
                                            } = day;

                                            let dayClass = "h-8 w-8 flex items-center justify-center text-sm";

                                            if (!isCurrentMonth) {
                                                dayClass += " text-gray-400";
                                            } else if (!isSelectable) {
                                                dayClass += " text-gray-400";
                                            } else {
                                                dayClass += " cursor-pointer";

                                                if (isStart || isEnd) {
                                                    dayClass += " bg-blue-600 text-white rounded-full";
                                                } else if (isInRange || isHovered) {
                                                    dayClass += " bg-blue-100";
                                                } else {
                                                    dayClass += " hover:bg-gray-100";
                                                }

                                                // Si es hoy
                                                if (date.toDateString() === today.toDateString()) {
                                                    if (!isStart && !isEnd) {
                                                        dayClass += " border border-blue-600";
                                                    }
                                                }
                                            }

                                            return (
                                                <div
                                                    key={`day2-${index}`}
                                                    className={dayClass}
                                                    onClick={() => handleDateClick(dateStr, isSelectable)}
                                                    onMouseEnter={() => handleDateHover(dateStr)}
                                                >
                                                    {date.getDate()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Leyenda y botones */}
                            <div className="mt-4 flex justify-between items-center border-t pt-3">
                                <div className="text-sm">
                                    {startDate && (
                                        <span>
                                            {formatDateForDisplay(startDate)}
                                            {endDate && ` - ${formatDateForDisplay(endDate)}`}
                                        </span>
                                    )}
                                </div>
                                <div className="space-x-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100"
                                        onClick={() => {
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        onClick={() => setShowDatepicker(false)}
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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