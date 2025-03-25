import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const Category = ({ onFilterChange = () => {}, products: instruments, categories: categories, loadingCategories }) => {
    // const { instruments } = useInstrumentState();

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [iconErrors, setIconErrors] = useState({});
    const sliderRef = useRef(null);

    useEffect(() => {
        loadFontAwesome();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [selectedCategories]);

    const loadFontAwesome = () => {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(link);
        }
    };
    
    const filterProducts = () => {
        if (selectedCategories.length === 0) {
            setFilteredProducts(instruments.length > 0 ? instruments : null);
            onFilterChange(instruments.length > 0 ? instruments : null);
        } else {
            const filteredResults = instruments.filter(product =>
                selectedCategories.includes(product.categoryId)
            );

            setFilteredProducts(filteredResults);
            onFilterChange(filteredResults);
        }
    };


    const toggleCategorySelection = (categoryId) => {
        const numericCategoryId = Number(categoryId);
        setSelectedCategories(prev =>
            prev.includes(numericCategoryId)
                ? prev.filter(id => id !== numericCategoryId)
                : [...prev, numericCategoryId]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
    };

    const handleImageError = (categoryId) => {
        setIconErrors(prev => ({ ...prev, [categoryId]: true }));
    };

    const renderCategoryIcon = (category) => {
        if (category.icon && category.icon.startsWith("fa-")) {
            return <i className={`fas ${category.icon}`} style={{ fontSize: "2.5rem", color: "#666" }}></i>;
        }

        if (iconErrors[category.id]) {
            const defaultIcons = {
                "Cuerdas": "fas fa-guitar",
                "Viento": "fas fa-wind",
                "Percusión": "fas fa-drum",
                "Teclados": "fas fa-keyboard"
            };

            const iconClass = defaultIcons[category.name] || "fas fa-music";
            return <i className={iconClass} style={{ fontSize: "2.5rem", color: "#666" }}></i>;
        }

        return (
            <img
                src={category.icon}
                className="w-12 h-12 object-contain"
                alt={category.name}
                onError={() => handleImageError(category.id)}
            />
        );
    };

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === "left" ? -sliderRef.current.offsetWidth : sliderRef.current.offsetWidth;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="mb-12 py-4 relative max-w-6xl mx-3 lg:mx-auto">
            <section className="flex items-center mb-6 gap-2 justify-between">
                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <h2 className="text-sm md:text-lg font-semibold text-(--color-primary)">Categorías</h2>
                    <span className="text-sm md:text-base text-gray-500">
                        {selectedCategories.length > 0
                            ? `Mostrando ${filteredProducts === null ? 0 : filteredProducts.length || 0 } de ${instruments.length} productos`
                            : `Total: ${instruments.length} productos`}
                    </span>
                </div>

                {selectedCategories.length > 0 && (
                    <button
                        onClick={clearFilters}
                        className="text-sm py-1 px-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center transition-all duration-200 hover:shadow-sm"
                    >
                        <i className="fas fa-times-circle mr-1 text-red-600"></i>
                        <span className="hidden sm:inline">Borrar Filtros</span>
                        <span className="sm:hidden">Borrar</span>
                    </button>
                )}
            </section>

            <div className="relative">
                <button
                    onClick={() => scrollSlider("left")}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 ${
                        categories.length <= 4 ? "hidden" : ""
                    }`}
                >
                    <i className="fas fa-chevron-left text-2xl"></i>
                </button>

                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto scroll-smooth no-scrollbar px-3 mx-6 overflow-hidden grid-cols-4 gap-8 "
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        gap: "1rem",
                        justifyContent: "space-between"
                    }}
                >
                    {loadingCategories ? (
                        [...Array(4)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center p-2 min-w-48 animate-pulse">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full"></div>
                                <div className="h-4 bg-gray-400 rounded w-3/4 mt-2"></div>
                            </div>
                        ))
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className={`flex-1 flex flex-col items-center cursor-pointer transition-all duration-200 
                                    group relative p-2 min-w-48
                                    ${
                                        selectedCategories.some(id => Number(id) === Number(category.id))
                                            ? "opacity-100"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                onClick={() => toggleCategorySelection(category.id)}
                            >
                                <div
                                    className={`w-20 h-20 sm:w-24 sm:h-24 flex justify-center items-center rounded-full relative 
                                        z-10 
                                        ${
                                            selectedCategories.some(id => Number(id) === Number(category.id))
                                                ? "bg-(--color-quinary) opacity-80 border-2 border-(--color-primary)"
                                                : "bg-(--color-grey)"
                                        }`}
                                >
                                    {renderCategoryIcon(category)}
                                </div>
                                <div className="flex flex-col items-center">
                                    <p
                                        className={`text-sm text-center font-semibold mt-2
                                            ${
                                                selectedCategories.some(id => Number(id) === Number(category.id))
                                                    ? "text-(--color-primary)"
                                                    : "text-(--color-secondary)"
                                            }`}
                                    >
                                        {category.name}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                        ({instruments.filter(prod => prod.categoryId === category.id).length})
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => scrollSlider("right")}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 ${
                        categories.length <= 4 ? "hidden" : ""
                    }`}
                >
                    <i className="fas fa-chevron-right text-2xl"></i>
                </button>
            </div>
        </div>
    );
};

Category.propTypes = {
    onFilterChange: PropTypes.func
};

export default Category;
