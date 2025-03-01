import { useState } from 'react';
import AuthButtons from './AuthButtons';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (

        <header className='w-full fixed top-0 bg-white p-4 items-center shadow-md z-50'>
            {/* Desktop */}
            <div className='mx-8 justify-between items-center hidden md:flex'>
                <a href="/" >
                    <img src="/src/assets/logo-light.png" alt="logo" className="h-12" />
                    <p className='text-xs font-stretch-70% text-(--color-secondary)'>Haz que suene sin complicaciones</p>
                </a>
                <nav className="md:flex md:w-auto p-1 text-sm font-semibold text-(--color-secondary) items-center space-x-4 mr-2">
                    <a className='relative block rounded-lg p-2 transition hover:bg-(--color-quinary)' href="/">Inicio</a>
                    {/* <a className='relative block rounded-lg p-2 transition hover:bg-(--color-quinary)' href="/">Nosotros</a>
                    <a className='relative block rounded-lg p-2 transition hover:bg-(--color-quinary)' href="/">Catálogo</a> */}
                    {<AuthButtons />}
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
                    {/* <a className='relative block rounded-lg p-2 ' href="/">Quienes somos</a>
                    <a className='relative block rounded-lg p-2 ' href="/">Catalogo</a> */}
                    <AuthButtons />
                </div>
            )}
        </header>
    );
};

export default Header;