
const Category = ({category}) => {
    // const [id, name, icon, description] = category;

    return (
        <div className="mx-4">
            <div className="flex flex-col items-center">
                <div className="bg-(--color-grey) sm:w-20 w-15 sm:h-20 h-15 flex justify-center items-center rounded-full">
                    <img src={category.icon}
                        className="w-10 h-10"
                        alt={category.icon}
                    />
                </div>
                <p className="text-sm text-center font-semibold text-(--color-secondary) mt-2">{category.name}</p>
            </div>
        </div>
    );
};

export default Category;
