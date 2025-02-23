import { useState, useEffect } from "react";
import { localDB } from "../../database/LocalDB";
import { Link } from "react-router-dom";

const ProductCards = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const recomendedProducts = () => {
        try {
            const productsDB = localDB.getAllProducts();
            if (productsDB.length > 0) {
                // Obtener todos los productos en orden aleatorio
                const randomProducts = productsDB.sort(() => Math.random() - 0.5);
                setProducts(randomProducts);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getCategories = () => {
        try {
            const categoriesDB = localDB.data.categories;
            setCategories(categoriesDB);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategories();
        recomendedProducts();
    }, []);

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name || "Sin categoría";
    }

    // Lógica de paginación
    const totalPages = Math.ceil(products.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:transform hover:scale-105 transition duration-300">
                        <img 
                            className="h-48 w-96 mx-auto object-contain rounded-t-lg" 
                            src={product.images[0]} 
                            alt={product.name} 
                        />
                        <div className="p-5 border-t border-gray-300">
                            <div className="h-20">
                                <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                    {product.name}
                                </h5>
                                <h6 className="font-semibold text-xs my-1 text-gray-400">
                                    {getCategoryName(product.categoryId)}
                                </h6>
                                <p className="mb-3 font-normal text-sm text-gray-500">
                                    {product.description}
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <div>
                                    <p className="text-xs">Precio por día</p>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ${product.pricePerDay}
                                    </span>
                                </div>
                                <Link 
                                    to={`/detail/${product.id}`} 
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-(--color-primary) rounded-lg hover:bg-(--color-secondary)"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center items-center gap-2 mt-4 mb-8">
            <button
                    onClick={() => paginate(1)}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    <span className="material-symbols-outlined text-sm">home</span>
                </button>
                <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">first_page</span>
                </button>
                
                <span className="px-4 py-1 text-sm font-medium text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">navigate_next</span>
                </button>
                <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">last_page</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCards;