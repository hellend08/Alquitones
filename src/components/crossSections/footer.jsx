import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-200 p-4 lg:py-8 lg:px-10 text-left text-[#001F3F]">
            <div className="w-full md:flex lg:gap-32">
                <a href="/" className="lg:flex items-center md:w-1/4">
                    <img src="/src/assets/logo-light.png" alt="logo" className="h-auto md:w-full" />
                </a>
                <nav className="md:w-3/4 text-sm lg:text-base text-left flex justify-between md:justify-around lg:gap-40 py-5 md:py-0">
                    <ul>
                        <li>
                            <a>Inicio</a>
                        </li>
                        <li>
                            <a>Nosotros</a>
                        </li>
                        <li>
                            <a>Catalogo</a>
                        </li>
                    </ul>
                    <ul>
                        <li>Administradores</li>
                        <li>Lorem</li>
                        <li>Lorem</li>
                    </ul>
                    <ul>
                        <li>Contacto</li>
                        <li>Av. Alfonso Ugarte 127</li>
                        <li>Lorem</li>
                    </ul>
                </nav>
            </div>
            <p className="text-xs lg:text-sm pt-8">&copy; 2025 AlquiTones | Todos los derechos reservados.</p>
        </footer>
    )
}

export default Footer