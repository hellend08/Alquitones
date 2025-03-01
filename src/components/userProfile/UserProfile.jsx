

const UserProfile = () => {
    // Función para renderizar el perfil de usuario
    const renderizarPerfil = () => {
        // Información del usuario
        const usuario = {
            nombre: "Juan Perez",
            email: "juan.perez@email.com",
            descripcion: "jojo",
            fotoPerfil: "https://www.w3schools.com/w3images/avatar2.png",
            arriendos: [
                { id: 1, articulo: "Bicicleta", fecha: "2025-02-20", duracion: "3 días" },
                { id: 2, articulo: "Carpa", fecha: "2025-02-18", duracion: "1 semana" },
                { id: 3, articulo: "Proyector", fecha: "2025-02-10", duracion: "2 días" },
                { id: 4, articulo: "Sillas", fecha: "2025-02-05", duracion: "5 días" },
                { id: 5, articulo: "Cámara", fecha: "2025-01-30", duracion: "4 días" }
            ]
        };

        // Mostrar datos de bienvenida
        document.getElementById("bienvenida").textContent = `Hola ${usuario.nombre.split(" ")[0]}, ¡buenas tardes!`;
        document.getElementById("nombre").textContent = usuario.nombre;
        document.getElementById("email").textContent = usuario.email;
        document.getElementById("descripcion").textContent = usuario.descripcion;
        document.getElementById("fotoPerfil").src = usuario.fotoPerfil;

        // Mostrar tabla de arriendos
        const tablaArriendos = document.getElementById("tablaArriendos");
        usuario.arriendos.forEach((arriendo, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="px-4 py-2 border-b">${index + 1}</td>
            <td class="px-4 py-2 border-b">${arriendo.articulo}</td>
            <td class="px-4 py-2 border-b">${arriendo.fecha}</td>
            <td class="px-4 py-2 border-b">${arriendo.duracion}</td>
          `;
            tablaArriendos.appendChild(row);
        });

        // Funcionalidad de botones
        document.getElementById("agendarArriendo").addEventListener("click", () => {
            alert("Funcionalidad para agendar un arriendo");
        });

        document.getElementById("verCatalogo").addEventListener("click", () => {
            alert("Funcionalidad para ver el catálogo de cosas para arrendar");
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

           
  
      

      
            <table className="mt-8 container mx-auto px-6 py-8">
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
                        <td className="px-4 py-2 font-semibold">Descripción:</td>
                        <td id="descripcion" className="px-4 py-2">Cargando...</td>
                    </tr>
                </tbody>
                </thead>
            </table>
          


            <div className="mt-8 flex justify-around">
                <button id="agendarArriendo" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Agendar Arriendo
                </button>
                <button id="verCatalogo" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Ver Catálogo
                </button>
            </div>




            <div className="container mx-auto px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-800 text-center">Últimos 5 Arriendos</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Imagen</th>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Categoría</th>
                            <th className="px-4 py-2 text-left">Estado</th>
                            <th className="px-4 py-2 text-left">Precio/Día</th>
                            </tr>
                        </thead>
                        <tbody id="tablaArriendos">
                            <tr>
                                <td colSpan="6" className="text-center py-4">Cargando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>


    );


};

export default UserProfile;


