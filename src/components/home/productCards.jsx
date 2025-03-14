// productCards.jsx - corregido
import { useState, useEffect } from "react";
import { localDB } from "../../database/LocalDB";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProductCards = ({ products: propProducts }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Cargar productos desde props o cargar recomendados si no hay props
    useEffect(() => {
        if (propProducts && propProducts.length > 0) {
            console.log("ProductCards: Usando productos recibidos por props:", propProducts.length);
            setProducts(propProducts);
            setCurrentPage(1); // Reset a primera página con nuevos productos
        } else {
            console.log("ProductCards: Cargando productos recomendados");
            recomendedProducts();
        }
    }, [propProducts]);

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
            const categoriesDB = localDB.getAllCategories();
            setCategories(categoriesDB);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name || "Sin categoría";
    }

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
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => {
                        // Verificar si hay fechas seleccionadas basándonos en availabilityDetails
                        const hasDateFiltering = product.availabilityDetails !== undefined;
                        
                        return (
                            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
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
                        <span className="material-symbols-outlined text-sm">navigate_next</span>
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

// Añadir propTypes para validar las props
ProductCards.propTypes = {
    products: PropTypes.array
};

export default ProductCards;