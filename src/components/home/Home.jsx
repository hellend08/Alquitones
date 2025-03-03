import { useState, useEffect } from 'react';
import SearchBar from './search';
import Category from './categorias';
import ProductCards from './productCards';
import { localDB } from '../../database/LocalDB';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);

    useEffect(() => {
        // const allProducts = localDB.getAllProducts(); // Eliminar .instruments
        // setProducts(allProducts);
        getProducts();
        getCategories();
    }, []);

    const getProducts = () => {
        const allProducts = localDB.getAllProducts();
        setProducts(allProducts);
    }

    const getCategories = () => {
        try {
            const categoriesDB = localDB.getAllCategories();
            setCategories(categoriesDB);
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSearch = (results) => {
        setFilteredProducts(results);
    };

    return (
        <>
            <main className="max-w-5xl justify-center mx-auto">
                <div className="bg-(--color-primary) py-4 mb-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <div className="py-4 mb-4 flex justify-around">
                    {categories.map((category) => (
                        <Category key={category.id} category={category}/>
                        )
                    )}
                </div>
                
                <div className="py-4 mb-4 flex flex-col">
                    <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">
                        {filteredProducts ? 'Resultados de búsqueda' : 'Recomendaciones'}
                    </h1>
                    <ProductCards products={filteredProducts || products} />
                </div>
            </main>
        </>
    );
};

export default Home;