import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { localDB } from '../../database/LocalDB';

function CardDetails() {
    // const { id } = useParams();
    const navigate = useNavigate();
    const [instrument, setInstrument] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        loadInstruments();
    }, []);
    

    const loadInstruments = () => {
            try {
                const products = localDB.getAllProducts(parseInt());
                if (products.length > 0) {
                    setInstrument(products[2]);
                    setSuggestions(products.slice(1, 3));
                }
            } catch (error) {
                console.error('Error al obtener el instrumento:', error);
            }
    };

    if (!instrument) {
        return <div className="text-center py-10">Cargando...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{instrument.name} <span className="text-gray-500 text-sm">cod {instrument.id}</span></h1>
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 cursor-pointer">Atrás</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <img src={instrument.images[0]} alt={instrument.name} className="w-full h-96 object-cover rounded-lg" />
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    {instrument.images.slice(1).map((img, index) => (
                        <img key={index} src={img} alt={`Miniatura ${index}`} className="w-full h-47 object-cover rounded-lg" />
                    ))}
                </div>
            </div>
            <div className="mt-6 p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Descripción</h2>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600 text-lg">{instrument.description}</p>
                        <p className="text-lg font-semibold">Precio: <span className="text-green-600">${instrument.pricePerDay.toFixed(2)}</span></p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">Reserva Ahora</button>
                    </div>
                </div>
                <p>Lorem ipsum dolor sit amet consectetur. Lectus sagittis lacinia purus orci. Mi est quis sem
                        Mauris scelerisque nunc urna cras orci euisaliquam viverra nec h Vehicula.</p>
            </div>
            <h2 className="mt-10 text-xl font-bold">Sugerencias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {suggestions.map((product) => (
                    <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
                        <img src={product.mainImage} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
                        <h3 className="text-xl font-bold mt-2">{product.name}</h3>
                        <p className="text-gray-600">{product.category}</p>
                        <p className="font-semibold">Precio: ${product.pricePerDay.toFixed(2)}</p>
                        <button className="mt-2 text-blue-600 hover:underline cursor-pointer">Ver detalles</button>
                    </div>
                ))}
            </div>
        </div>
        
    )
}

export default CardDetails