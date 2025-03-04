// search.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiService } from "../../services/apiService";

import SearchResults from './SearchResults';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [products, setProducts] = useState([]);

      useEffect(() => {
            const fetchData = async () => {
                const data = await apiService.getInstruments();
                setProducts(data);
            };
    
            fetchData();
        }, []);


    const handleSearch = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        
        if (!newSearchTerm.trim()) {
            setSearchResults(null);
            onSearch(null);
            return;
        }
    
        try {
            // 
            const results = products.filter(product => 
                product.name.toLowerCase().includes(newSearchTerm.toLowerCase())
            );
            
            setSearchResults(results);
            onSearch(results);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            setSearchResults([]);
            onSearch([]);
        }
    };

    const handleFocus = () => {
        if (searchTerm.trim()) {
            setShowResults(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowResults(false);
            onSearch(searchResults);
        }
    };

    return (
        <div className="max-w-lg mx-auto relative">
            <form onSubmit={handleSubmit} className="flex mx-4 lg:mx-0">
                {/* <div className="w-full flex"> */}
                    <input 
                        type="search" 
                        id="search-dropdown" 
                        className="p-2.5 w-full text-sm text-gray-900 border-s-2 border border-white bg-white rounded-s-lg" 
                        placeholder="Busca tu instrumento" 
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required 
                    />
                    <button type="submit" className="top-0 end-0 p-2.5 text-sm font-medium h-full bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-100">
                        <span className="material-symbols-outlined text-gray-600">search</span>
                        <span className="sr-only">Search</span>
                    </button>
                {/* </div> */}
            </form>
            <SearchResults 
                results={searchResults} 
                isVisible={showResults && searchTerm.length > 0} 
            />
        </div>
    );
};

// Agregar PropTypes
SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchBar;