

const ProductCards = () => {
    const products = [
        {
            id: 1,
            title: "Noteworthy technology acquisitions 2021",
            description: "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
            image: "src/assets/icons/piano.png",
            link: "#",
        },
        {
            id: 2,
            title: "Tech trends to watch in 2022",
            description: "A look at the most important technology trends that will shape 2022.",
            image: "/docs/images/blog/image-2.jpg",
            link: "#",
        },
        {
            id: 3,
            title: "The future of AI in healthcare",
            description: "Exploring how AI is transforming healthcare and the potential for future breakthroughs.",
            image: "/docs/images/blog/image-3.jpg",
            link: "#",
        },
        {
            id: 4,
            title: "The rise of quantum computing",
            description: "A deep dive into the world of quantum computing and its implications for industries.",
            image: "/docs/images/blog/image-4.jpg",
            link: "#",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
                <div key={product.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <a href={product.link}>
                        <img className="rounded-t-lg" src={product.image} alt={product.title} />
                    </a>
                    <div className="p-5">
                        <a href={product.link}>
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.title}</h5>
                        </a>
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
                        <a href={product.link} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Read more
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCards;
