import { Link } from "react-router-dom";

function Footer() {
    // Función para llevar al top de la página
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="inset-x-0 bottom-0 bg-gradient-to-r from-gray-100 to-gray-200 p-6 lg:py-12 lg:px-16 text-left text-[#001F3F] mt-10 border-t border-gray-300">
            <div className="mx-auto">
                <div className="w-full flex flex-col md:flex-row md:justify-between lg:gap-20">
                    {/* Logo y descripción */}
                    <div className="md:w-1/3 mb-8 md:mb-0">
                        <Link to="/" className="block mb-4" onClick={scrollToTop}>
                            <img 
                                src="https://alquitones.s3.us-east-2.amazonaws.com/logo-light.png" 
                                alt="AlquiTones Logo" 
                                className="h-16 md:h-20 w-auto" 
                            />
                        </Link>
                        <p className="text-sm text-gray-600 mt-3 pr-4">
                            Tu plataforma de alquiler de instrumentos musicales. Hacemos que la música sea accesible para todos.
                        </p>
                    </div>
                    
                    {/* Navegación y enlaces */}
                    <nav className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Columna 1 */}
                        <div>
                            <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-300">Navegación</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-gray-700 hover:text-[#9F7933] transition-colors duration-300 flex items-center" onClick={scrollToTop}>
                                        <span className="material-symbols-outlined text-sm mr-2">home</span>
                                        Inicio
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Columna 2 */}
                        <div>
                            <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-300">Cuenta</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/login" className="text-gray-700 hover:text-[#9F7933] transition-colors duration-300 flex items-center" onClick={scrollToTop}>
                                        <span className="material-symbols-outlined text-sm mr-2">login</span>
                                        Iniciar Sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="text-gray-700 hover:text-[#9F7933] transition-colors duration-300 flex items-center" onClick={scrollToTop}>
                                        <span className="material-symbols-outlined text-sm mr-2">person_add</span>
                                        Crear Cuenta
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Columna 3 */}
                        <div>
                            <h3 className="font-bold text-base mb-4 pb-2 border-b border-gray-300">Contacto</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-sm mr-2 mt-1">location_on</span>
                                    <span>9º Avenida Gral. 1234</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="material-symbols-outlined text-sm mr-2 mt-1">email</span>
                                    <a href="mailto:alquitonesapp@gmail.com" className="text-gray-700 hover:text-[#9F7933] transition-colors duration-300">
                                        alquitonesapp@gmail.com
                                    </a>
                                </li>
                                <li className="flex items-start mt-4">
                                    <div className="flex space-x-3">
                                        <a href="#" className="text-gray-600 hover:text-[#9F7933]" aria-label="Facebook">
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-[#9F7933]" aria-label="Instagram">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                        <a href="#" className="text-gray-600 hover:text-[#9F7933]" aria-label="Twitter">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                
                {/* Copyright */}
                <div className="border-t border-gray-300 mt-8 pt-6 flex flex-col md:flex-row md:justify-between items-center text-gray-600">
                    <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} AlquiTones | Todos los derechos reservados</p>
                    <div className="flex space-x-8 text-sm">
                        <Link to="/terms" className="hover:text-[#9F7933]">Términos y Condiciones</Link>
                        <Link to="/privacy" className="hover:text-[#9F7933]">Política de Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;