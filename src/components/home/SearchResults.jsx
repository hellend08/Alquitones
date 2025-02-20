// SearchResults.jsx
import PropTypes from 'prop-types';

const SearchResults = ({ results = null, isVisible }) => {
    if (!isVisible || !results) return null;

    return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No se encontraron instrumentos
                </div>
            ) : (
                <div className="py-2">
                    {results.map((instrument) => (
                        <div 
                            key={instrument.id} 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <img 
                                    src={instrument.mainImage} 
                                    alt={instrument.name} 
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                    <div className="text-sm font-medium">
                                        {instrument.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        ${instrument.pricePerDay}/día
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

SearchResults.propTypes = {
    results: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            mainImage: PropTypes.string.isRequired,
            pricePerDay: PropTypes.number.isRequired
        })
    ),
    isVisible: PropTypes.bool.isRequired
};

export default SearchResults;