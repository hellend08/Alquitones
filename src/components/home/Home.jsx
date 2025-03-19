import { useState } from 'react';
import SearchBar from './search';
import Category from './categorias';
import ProductCards from './productCards';
import { useInstrumentState } from "../../context/InstrumentContext";
import { useCategoryState } from "../../context/CategoryContext";

const Home = () => {
    const { categories, loading: loadingCategories, error: errorCategories } = useCategoryState();
    const { instruments, loading, error } = useInstrumentState();
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [categoryFiltered, setCategoryFiltered] = useState(false);
    
    const handleSearch = (results) => {
        setFilteredProducts(results);
        setCategoryFiltered(false);
    };

    const handleCategoryFilter = (filteredResults) => {
        setFilteredProducts(filteredResults);
        setCategoryFiltered(true);
    };

    const renderTitle = () => {
        if (loading) return "Cargando instrumentos...";
        if (error) return error;
        if (filteredProducts) return categoryFiltered ? "Filtrado por categoría" : "Resultados de búsqueda";
        return "Recomendaciones";
    };

    return (
        <main className="max-w-5xl justify-center mx-auto">
            <div className="bg-(--color-primary) py-4 mb-4">
                <SearchBar onSearch={handleSearch} products={instruments} />
            </div>
            <Category onFilterChange={handleCategoryFilter} products={instruments} categories={categories} loadingCategories={loadingCategories} />

            <div className="py-4 mb-4 flex flex-col mx-3 lg:mx-0">
                <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">
                    {renderTitle()}
                </h1>

               {/* Comprobación para mostrar mensaje cuando no hay productos */}
{filteredProducts !== null && filteredProducts.length === 0 && categoryFiltered ? (
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
