// Home.jsx
// import Header from '../crossSections/header';
// import Footer from '../crossSections/Footer'
import { useState, useEffect } from 'react';
import SearchBar from './search';
import Category from './categorias';
import ProductCards from './productCards';
import { localDB } from '../../database/LocalDB';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [categoryFiltered, setCategoryFiltered] = useState(false);

    useEffect(() => {
        const allProducts = localDB.getAllProducts();
        setProducts(allProducts);
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
                <div className="py-4 mb-4">
                    <Category onFilterChange={handleCategoryFilter} />
                </div>
                
                <div className="py-4 mb-4 flex flex-col">
                    <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">
                        {filteredProducts 
                            ? (categoryFiltered ? 'Filtrado por categoría' : 'Resultados de búsqueda') 
                            : 'Recomendaciones'}
                    </h1>
                    <ProductCards products={filteredProducts || products} />
                </div>
            </main>
        </>
    );
};

export default Home;