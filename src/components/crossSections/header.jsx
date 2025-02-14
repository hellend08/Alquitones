import { useState } from 'react';
import AuthButtons from './AuthButtons';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <header className='sticky top-0 bg-white flex flex-row p-4 justify-between items-center shadow-md'>
            <img className="" src="src/assets/alquitonesLogo.png" alt="logo" />
            <div className='hidden md:block md:w-auto p-1 text-sm font-normal text-gray-600'>
                <nav className="flex items-center space-x-4 mr-2">
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Inicio</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Quienes somos</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Catalogo</a>
                    <AuthButtons />
                </nav>
            </div>

            <div className="md:hidden flex justify-end">
                <button type="button" className="p-2 w-10 h-10 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false" onClick={handleClick}>
                    <span className="sr-only">Open main menu</span>
                    <span className="material-symbols-outlined text-gray-600">menu</span>
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden text-sm mx-4 font-bold text-gray-600 dark:text-gray-200">
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Inicio</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Quienes somos</a>
                    <a className='relative block rounded-lg p-2 transition hover:scale-125' href="/">Catalogo</a>
                    <AuthButtons />
                </div>
            )}
        </header>
    );
};

export default Header;