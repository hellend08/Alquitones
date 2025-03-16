import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useCategoryState } from "../../context/CategoryContext";

const ProductCards = ({ products: propProducts, isLoading }) => {
    const { categories } = useCategoryState();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    useEffect(() => {
        if (propProducts && propProducts.length > 0) {
            console.log("ProductCards: Usando productos recibidos por props:", propProducts.length);
            setProducts(propProducts);
        }
    }, [propProducts]);

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name || "Sin categoría";
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    // 🔹 Renderiza el Skeleton mientras carga
                    [...Array(6)].map((_, index) => (
                        <div key={index} className="bg-gray-200 animate-pulse border border-gray-300 rounded-lg shadow-sm">
                            <div className="h-48 w-96 mx-auto bg-gray-300 rounded-t-lg"></div>
                            <div className="p-5 border-t border-gray-300">
                                <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                        </div>
                    ))
                ) : currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:transform hover:scale-105 transition duration-300">
                            <img 
                                className="h-48 w-96 mx-auto object-contain rounded-t-lg" 
                                src={product.images?.[0]?.url || product.mainImage} 
                                alt={product.name} 
                                onError={(e) => {
                                    console.log("Error cargando imagen:", e.target.src);
                                    e.target.src = 'https://dummyimage.com/300x200/000/fff&text=Imagen+no+disponible';
                                }}
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
                    ))
                ) : (
                    <div className="col-span-2 text-center py-8">
                        <h3 className="text-lg font-semibold text-gray-700">
                            No se encontraron productos para los filtros seleccionados
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Prueba con diferentes categorías o elimina los filtros
                        </p>
                    </div>
                )}
            </div>

            {/* Controles de paginación */}
            {currentProducts.length > 0 && (
                <div className="flex justify-center items-center gap-2 mt-4 mb-8">
                    <button
                        onClick={() => paginate(1)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <span className="material-symbols-outlined text-sm">home</span>
                    </button>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    
                    <span className="px-4 py-1 text-sm font-medium text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">last_page</span>
                    </button>
                </div>
            )}
        </div>
    );
};

ProductCards.propTypes = {
    products: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default ProductCards;
