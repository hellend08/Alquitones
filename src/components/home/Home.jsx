import { useState, useEffect } from 'react';
import SearchBar from './search';
import Category from './categorias';
import ProductCards from './productCards';
import { apiService } from "../../services/apiService";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [categoryFiltered, setCategoryFiltered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getInstruments();
            setProducts(data);
        };

        fetchData();
    }, []);

    const handleSearch = (results) => {
        setFilteredProducts(results);
        setCategoryFiltered(false); // Resetear filtro de categoría cuando se busca
    };

    const handleCategoryFilter = (filteredResults) => {
        console.log("Home recibió productos filtrados:", filteredResults.length);
        setFilteredProducts(filteredResults);
        setCategoryFiltered(true);
    };

    return (
        <>
            <main className="max-w-5xl justify-center mx-auto">
                <div className="bg-(--color-primary) py-4 mb-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <Category onFilterChange={handleCategoryFilter} />
                
                <div className="py-4 mb-4 flex flex-col mx-3 lg:mx-0">
                    <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">
                        {filteredProducts 
                            ? (categoryFiltered ? 'Filtrado por categoría' : 'Resultados de búsqueda') 
                            : 'Recomendaciones'}
                    </h1>
                    
                    {/* Comprobación para mostrar mensaje cuando no hay productos */}
                    {filteredProducts && filteredProducts.length === 0 && categoryFiltered ? (
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
                        <ProductCards products={filteredProducts || products} />
                    )}
                </div>
            </main>
        </>
    );
};


export default Home;