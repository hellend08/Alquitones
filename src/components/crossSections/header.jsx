import { useState, useEffect } from 'react';
import AuthButtons from './AuthButtons';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    // Detectar scroll para cambios de estilo
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white shadow-md' 
              : 'bg-gradient-to-r from-[#001F3F]/90 to-[#523E1A]/90 backdrop-blur-sm'
        }`}>
            {/* Desktop */}
            <div className='max-w-7xl mx-auto px-4 py-3'>
                <div className='justify-between items-center hidden md:flex'>
                    <Link to="/" className="flex flex-col">
                        <img src="https://alquitones.s3.us-east-2.amazonaws.com/logo-light.png" alt="logo" className="h-12" />
                        <p className={`text-xs font-light transition-colors duration-300 ${
                            isScrolled 
                              ? 'text-[#001F3F]' // Color azul de "Tones" cuando scroll
                              : 'text-[#FFD791]' // Color dorado claro cuando arriba
                        }`}>
                            Haz que suene sin complicaciones
                        </p>
                    </Link>
                    <nav className="flex items-center space-x-6">
                        <Link to="/" className={`relative block text-sm font-semibold transition-colors duration-200 px-3 py-2 rounded-lg ${
                            isScrolled
                              ? 'text-[#001F3F] hover:text-[#9F7833] hover:bg-gray-100'
                              : 'text-[#FFD791] hover:text-white hover:bg-[#9F7833]/20'
                        }`}>
                            Inicio
                        </Link>
                        <AuthButtons />
                    </nav>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex justify-between items-center py-2">
                    <Link to="/">
                        <img src="https://alquitones.s3.us-east-2.amazonaws.com/logo-light.png" alt="logo" className="h-12" />
                    </Link>
                    <button 
                        type="button" 
                        className={`p-2 rounded-lg focus:outline-none ${
                            isScrolled ? 'hover:bg-gray-100' : 'hover:bg-[#9F7833]/20'
                        }`}
                        aria-controls="mobile-menu" 
                        aria-expanded="false" 
                        onClick={handleClick}
                    >
                        <span className="sr-only">Abrir menú principal</span>
                        <span className={`material-symbols-outlined ${isScrolled ? 'text-[#413620]' : 'text-[#FFD791]'}`}>menu</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-lg rounded-b-lg py-3 px-4 mt-2 animate-fadeIn">
                        <Link to="/" className="block text-[#413620] font-medium py-2 hover:text-[#9F7833]">
                            Inicio
                        </Link>
                        <div className="mt-3 border-t pt-3 border-gray-200">
                            <AuthButtons />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;