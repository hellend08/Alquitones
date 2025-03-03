import { localDB } from "../../database/LocalDB";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

// Usar parámetros por defecto de JavaScript en lugar de defaultProps
const Category = ({ onFilterChange = () => {} }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        getCategories();
        getAllProducts();
    }, []);

    // Effect to update filtered products when selection changes
    useEffect(() => {
        filterProducts();
    }, [selectedCategories]);

    const getCategories = () => {
        try {
            // Cambiando para usar directamente data.categories como en tu código original
            const categoriesDB = localDB.data.categories;
            setCategories(categoriesDB);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const getAllProducts = () => {
        try {
            const allProducts = localDB.getAllProducts();
            setTotalProducts(allProducts.length);
            setFilteredProducts(allProducts);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const filterProducts = () => {
        try {
            let filteredResults;
            
            if (selectedCategories.length === 0) {
                // Si no hay categorías seleccionadas, mostrar todos los productos
                filteredResults = localDB.getAllProducts();
            } else {
                // Filtrar productos usando el método getProductsByCategory de LocalDB
                filteredResults = [];
                
                // Para cada categoría seleccionada, obtener sus productos y añadirlos al resultado
                selectedCategories.forEach(categoryId => {
                    const productsInCategory = localDB.getProductsByCategory(Number(categoryId));
                    filteredResults = [...filteredResults, ...productsInCategory];
                });
            }
            
            // Actualizar estado local
            setFilteredProducts(filteredResults);
            
            // Notificar al componente padre sobre los cambios
            if (onFilterChange) {
                onFilterChange(filteredResults);
            }
        } catch (error) {
            console.error("Error filtrando productos:", error);
        }
    };

    const toggleCategorySelection = (categoryId) => {
        // Asegurarnos que el categoryId es un número
        const numericCategoryId = Number(categoryId);
        
        setSelectedCategories(prev => {
            if (prev.includes(numericCategoryId)) {
                // If already selected, remove it
                return prev.filter(id => id !== numericCategoryId);
            } else {
                // If not selected, add it
                return [...prev, numericCategoryId];
            }
        });
    };

    const clearFilters = () => {
        setSelectedCategories([]);
    };

    // Eliminar logs de depuración para producción
    return (
        <div className="mx-4 mb-8">
            <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-(--color-primary)">Categorías</h2>
                    
                    {selectedCategories.length > 0 && (
                        <button 
                            onClick={clearFilters}
                            className="flex items-center text-sm text-red-500 hover:text-red-700 bg-transparent border border-red-300 rounded-md px-2 py-1"
                        >
                            <span className="mr-1">✕</span>
                            Eliminar filtros
                        </button>
                    )}
                </div>
                
                {selectedCategories.length > 0 && (
                    <div className="text-sm text-(--color-secondary) mb-2">
                        Mostrando {filteredProducts.length} de {totalProducts} productos
                    </div>
                )}
            </div>

            <div className="flex justify-around flex-wrap gap-4">
                {categories.map((category) => (
                    <div 
                        key={category.id} 
                        className={`flex flex-col items-center cursor-pointer transition-all duration-200 
                            ${selectedCategories.some(id => Number(id) === Number(category.id))
                                ? 'scale-110 opacity-100' 
                                : 'opacity-80 hover:opacity-100'}`}
                        onClick={() => toggleCategorySelection(category.id)}
                    >
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center rounded-full 
                            ${selectedCategories.some(id => Number(id) === Number(category.id))
                                ? 'bg-(--color-primary-light) border-2 border-(--color-primary)' 
                                : 'bg-(--color-grey)'}`}>
                            <img 
                                src={category.icon}
                                className="w-12 h-12 object-contain"
                                alt={category.name}
                            />
                        </div>
                        <p className={`text-sm text-center font-semibold mt-2
                            ${selectedCategories.some(id => Number(id) === Number(category.id))
                                ? 'text-(--color-primary)' 
                                : 'text-(--color-secondary)'}`}
                        >
                            {category.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

Category.propTypes = {
    onFilterChange: PropTypes.func
};

export default Category;