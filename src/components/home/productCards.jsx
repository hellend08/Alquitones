import { useState, useEffect } from "react";
import { localDB } from "../../database/LocalDB";

const ProductCards = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        recomendedProducts();
    }
        , []);

    const recomendedProducts = () => {
        try {
            const productsDB = localDB.getAllProducts();
            if (productsDB.length > 0) {
                setProducts(productsDB);
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {products.map((product) => (
                <div key={product.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm ">
                    <a href={product.link}>
                    <img className="h-48 w-96 object-contain rounded-t-lg" src={product.mainImage} alt={product.name} />
                    </a>
                    <div className="p-5">
                        <a href={product.link}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{product.name}</h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
                        <a href={product.link} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-(--color-primary) rounded-lg hover:bg-(--color-primary-dark)">
                            Read more
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCards;
