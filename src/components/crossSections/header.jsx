import { useState } from 'react';
import AuthButtons from './AuthButtons';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (

        <header className='top-0 fixed w-full bg-white p-4 items-center shadow-md'>
            {/* Desktop */}
            <div className='justify-between items-center hidden md:flex'>
                <a href="/" >
                    <img src="/src/assets/logo-light.png" alt="logo" className="h-12" />
                </a>
                <nav className="md:flex md:w-auto p-1 text-sm font-normal text-gray-600 items-center space-x-4 mr-2">
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Inicio</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Quienes somos</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Catalogo</a>
                    <AuthButtons />
                </nav>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex justify-between items-center">
                <a href="/" >
                    <img src="/src/assets/logo-light.png" alt="logo" className="h-12" />
                </a>
                <button type="button" className="p-2 w-10 h-10 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false" onClick={handleClick}>
                    <span className="sr-only">Open main menu</span>
                    <span className="material-symbols-outlined text-gray-600">menu</span>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden text-sm mx-4 font-bold text-gray-600">
                    <a className='relative block rounded-lg p-2 ' href="/">Inicio</a>
                    <a className='relative block rounded-lg p-2 ' href="/">Quienes somos</a>
                    <a className='relative block rounded-lg p-2 ' href="/">Catalogo</a>
                    <AuthButtons />
                </div>
            )}
        </header>
    );
};

export default Header;