


const SearchBar = () => {


    return (
        <form className="max-w-lg mx-auto ">
            <div className="flex">
                <div className="w-full flex">
                    <input type="search" id="search-dropdown" className=" p-2.5 w-full text-sm text-gray-900 border-s-2 border border-white bg-white rounded-s-lg" placeholder="Busca tu instrumento" required />
                    <button type="submit" className="top-0 end-0 p-2.5 text-sm font-medium h-full bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100">
                        <span className="material-symbols-outlined text-gray-600">search</span>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </form>
    )
};

export default SearchBar;