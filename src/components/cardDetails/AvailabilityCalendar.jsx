// AvailabilityCalendar.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AvailabilityCalendar = ({ availability = [], onSelect, getAvailabilityById, instrumentId }) => {
    const [availabilityData, setAvailabilityData] = useState(availability);
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [nextMonth, setNextMonth] = useState(
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1, 
          1
        )
    );
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [calendarError, setCalendarError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        // Actualizar el mes siguiente cuando cambia el mes actual
        setNextMonth(new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1, 
            1
        ));
    }, [currentMonth]);
    
    // Navegar al mes anterior
    const goToPreviousMonth = async () => {
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(currentMonth.getMonth() - 1);
        const today = new Date();
        console.log("prevMonth", prevMonth);    
        console.log("currentMonth", currentMonth);
        console.log("nextMonth", nextMonth);
        
        console.log("today", today);

        if (currentMonth.getDate < today.getDate) {
            return;
        }
            
        
        
        // No permitir navegar a meses pasados
        if (prevMonth.getMonth() >= today.getMonth() || prevMonth.getFullYear() > today.getFullYear()) {
            const startDateOfPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() -1 , 1).toISOString().split('T')[0];
            const endDateOfCurrentMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0).toISOString().split('T')[0];
            try {
                const availability = await getAvailabilityById(instrumentId, startDateOfPrevMonth, endDateOfCurrentMonth);
                setAvailabilityData(availability);
            } catch (error) {
                console.error("Error fetching availability:", error);
            }
            setCurrentMonth(prevMonth);
        }
    };

    // Navegar al mes siguiente
    const goToNextMonth = async () => {
        const startDateOfNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() +1 , 1).toISOString().split('T')[0];
        const endDateOfNextNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth()+2, 0).toISOString().split('T')[0];
        console.log("startDateOfNextMonth", startDateOfNextMonth);
        console.log("endDateOfNextNextMonth", endDateOfNextNextMonth);
        try {
            const availability = await getAvailabilityById(instrumentId, startDateOfNextMonth, endDateOfNextNextMonth);
            setAvailabilityData(availability);
        } catch (error) {
            console.error("Error fetching availability:", error);
        }



        const nextMonthDate = new Date(currentMonth);
        nextMonthDate.setMonth(currentMonth.getMonth() + 1);
        setCurrentMonth(nextMonthDate);
    };

    // Formatear la fecha como YYYY-MM-DD para comparar con la disponibilidad
    const formatDateForComparison = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Verificar si una fecha está disponible
    const isDateAvailable = (date, quantity = 1) => {
        if (!availabilityData || availabilityData.length === 0) return false;
        const formattedDate = formatDateForComparison(date);
        const availabilityEntry = availabilityData.find(a => a.date === formattedDate);
        
        // Verificar si la disponibilidad es suficiente para la cantidad solicitada
        return availabilityEntry ? availabilityEntry.availableStock >= quantity : false;
    };

    // Obtener la cantidad disponible para una fecha
    const getAvailableQuantity = (date) => {
        if (!availabilityData || availabilityData.length === 0) return 0;
        const formattedDate = formatDateForComparison(date);
        const availabilityEntry = availabilityData.find(a => a.date === formattedDate);
        return availabilityEntry ? availabilityEntry.availableStock : 0;
    };

    // Verificar si una fecha es seleccionable (no pasada)
    const isDateSelectable = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };


// Verificar si todas las fechas en un rango están disponibles
const isRangeAvailable = (startDate, endDate, quantity = 1) => {
    if (!startDate || !endDate) return true;
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        // Verificar disponibilidad con la cantidad solicitada
        if (!isDateAvailable(currentDate, quantity)) {
            return false;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return true;
};

// Manejar la selección de fechas
const handleDateClick = (date, quantity = 1) => {
    setCalendarError(null);
    
    if (!isDateSelectable(date)) {
        return; // No permitir seleccionar fechas pasadas
    }
    
    if (!isDateAvailable(date, quantity)) {
        setCalendarError(`Esta fecha no tiene suficiente stock disponible (${quantity} unidades)`);
        return;
    }
    
    // Lógica para seleccionar rango
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Si no hay fecha inicial o ambas fechas ya están seleccionadas, iniciar nueva selección
        setSelectedStartDate(date);
        setSelectedEndDate(null);
    } else {
        // Si ya hay fecha inicial pero no final
        if (date < selectedStartDate) {
            // Si la nueva fecha es anterior a la fecha de inicio, intercambiar
            const newStart = date;
            const newEnd = selectedStartDate;
            
            // Verificar si todo el rango está disponible con la cantidad solicitada
            if (!isRangeAvailable(newStart, newEnd, quantity)) {
                setCalendarError(`El rango seleccionado no tiene suficiente stock disponible (${quantity} unidades)`);
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                return;
            }
            
            setSelectedStartDate(newStart);
            setSelectedEndDate(newEnd);
        } else {
            // Verificar si todo el rango está disponible con la cantidad solicitada
            if (!isRangeAvailable(selectedStartDate, date, quantity)) {
                setCalendarError(`El rango seleccionado no tiene suficiente stock disponible (${quantity} unidades)`);
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                return;
            }
            
            setSelectedEndDate(date);
        }
    }
};
    // Efecto para notificar cuando cambia la selección
    useEffect(() => {
        if (onSelect && (selectedStartDate || selectedEndDate)) {
            const startDateStr = selectedStartDate ? formatDateForComparison(selectedStartDate) : null;
            const endDateStr = selectedEndDate ? formatDateForComparison(selectedEndDate) : null;
            
            // Solo llamar a onSelect si realmente hay un cambio en las fechas
            if (startDateStr !== null || endDateStr !== null) {
                onSelect({
                    startDate: startDateStr,
                    endDate: endDateStr
                });
            }
        }
    }, [selectedStartDate, selectedEndDate]); // Removido onSelect de las dependencias

    // Verificar si una fecha está en el rango seleccionado
    const isDateInSelectedRange = (date) => {
        if (!selectedStartDate) return false;
        if (!selectedEndDate) return date.getTime() === selectedStartDate.getTime();
        return date >= selectedStartDate && date <= selectedEndDate;
    };

    // Verificar si una fecha es la fecha de inicio seleccionada
    const isStartDate = (date) => {
        return selectedStartDate && date.getTime() === selectedStartDate.getTime();
    };

    // Verificar si una fecha es la fecha de fin seleccionada
    const isEndDate = (date) => {
        return selectedEndDate && date.getTime() === selectedEndDate.getTime();
    };

    // Generar la cuadrícula del calendario para un mes
    const renderCalendarGrid = (monthDate) => {
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();
        
        // Obtener el primer día del mes
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
        let dayOfWeek = firstDayOfMonth.getDay();
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que la semana comience en lunes
        
        // Crear matriz de semanas y días
        const calendarDays = [];
        let week = Array(7).fill(null);
        
        // Días del mes anterior para completar la primera semana
        for (let i = dayOfWeek - 1; i >= 0; i--) {
            const prevMonthDate = new Date(year, month, -i);
            week[dayOfWeek - 1 - i] = prevMonthDate;
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para semana que comienza en lunes
            
            week[adjustedDayOfWeek] = date;
            
            // Si es el último día de la semana o el último día del mes, agregar la semana y comenzar una nueva
            if (adjustedDayOfWeek === 6 || day === daysInMonth) {
                calendarDays.push([...week]);
                week = Array(7).fill(null);
            }
        }
        
        // Días del mes siguiente para completar la última semana
        const lastWeek = calendarDays[calendarDays.length - 1];
        for (let i = 0; i < 7; i++) {
            if (lastWeek[i] === null) {
                const nextMonthDay = i - lastWeek.findIndex(day => day !== null) + 1;
                lastWeek[i] = new Date(year, month + 1, nextMonthDay);
            }
        }
        
        return calendarDays;
    };

    // Obtener los nombres de los días de la semana
    const getDayNames = () => {
        const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        return dayNames.map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-xs py-1">
                {day}
            </div>
        ));
    };

    // Obtener el nombre del mes y año
    const getMonthName = (date) => {
        return date.toLocaleDateString('es-UY', { month: 'long', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-(--color-primary)"></div>
            </div>
        );
    }

    return (
        <div className="calendar-container">
            {calendarError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
                    {calendarError}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calendario del mes actual */}
                <div className="calendar bg-white rounded-lg shadow p-4">
                    <div className="month-header flex justify-between items-center mb-4">
                        <button 
                            onClick={goToPreviousMonth} 
                            disabled={currentMonth.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]}
                            className={`${currentMonth.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'text-gray-300  p-1 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 p-1'}`}
                        >
                            {true ? <span className="material-symbols-outlined">arrow_back_ios</span> : null}
                        </button>
                        <h3 className="text-lg font-medium capitalize">{getMonthName(currentMonth)}</h3>
                        <button 
                            onClick={goToNextMonth} 
                            className="text-gray-600 hover:text-gray-900 p-1"
                        >
                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                        {getDayNames()}
                        
                        {renderCalendarGrid(currentMonth).map((week, weekIndex) => (
                            week.map((date, dayIndex) => {
                                if (!date) return <div key={`${weekIndex}-${dayIndex}`} className="calendar-day empty"></div>;
                                
                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());
                                const available = isDateAvailable(date);
                                const selectable = isDateSelectable(date);
                                const isSelected = isDateInSelectedRange(date);
                                const isStart = isStartDate(date);
                                const isEnd = isEndDate(date);
                                const availableQty = getAvailableQuantity(date);
                                
                                // Determinar las clases para el estilo del día
                                let dayClass = "relative h-10 flex flex-col justify-center items-center rounded-md text-sm transition-colors";
                                
                                if (!isCurrentMonth) {
                                    dayClass += " text-gray-400 bg-gray-100";
                                } else if (!selectable) {
                                    dayClass += " text-gray-400 bg-gray-100 cursor-not-allowed";
                                } else if (!available) {
                                    dayClass += " text-gray-400 bg-red-50 cursor-not-allowed";
                                } else if (isSelected) {
                                    if (isStart && isEnd) {
                                        dayClass += " bg-(--color-primary) text-white";
                                    } else if (isStart) {
                                        dayClass += " bg-(--color-primary) text-white rounded-l-md";
                                    } else if (isEnd) {
                                        dayClass += " bg-(--color-primary) text-white rounded-r-md";
                                    } else {
                                        dayClass += " bg-blue-100";
                                    }
                                } else {
                                    dayClass += " hover:bg-blue-100 cursor-pointer";
                                }
                                
                                if (isToday) {
                                    dayClass += " border-2 border-(--color-secondary)";
                                }
                                
                                return (
                                    <div 
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={dayClass}
                                        onClick={() => selectable && available && handleDateClick(date)}
                                    >
                                        <span className={isToday ? "font-bold" : ""}>
                                            {date.getDate()}
                                        </span>
                                        {isCurrentMonth && available && (
                                            <span className="text-xs font-medium text-green-600">
                                                {availableQty}
                                            </span>
                                        )}
                                        {isCurrentMonth && !available && (
                                            <span className="text-xs font-medium text-red-500">
                                                0
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
                
                {/* Calendario del mes siguiente */}
                <div className="calendar bg-white rounded-lg shadow p-4">
                    <div className="month-header flex justify-between items-center mb-4">
                        <button 
                            onClick={goToPreviousMonth}
                            disabled={currentMonth.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]}
                            className={`${currentMonth.toISOString().split('T')[0] === new Date().toISOString().split('T')[0] ? 'text-gray-300  p-1 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 p-1'}`}
                        >
                            <span className="material-symbols-outlined">arrow_back_ios</span>
                        </button>
                        <h3 className="text-lg font-medium capitalize">{getMonthName(nextMonth)}</h3>
                        <button 
                            onClick={goToNextMonth} 
                            className="text-gray-600 hover:text-gray-900 p-1"
                        >
                            <span className="material-symbols-outlined">arrow_forward_ios</span>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                        {getDayNames()}
                        
                        {renderCalendarGrid(nextMonth).map((week, weekIndex) => (
                            week.map((date, dayIndex) => {
                                if (!date) return <div key={`next-${weekIndex}-${dayIndex}`} className="calendar-day empty"></div>;
                                
                                const isCurrentMonth = date.getMonth() === nextMonth.getMonth();
                                const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());
                                const available = isDateAvailable(date);
                                const selectable = isDateSelectable(date);
                                const isSelected = isDateInSelectedRange(date);
                                const isStart = isStartDate(date);
                                const isEnd = isEndDate(date);
                                const availableQty = getAvailableQuantity(date);
                                
                                // Determinar las clases para el estilo del día
                                let dayClass = "relative h-10 flex flex-col justify-center items-center rounded-md text-sm transition-colors";
                                
                                if (!isCurrentMonth) {
                                    dayClass += " text-gray-400 bg-gray-100";
                                } else if (!selectable) {
                                    dayClass += " text-gray-400 bg-gray-100 cursor-not-allowed";
                                } else if (!available) {
                                    dayClass += " text-gray-400 bg-red-50 cursor-not-allowed";
                                } else if (isSelected) {
                                    if (isStart && isEnd) {
                                        dayClass += " bg-(--color-primary) text-white";
                                    } else if (isStart) {
                                        dayClass += " bg-(--color-primary) text-white rounded-l-md";
                                    } else if (isEnd) {
                                        dayClass += " bg-(--color-primary) text-white rounded-r-md";
                                    } else {
                                        dayClass += " bg-blue-100";
                                    }
                                } else {
                                    dayClass += " hover:bg-blue-100 cursor-pointer";
                                }
                                
                                if (isToday) {
                                    dayClass += " border-2 border-(--color-secondary)";
                                }
                                
                                return (
                                    <div 
                                        key={`next-${weekIndex}-${dayIndex}`}
                                        className={dayClass}
                                        onClick={() => selectable && available && handleDateClick(date)}
                                    >
                                        <span className={isToday ? "font-bold" : ""}>
                                            {date.getDate()}
                                        </span>
                                        {isCurrentMonth && available && (
                                            <span className="text-xs font-medium text-green-600">
                                                {availableQty}
                                            </span>
                                        )}
                                        {isCurrentMonth && !available && (
                                            <span className="text-xs font-medium text-red-500">
                                                0
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-500 mr-2"></div>
                    <span>Disponible</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-red-50 border border-red-300 mr-2"></div>
                    <span>No disponible</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-(--color-primary) mr-2"></div>
                    <span>Fecha seleccionada</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded border-2 border-(--color-secondary) mr-2"></div>
                    <span>Hoy</span>
                </div>
            </div>
            
            {/* Información de selección */}
            {(selectedStartDate || selectedEndDate) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Tu selección</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Fecha de inicio:</p>
                            <p className="font-medium">
                                {selectedStartDate ? selectedStartDate.toLocaleDateString('es-UY') : '-'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fecha de fin:</p>
                            <p className="font-medium">
                                {selectedEndDate ? selectedEndDate.toLocaleDateString('es-UY') : 
                                  selectedStartDate ? selectedStartDate.toLocaleDateString('es-UY') : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

AvailabilityCalendar.propTypes = {
    availability: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        availableStock: PropTypes.number.isRequired
    })).isRequired,
    onSelect: PropTypes.func
};

export default AvailabilityCalendar;