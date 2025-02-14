import { useEffect, useState } from 'react';
import { localDB } from '../../database/LocalDB';
import Header from '../crossSections/header';
import Footer from '../crossSections/Footer'

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = localDB.getCurrentUser();
        if (!currentUser) {
            window.location.href = '/login';
            return;
        }
        setUser(currentUser);
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl text-dark-brown font-bold mb-4">
                        Bienvenido a AlquiTones
                    </h1>
                    <p className="text-gray-600">
                        Explora nuestra colección de instrumentos musicales disponibles para alquiler.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;