// src/components/cardDetails/ProductPolicies.jsx
import React from 'react';

const ProductPolicies = () => {
  const policies = [
    {
      title: "Cuidado y Mantenimiento",
      description: "Mantén el instrumento en un lugar seco y a temperatura ambiente. Limpia con un paño suave después de cada uso."
    },
    {
      title: "Transporte Seguro",
      description: "Siempre transporta el instrumento en su estuche designado para evitar daños durante el movimiento."
    },
    {
      title: "Devolución",
      description: "El instrumento debe ser devuelto en las mismas condiciones en que fue alquilado, sin daños ni modificaciones."
    },
    {
      title: "Prohibiciones",
      description: "No está permitido realizar modificaciones, pintar o alterar el instrumento de ninguna manera."
    },
    {
      title: "Responsabilidad",
      description: "El cliente es responsable de cualquier daño que exceda el desgaste normal durante el período de alquiler."
    },
    {
      title: "Extensión de Alquiler",
      description: "Si necesitas extender el período de alquiler, notifica con al menos 24 horas de anticipación."
    }
  ];

  return (
    <div className="w-full bg-gray-100 rounded-lg p-4 my-5">
      <h2 className="text-xl font-bold text-(--color-secondary) mb-4 pb-2 border-b-2 border-(--color-primary)">
        Políticas de uso
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy, index) => (
          <div key={index} className="p-3">
            <h3 className="font-semibold text-gray-700 mb-2">{policy.title}</h3>
            <p className="text-sm text-gray-600">{policy.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPolicies;