import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { apiService } from "../../services/apiService";

const ProductList = ({ products }) => {
    const [displayProducts, setDisplayProducts] = useState([]);
    const [productRatings, setProductRatings] = useState({});



    useEffect(() => {
        // Cargar ratings para cada producto
        const loadRatings = async () => {
            const ratingsMap = {};

            if (displayProducts && displayProducts.length > 0) {
                const ratingPromises = displayProducts.map(async (product) => {
                    try {
                        const ratings = await apiService.getRatingsByInstrument(product.id);
                        if (ratings && ratings.length > 0) {
                            const sum = ratings.reduce((total, rating) => total + rating.stars, 0);
                            const average = (sum / ratings.length).toFixed(1);
                            ratingsMap[product.id] = {
                                average,
                                count: ratings.length
                            };
                        }
                    } catch (error) {
                        console.error(`Error al cargar ratings para producto ${product.id}:`, error);
                    }
                });

                await Promise.all(ratingPromises);
                setProductRatings(ratingsMap);
            }
        };

        loadRatings();
    }, [displayProducts]);
    // Añadimos logging para depurar lo que recibe
    useEffect(() => {
        console.log("ProductList recibió:", products ? products.length : 0, "productos");
        setDisplayProducts(products || []);
    }, [products]);

    if (!displayProducts || displayProducts.length === 0) {
        return (
            <div className="text-center py-8 mt-4">
                <h3 className="text-lg font-semibold text-(--color-secondary)">
                    No se encontraron productos para los filtros seleccionados
                </h3>
                <p className="text-sm text-(--color-secondary-light) mt-2">
                    Prueba con diferentes categorías o elimina los filtros
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => {
                    // Verificar si product y mainImage existen para evitar errores
                    if (!product || !product.mainImage) {
                        console.error("Producto inválido:", product);
                        return null; // No renderizar este producto si falta información
                    }

                    return (
                        <Link to={`/product/${product.id}`} key={product.id}>
                            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={product.mainImage}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.log("Error cargando imagen:", e.target.src);
                                            // Redirigir a una imagen de respaldo si la original falla
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                                        }}
                                    />
                                </div>
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

                                    {/* Agrega aquí el bloque de valoraciones */}
                                    {productRatings[product.id] && (
                                        <div className="flex items-center mt-2">
                                            <div className="flex text-yellow-400">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star}>
                                                        {star <= Math.round(productRatings[product.id].average) ? "★" : "☆"}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">
                                                {productRatings[product.id].average} ({productRatings[product.id].count})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

ProductList.propTypes = {
    products: PropTypes.array
};

// Usar parámetros por defecto de JavaScript en lugar de defaultProps
// para evitar la advertencia de React
export default ProductList;