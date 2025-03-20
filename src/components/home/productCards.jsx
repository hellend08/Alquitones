// productCards.jsx - corregido
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import ShareProduct from "./ShareProduct";

const ProductCards = ({ products: products, categories: categories, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likedProducts, setLikedProducts] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const productsPerPage = 10;

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name || "Sin categoría";
    };

    // Formatear fecha para mostrar
    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        return localDate.toLocaleDateString('es-UY', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'America/Montevideo'
        });
    };

    useEffect(() => {
        const savedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
        setLikedProducts(Array.isArray(savedLikes) ? savedLikes : []);

        const currentUser = localDB.getCurrentUser();
        setIsAuthenticated(!!currentUser);
    }, []);

    const toggleLike = (product) => {
        setLikedProducts((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            let updatedLikes;
    
            // Verificar si ya está en la lista
            const isLiked = prevArray.some((p) => p.id === product.id);
    
            if (isLiked) {
                // eliminamos
                updatedLikes = prevArray.filter((p) => p.id !== product.id);
            } else {
                // agregamos
                updatedLikes = [...prevArray, product];
            }
    
            localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
            return updatedLikes;
        });
    };

    const disabledLike = () => {
        alert("Inicia Sesión para interactuar.")
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
                    currentProducts.map((product) => {
                        // Verificar si hay fechas seleccionadas basándonos en availabilityDetails
                        const hasDateFiltering = product.availabilityDetails !== undefined;
                        
                        return (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <section className="p-3 border-b border-gray-300 flex justify-start gap-5">
                                    {isAuthenticated ? ( 
                                        <button 
                                            className={`transition cursor-pointer ${likedProducts.some((p) => p.id === product.id) ? "text-red-500" : "text-(--color-secondary)"}`}
                                            onClick={() => toggleLike(product)} 
                                        >
                                            <i className={`fa${likedProducts.some((p) => p.id === product.id) ? 's' : 'r'} fa-heart`}></i>
                                        </button> ) : (
                                        <button className="cursor-pointer" onClick={() => disabledLike()}>
                                            <i className="far fa-heart disabled:text-gray-100" ></i>
                                        </button>
                                    )}
                                    <button className="cursor-pointer" onClick={() => setSelectedProduct(product)} >
                                        <i className="fas fa-share-alt text-(--color-secondary)" ></i>
                                    </button>
                                </section>
                                <Link to={`/detail/${product.id}`}>
                                    <div className="h-48 overflow-hidden">
                                        <img 
                                            className="w-full h-full object-contain" 
                                            src={product.images?.[0] || product.mainImage} 
                                            alt={product.name} 
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                                            }}
                                        />
                                    </div>
                                </Link>
                                <div className="p-5 border-t border-gray-300">
                                    <div className="mb-3">
                                        <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                            {product.name}
                                        </h5>
                                        <h6 className="font-semibold text-xs my-1 text-gray-400">
                                            {getCategoryName(product.categoryId)}
                                        </h6>
                                        <p className="font-normal text-sm text-gray-500 line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                    
                                    {/* Tabla de disponibilidad */}
                                    {product.availabilityDetails && product.availabilityDetails.length > 0 ? (
                                        <div className="my-4 overflow-hidden border border-gray-200 rounded-md">
                                            <table className="w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-xs font-medium text-gray-500 text-left">
                                                            Fecha
                                                        </th>
                                                        <th className="px-3 py-2 text-xs font-medium text-gray-500 text-right">
                                                            Disponibles
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                                    {product.availabilityDetails.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-3 py-1.5">
                                                                {formatDate(item.date)}
                                                            </td>
                                                            <td className="px-3 py-1.5 text-right font-medium">
                                                                <span className="text-green-600">
                                                                    {item.availableQuantity}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : hasDateFiltering ? (
                                        <div className="my-4 py-2 text-center text-sm text-gray-500 bg-gray-50 rounded-md">
                                            Disponible en fechas seleccionadas
                                        </div>
                                    ) : null}
                                    
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500">Precio por día</p>
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
                        );
                    })
                ) : (
                    <div className="col-span-2 text-center py-8">
                        <h3 className="text-lg font-semibold text-gray-700">
                            No se encontraron productos disponibles
                        </h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Prueba con otras fechas o cambia tus criterios de búsqueda
                        </p>
                    </div>
                )}
            </div>
            {/* Modal de compartir */}
            {selectedProduct && (
                <ShareProduct product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}

            {/* Controles de paginación (solo mostrar si hay productos) */}
            {currentProducts.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 mb-8">
                    <button
                        onClick={() => paginate(1)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <span className="material-symbols-outlined text-sm">home</span>
                    </button>
                    <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">navigate_before</span>
                    </button>
                    
                    <span className="px-4 py-1 text-sm font-medium text-gray-700">
                        Página {currentPage} de {totalPages || 1}
                    </span>

                    <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                    <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
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
