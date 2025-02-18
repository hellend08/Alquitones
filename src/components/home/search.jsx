import { useState } from 'react';


const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
        document.getElementById('dropdown').classList.toggle('hidden');
    }

    return (
        <form className="max-w-lg mx-auto">
            <div className="flex relative">
                <button id="dropdown-button" data-dropdown-toggle="dropdown" className="z-10 shrink-0 inline-flex items-center px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100" type="button" onClick={handleClick}>
                    All categories
                    <span className="material-symbols-outlined pl-1">
                        arrow_drop_down
                    </span>
                    <span className="sr-only">Search</span>
                </button>
                {isOpen && (
                    <div id="dropdown" className="z-50 absolute mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40">
                        <ul className=" py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
                            <li>
                                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mockups</button>
                            </li>
                            <li>
                                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Templates</button>
                            </li>
                            <li>
                                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button>
                            </li>
                            <li>
                                <button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logos</button>
                            </li>
                        </ul>
                    </div>
                )}
                <div className="relative w-full">
                    <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 border-s-2 border border-white bg-white rounded-r-lg" placeholder="Busca tu instrumento" required />
                    <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100">
                        <span className="material-symbols-outlined text-gray-600">search</span>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </form>
    )
};

export default SearchBar;