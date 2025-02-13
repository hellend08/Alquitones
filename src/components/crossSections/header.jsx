
const Header = () => {
    return (
        <header className="bg-gray-200 p-4 flex justify-between items-center">
            <img src="src/assets/alquitonesLogo.png" alt="logo" />
            <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> Crear Cuenta </button>
            <button className="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"> Iniciar sesion </button>
            </div>
        </header>
    );
}

export default Header;