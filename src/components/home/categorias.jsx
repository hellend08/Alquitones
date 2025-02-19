import { localDB } from "../../database/LocalDB";
import { useEffect, useState } from "react";


const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        try {
            const categoriesDB = localDB.data.categories;
            setCategories(categoriesDB);
            console.log(categories)
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mx-4">
            <div className="flex justify-between ">
                {categories.map((src, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-gray-200 w-20 h-20 flex justify-center items-center rounded-full">
                            <img src={src.icon}
                                className="w-10 h-10"
                                alt={src.icon}
                            />
                        </div>
                        <p className="text-xs text-center mt-2">{src.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
