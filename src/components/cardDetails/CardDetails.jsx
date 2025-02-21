import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { localDB } from '../../database/LocalDB';

function CardDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [categories, setCategories] = useState("");
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        const product = localDB.getProductById(parseInt(id));
        if (product) {
            setInstrument(product);
            loadSuggestions(parseInt(id));
            getCategories();
            window.scrollTo(0, 0);
        }
    }, [id]);

    const loadSuggestions = (currentId) => {
        let allProducts = localDB.getAllProducts().filter(p => p.id !== currentId);
        allProducts = allProducts.sort(() => Math.random() - 0.5);
        setSuggestions(allProducts.slice(0, 2));
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

    const getCategoryName = (categoryId) => {
        const category = categories.find((category) => category.id === categoryId);
        return category?.name;
    }

    if (!instrument) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    // Obtener solo las primeras 5 imágenes para la vista principal
    const mainViewImages = instrument.images.slice(0, 5);
    // Obtener todas las imágenes para la galería
    const allImages = instrument.images;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-(--color-secondary)">{instrument.name} <span className="text-gray-500 text-sm">cod {instrument.id}</span></h1>
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-(--color-secondary) cursor-pointer text-2xl">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>
            
            {/* Vista principal - Solo 5 imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img src={mainViewImages[0]} alt={instrument.name} className="w-full h-96 object-cover rounded-lg" />
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    {mainViewImages.slice(1, 5).map((img, index) => (
                        <img key={index} src={img} alt={`Miniatura ${index}`} className="w-full h-47 object-cover rounded-lg" />
                    ))}
                    <div className="relative">
                        <button 
                            onClick={() => setShowGallery(true)} 
                            className="absolute -right-40 md:-right-52 lg:-right-80 bottom-8 cursor-pointer border bg-white text-(--color-secondary) px-4 py-2 rounded-lg shadow-lg hover:bg-(--color-primary) hover:text-white transition"
                        >
                            Ver más 👁
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-2.5">
                    <h2 className="text-xl font-bold text-(--color-secondary)">Descripción</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <p className="text-lg font-semibold">Precio: <span className="text-green-600">${instrument.pricePerDay.toFixed(2)}</span></p>
                        <button className="bg-(--color-secondary) text-white px-4 py-2 rounded-lg hover:bg-(--color-primary) cursor-pointer transition">Reserva Ahora</button>
                    </div>
                </div>
                <p className="text-gray-600 text-lg">{instrument.description}</p>
            </div>

            <h2 className="mt-10 text-xl font-bold text-(--color-secondary)">Sugerencias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {suggestions.map((product) => (
                    <div key={product.id} className="bg-white shadow-md rounded-lg">
                        <img src={product.mainImage} alt={product.name} className="h-48 w-96 mx-auto object-contain rounded-t-lg" />
                        <div className="p-5 border-t border-gray-300">
                            <h3 className="text-xl font-bold tracking-tight text-(--color-secondary)">{product.name}</h3>
                            <h6 className="font-semibold text-xs my-1 text-gray-400">{getCategoryName(product.categoryId)}</h6>
                            <p className="mb-3 font-normal text-sm text-gray-500">{product.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <div>
                                    <p className="text-xs">Precio por día</p>
                                    <p className="text-lg font-semibold text-(--color-secondary)">${product.pricePerDay.toFixed(2)}</p>
                                </div>
                                <Link to={`/detail/${product.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-(--color-primary) rounded-lg hover:bg-(--color-secondary) transition">
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Galería - Todas las imágenes */}
            {showGallery && (
                <div className="fixed inset-0 bg-black/75 transition-opacity flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full disabled:opacity-75 md:h-[400px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Galería de Imágenes</h2>
                            <button onClick={() => setShowGallery(false)} className="text-gray-500 hover:text-gray-700"> ✖ </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {allImages.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={img} 
                                    alt={`Imagen ${index + 1}`} 
                                    className="w-full md:col-span-2 h-47 object-cover rounded-lg"
                                    // className={`w-full ${index === 0 ? 'md:col-span-2 h-60' : 'col-span-2 h-47'} object-cover rounded-lg`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CardDetails