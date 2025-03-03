import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ProductList = ({ products }) => {
    const [displayProducts, setDisplayProducts] = useState([]);

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
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-(--color-primary) truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-(--color-secondary) mt-1 h-12 overflow-hidden">
                                        {product.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-lg font-bold text-(--color-accent)">
                                            ${product.pricePerDay}/día
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full 
                                            ${product.status === 'Disponible' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'}`}>
                                            {product.status}
                                        </span>
                                    </div>
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