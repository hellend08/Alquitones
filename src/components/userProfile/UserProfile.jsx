import React, { useState, useEffect } from "react";
import { localDB } from "../../database/LocalDB";

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = () => {
            const currentUser = localDB.getCurrentUser();
            setUser(currentUser);
        };

        // Verificar estado inicial
        checkUser();

        // Crear un intervalo para verificar cambios
        const interval = setInterval(checkUser, 1000);

        // Limpiar intervalo al desmontar
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localDB.logout();
        setUser(null); // Actualizar estado local inmediatamente
        window.location.href = '/login';
    };

    const handleAuth = (type) => {
        window.location.href = `/${type}`;
    };

    const renderizarPerfil = () => {

        const usuario = {
            arriendos: [
                {
                    "ID": 1,
                    "Imagen": "https://example.com/images/guitar.jpg",
                    "Nombre": "Guitarra Eléctrica",
                    "Categoria": "Cuerda",
                    "Estado": "Disponible",
                    "Duracion": "7 días"
                },
                {
                    "ID": 2,
                    "Imagen": "https://example.com/images/piano.jpg",
                    "Nombre": "Piano Acústico",
                    "Categoria": "Teclado",
                    "Estado": "En uso",
                    "Duracion": "10 días"
                },
                {
                    "ID": 3,
                    "Imagen": "https://example.com/images/drum.jpg",
                    "Nombre": "Batería",
                    "Categoria": "Percusión",
                    "Estado": "Disponible",
                    "Duracion": "5 días"
                },
                {
                    "ID": 4,
                    "Imagen": "https://example.com/images/violin.jpg",
                    "Nombre": "Violín",
                    "Categoria": "Cuerda",
                    "Estado": "En reparación",
                    "Duracion": "3 días"
                },
                {
                    "ID": 5,
                    "Imagen": "https://example.com/images/trumpet.jpg",
                    "Nombre": "Trompeta",
                    "Categoria": "Viento",
                    "Estado": "Disponible",
                    "Duracion": "7 dias"
                }
            ]
        };

        document.getElementById("bienvenida").textContent = `Hola ${user.username.split(" ")[0]}, ¡buenas tardes!`;
        document.getElementById("nombre").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("role").textContent = user.role;
        document.getElementById("createdAt").textContent = user.createdAt.split("T")[0];


        // Mostrar tabla de arriendos
        const tablaArriendos = document.getElementById("tablaArriendos");
        usuario.arriendos.forEach((arriendo, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="px-4 py-2 border-b">${index + 1}</td>
            <td class="px-4 py-2 border-b">${arriendo.Imagen}</td>
            <td class="px-4 py-2 border-b">${arriendo.Nombre}</td>
            <td class="px-4 py-2 border-b">${arriendo.Categoria}</td>
            <td class="px-4 py-2 border-b">${arriendo.Estado}</td>
            <td class="px-4 py-2 border-b">${arriendo.Duracion}</td>
          `;
            tablaArriendos.appendChild(row);
        });

        // Funcionalidad de botones
        document.getElementById("agendarArriendo").addEventListener("click", () => {
            window.location.href = "/Home";
        });

        document.getElementById("verCatalogo").addEventListener("click", () => {
            window.location.href = "/Home";
        });
    };

    // Llamar a la función para renderizar el perfil cuando el DOM esté listo
    window.onload = renderizarPerfil;

    return (
        <>
            <div className="bg-(--color-primary) text-white text-center py-15">
                <h1 id="bienvenida" className="text-4xl font-bold">Cargando...</h1>
                <p className="text-lg mt-2">¡Te damos la bienvenida a tu perfil!</p>
            </div>
            <table className="mt-8 container md:w-2/3 mx-auto px-6 py-8">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left font-bold text-2xl">Información Personal</th>
                    </tr>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Nombre:</td>
                            <td id="nombre" className="px-4 py-2">Cargando...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Email:</td>
                            <td id="email" className="px-4 py-2">Cargando...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Rol:</td>
                            <td id="role" className="px-4 py-2">Cargando...</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold">Te uniste el: </td>
                            <td id="createdAt" className="px-4 py-2">Cargando...</td>
                        </tr>
                    </tbody>
                </thead>
            </table>


            <div className="mt-8 flex justify-around container md:w-2/3 mx-auto">
                <button id="agendarArriendo" className="bg-green-600  text-white px-6 py-2 rounded-lg hover:bg-(--color-primary)">
                    Agendar Arriendo
                </button>
                <button id="verCatalogo" className="bg-(--color-secondary) text-white px-6 py-2 rounded-lg hover:bg-(--color-primary) flex align-center">
                    Ver Catálogo
                    <span className="material-symbols-outlined pl-4"> arrow_forward </span>
                </button>
            </div>




            <div className="container mx-auto py-8 md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 text-center">Últimos 5 Arriendos</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left">ID</th>
                                <th className="px-4 py-2 text-left">Imagen</th>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Categoria</th>
                                <th className="px-4 py-2 text-left">Estado</th>
                                <th className="px-4 py-2 text-left">Duracion</th>
                            </tr>
                        </thead>
                        <tbody id="tablaArriendos">
                        </tbody>
                    </table>
                </div>
            </div>
        </>


    );


};

export default UserProfile;


