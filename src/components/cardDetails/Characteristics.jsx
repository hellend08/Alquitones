// src/components/cardDetails/Characteristics.jsx
import React from 'react';

const Characteristics = ({ specifications }) => {
    // Si no hay especificaciones, mostrar mensaje
    if (!specifications || specifications.length === 0) {
        return (
            <div className="text-gray-500 italic text-center p-4">
                No hay características disponibles para este producto.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specifications.map((spec, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                        {spec.specification && (
                            <div className="w-8 h-8 flex items-center justify-center bg-(--color-sunset) rounded-full">
                                {spec.specification.icon && spec.specification.icon.startsWith('fa-') ? (
                                    <i className={`fas ${spec.specification.icon} text-sm text-(--color-secondary)`}></i>
                                ) : (
                                    <img 
                                        src={spec.specification.icon || '/src/assets/icons/tag.png'} 
                                        alt={spec.specification.name || 'Característica'} 
                                        className="w-4 h-4 object-contain"
                                    />
                                )}
                            </div>
                        )}
                        <h3 className="font-semibold text-gray-700">
                            {spec.specification ? spec.specification.name : 'Característica'}
                        </h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 ml-10">
                        {spec.spValue || 'No especificado'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Characteristics;