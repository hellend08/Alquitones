


const Category = () => {
    const icons = [
        { icon: "src/assets/icons/piano.png", name: "Piano" },
        { icon: "src/assets/icons/drums.png", name: "Percusión" },
        { icon: "src/assets/icons/flute.png", name: "Viento" },
        { icon: "src/assets/icons/guitar.png", name: "Cuerdas" },
    ];


    return (
        <div className="mx-4">
            <div className="flex justify-between ">
                {icons.map((src, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="bg-gray-200 w-20 h-20 flex justify-center items-center rounded-full">
                            <img src={src.icon}
                                className="w-10 h-10"
                                alt="icon"
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
