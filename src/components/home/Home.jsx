import { useState } from 'react';
import SearchBar from './search';
import Category from './categorias';
import ProductCards from './productCards';
import { useInstrumentState } from "../../context/InstrumentContext";
import { useCategoryState } from "../../context/CategoryContext";

const Home = () => {
    const { categories, loading: loadingCategories, error: errorCategories } = useCategoryState();
    const { instruments, loading, error, getAvailabilityById } = useInstrumentState();
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [categoryFiltered, setCategoryFiltered] = useState(false);
    const [dateRange, setDateRange] = useState(null);


    const handleSearch = (results) => {
        // Comprobar si los resultados incluyen información de fechas
        if (results && typeof results === 'object' && results.products) {
            setFilteredProducts(results.products);
            setDateRange(results.dateRange);
        } else {
            setFilteredProducts(results);
            setDateRange(null);
        }
        setCategoryFiltered(false);
    };

    const handleCategoryFilter = (filteredResults) => {
        // console.log("Home recibió productos filtrados:", filteredResults.length);
        
        // Si hay un rango de fechas activo, filtrar también por fechas
        if (dateRange) {
            // Aquí iría la lógica para filtrar por fecha y categoría
            // Por ahora, simplemente usamos los resultados de la categoría
        }
        
        setFilteredProducts(filteredResults);
        setCategoryFiltered(true);
    };

//     const renderTitle = () => {
//         if (loading) return "Cargando instrumentos...";
//         if (error) return error;
//         if (filteredProducts) return categoryFiltered ? "Filtrado por categoría" : "Resultados de búsqueda";
//         return "Recomendaciones";
//     };
    const getFilterTitle = () => {
        if (!filteredProducts) return 'Recomendaciones';
        
        if (dateRange && (dateRange.startDate || dateRange.endDate)) {
            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                const [year, month, day] = dateStr.split('-').map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString('es-UY', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    timeZone: 'America/Montevideo'
                });
            };
            
            const start = dateRange.startDate ? formatDate(dateRange.startDate) : '';
            const end = dateRange.endDate ? formatDate(dateRange.endDate) : start;
            
            if (start && end) {
                return `Disponibles entre ${start} y ${end}`;
            } else if (start) {
                return `Disponibles el ${start}`;
            }
        }
        
        return categoryFiltered ? 'Filtrado por categoría' : 'Resultados de búsqueda';
    };

    return (
        <main className="max-w-5xl justify-center mx-auto">
            <div className="bg-(--color-primary) py-4 mb-4">
                <SearchBar onSearch={handleSearch} products={instruments} getAvailabilityById={getAvailabilityById} />
            </div>
            <Category onFilterChange={handleCategoryFilter} products={instruments} categories={categories} loadingCategories={loadingCategories} />

            <div className="py-4 mb-4 flex flex-col mx-3 lg:mx-0">
                <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">
                    {getFilterTitle()}
                </h1>

               {/* Comprobación para mostrar mensaje cuando no hay productos */}
{/* Mostrar mensaje para fechas sin resultados */}
                    {filteredProducts && filteredProducts.length === 0 && dateRange && (dateRange.startDate || dateRange.endDate) ? (
                        <div className="empty-category-message bg-gray-100 p-8 rounded-lg text-center">
                            <div className="empty-icon text-8xl text-gray-300 mb-4">
                                <i className="fas fa-calendar-times"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-(--color-secondary) mb-2">
                                No hay instrumentos disponibles en estas fechas
                            </h3>
                            <p className="text-gray-500">
                                No encontramos instrumentos disponibles para el período seleccionado.
                                <br />
                                Por favor, intenta con otras fechas o amplía tu rango de búsqueda.
                            </p>
                        </div>
                    ) : filteredProducts && filteredProducts.length === 0 && categoryFiltered ? (
                        <div className="empty-category-message bg-gray-100 p-8 rounded-lg text-center">
                            <div className="empty-icon text-8xl text-gray-300 mb-4">
                                <i className="fas fa-guitar"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-(--color-secondary) mb-2">
                                No hay instrumentos disponibles
                            </h3>
                            <p className="text-gray-500">
                                Actualmente no tenemos instrumentos disponibles en esta categoría.
                                <br />
                                Por favor, selecciona otra categoría o prueba con otros criterios de búsqueda.
                            </p>
                        </div>
                    ) : (
    <ProductCards products={filteredProducts || instruments} categories={categories} isLoading={loading} />
)}

            </div>
        </main>
    );
};

export default Home;
