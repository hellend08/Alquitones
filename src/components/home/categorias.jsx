import { apiService } from "../../services/apiService";
import { useEffect, useState } from "react";


const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getCategories();
            setCategories(data);
        };
        fetchData();
    }, []);

    return (
        <div className="mx-4">
            <div className="flex justify-around ">
                {categories.map((src, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-(--color-grey) sm:w-20 w-15 sm:h-20 h-15 flex justify-center items-center rounded-full">
                            <img src={src.icon}
                                className="w-10 h-10"
                                alt={src.icon}
                            />
                        </div>
                        <p className="text-sm text-center font-semibold text-(--color-secondary) mt-2">{src.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
