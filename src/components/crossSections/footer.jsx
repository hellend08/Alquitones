import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="inset-x-0 bottom-0 bg-gray-200 p-4 lg:py-8 lg:px-10 text-left text-[#001F3F] mt-10">
            <div className="w-full md:flex lg:gap-36">
                <a href="/" className="lg:flex items-center md:w-1/4">
                    <img src="https://alquitones.s3.us-east-2.amazonaws.com/logo-light.png" alt="logo" className="h-auto md:w-full" />
                </a>
                <nav className="md:w-3/4 text-sm lg:text-base text-left flex justify-between md:justify-around py-5 md:py-0">
                    <ul className="flex flex-col">
                        <Link to="/home">Inicio</Link>
                    </ul>
                    <ul className="flex flex-col">
                        <li className="font-medium">Administradores</li>
                        <Link to="/login">Iniciar Sesión</Link>
                        <Link to="/register">Crear Cuenta</Link>
                    </ul>
                    <ul>
                        <li className="font-medium">Contacto</li>
                        <li>9º Avenida Gral. 1234</li>
                        <li>alquitonesapp@gmail.com</li>
                    </ul>
                </nav>
            </div>
            <p className="text-xs lg:text-sm pt-8">&copy; 2025 AlquiTones | Todos los derechos reservados.</p>
        </footer>
    )
}

export default Footer