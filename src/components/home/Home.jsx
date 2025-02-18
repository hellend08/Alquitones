import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl text-dark-brown font-bold mb-4">
                        Bienvenido a AlquiTones
                    </h1>
                    <p className="text-gray-600">
                        Explora nuestra colección de instrumentos musicales disponibles para alquiler.
                    </p>
                    <div className="w-36 h-auto bg-amber-200 text-center my-10 ">
                        <Link to="/detail">CardDetails</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;