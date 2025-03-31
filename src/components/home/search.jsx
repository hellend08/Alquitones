// SearchBar.jsx con navegación de meses mejorada
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';


import SearchResults from './SearchResults';

const SearchBar = ({ onSearch, products: products, getAvailabilityById }) => {
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

    const handleSearch = async () => {
        const allProducts = products;

        // Filtrar por término de búsqueda
        let filteredProducts = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Filtrar por disponibilidad de fechas si hay fechas seleccionadas
        if (startDate) {
            const datesInRange = getDatesInRange(startDate, endDate || startDate);

            // Crear un array de promesas para obtener la disponibilidad de cada producto
            const availabilityPromises = filteredProducts.map(async (product) => {
                try {
                    const availability = await getAvailabilityById(product.id, startDate, endDate);
                    return {
                        ...product,
                        availability
                    };
                } catch (error) {
                    console.error(`Error al obtener disponibilidad para el producto ${product.id}:`, error);
                    return {
                        ...product,
                        availability: []
                    };
                }
            });

            // Esperar a que todas las promesas se resuelvan
            const productsWithAvailability = await Promise.all(availabilityPromises);

            // Filtrar productos basados en la disponibilidad
            filteredProducts = productsWithAvailability
                .filter(({ availability }) => {

                    if (!availability || availability.length === 0) return true;

                    return datesInRange.some(date => {
                        const availItem = availability.find(a => a.date === date);
                        return availItem && availItem.availableStock > 0;
                    });
                });

            // Añadir detalles de disponibilidad para las fechas seleccionadas
            filteredProducts = filteredProducts.map(product => {
                const availabilityDetails = datesInRange
                    .map(date => {
                        const availItem = product.availability?.find(a => a.date === date);
                        return {
                            date,
                            availableStock: availItem ? availItem.availableStock : 0
                        };
                    })
                    .filter(detail => detail.availableStock > 0);

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
            const allProducts = products
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
    console.log("Results", searchResults);

    return (
        <div className="max-w-lg mx-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col mx-4 lg:mx-0 gap-3">
                {/* Selector de rango de fechas con estilo AlquiTones */}
                <div className="flex items-center relative">
                    <div className="bg-white p-1 rounded-md shadow-sm w-full transition-all duration-300">
                        <div
                            className="flex items-center justify-between w-full bg-white rounded-md border border-gray-300 cursor-pointer p-3 hover:bg-[#FFF8E8] transition-all"
                            onClick={toggleDatepicker}
                        >
                            <div className="flex items-center">
                                <span className="material-symbols-outlined text-[#9C6615] mr-2">calendar_month</span>
                                <span className="text-sm text-[#413620] font-medium">
                                    {startDate ? formatDateForDisplay(startDate) : 'Seleccionar fechas'}
                                </span>
                            </div>
                            {startDate && (
                                <div className="flex items-center">
                                    <span className="text-sm text-[#413620] font-medium">
                                        {endDate ? formatDateForDisplay(endDate) : 'Seleccionar'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Datepicker - mantener la misma estructura para preservar funcionalidad */}
                    {showDatepicker && (
                        <div
                            ref={datePickerRef}
                            className="absolute top-full left-0 z-10 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-full max-w-2xl"
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
                                                    dayClass += " bg-[#9C6615] text-white rounded-full"; // Cambiado a color AlquiTones
                                                } else if (isInRange || isHovered) {
                                                    dayClass += " bg-[#FFE8C0]"; // Cambiado a color AlquiTones
                                                } else {
                                                    dayClass += " hover:bg-gray-100";
                                                }

                                                // Si es hoy
                                                if (date.toDateString() === today.toDateString()) {
                                                    if (!isStart && !isEnd) {
                                                        dayClass += " border border-[#9C6615]"; // Cambiado a color AlquiTones
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
                                                    dayClass += " bg-[#9C6615] text-white rounded-full"; // Cambiado a color AlquiTones
                                                } else if (isInRange || isHovered) {
                                                    dayClass += " bg-[#FFE8C0]"; // Cambiado a color AlquiTones
                                                } else {
                                                    dayClass += " hover:bg-gray-100";
                                                }

                                                // Si es hoy
                                                if (date.toDateString() === today.toDateString()) {
                                                    if (!isStart && !isEnd) {
                                                        dayClass += " border border-[#9C6615]"; // Cambiado a color AlquiTones
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
                                <div className="text-sm text-[#413620]"> {/* Color actualizado */}
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
                                        className="px-3 py-1 text-sm bg-white text-[#413620] border border-[#9C6615] rounded-md hover:bg-[#FFE8C0]" // Colores AlquiTones
                                        onClick={() => {
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                    >
                                        Limpiar
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1 text-sm bg-[#9C6615] text-white rounded-md hover:bg-[#9F7933]" // Colores AlquiTones
                                        onClick={() => setShowDatepicker(false)}
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Búsqueda de producto con estilo AlquiTones */}
                <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
                    <div className="flex bg-white overflow-hidden">
                        <input
                            type="search"
                            id="search-dropdown"
                            className="p-2.5 w-full text-sm text-[#413620] bg-transparent outline-none"
                            placeholder="Busca tu instrumento"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                        <button
                            type="submit"
                            className="p-2.5 text-sm font-medium h-full bg-[#FDD85D] hover:bg-[#FFE8C0] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[#413620]">search</span>
                            <span className="sr-only">Search</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Resultados de búsqueda */}
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