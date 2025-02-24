import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';
import styles from './Admin.module.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from '../crossSections/header';
import Footer from '../crossSections/Footer';



// Dashboard component
const Dashboard = () => (
    <div className={styles.dashboardContent}>
        <div className={styles.placeholderContainer}>
            <img
                src="/src/assets/no-disponible.jpg"
                alt="No disponible"
                className={styles.placeholderImage}
            />
        </div>
    </div>
);

// Instruments component (moved from main Admin component)
const Instruments = () => {
    const [instruments, setInstruments] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentInstrument, setCurrentInstrument] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadInstruments();
    }, [searchTerm, currentPage]);

    const loadInstruments = () => {
        try {
            const paginatedResult = localDB.getProductsPaginated(currentPage, itemsPerPage);

            // Filtrar si hay término de búsqueda
            let filteredProducts = paginatedResult.products;
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setInstruments(filteredProducts);
            setTotalPages(paginatedResult.metadata.totalPages);
        } catch (error) {
            console.error('Error al cargar instrumentos:', error);
            alert('Error al cargar los instrumentos');
        }
    };

    const getProductCategory = (categoryId) => {
        const categories = localDB.data.categories;
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddInstrument = () => {
        setModalMode('create');
        setCurrentInstrument(null);
        setModalOpen(true);
    };

    const handleEditInstrument = (instrument) => {
        setModalMode('edit');
        setCurrentInstrument(instrument);
        setModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const instrumentName = form['instrument-name'].value;

        // Verificar nombre duplicado
        if (checkDuplicateName(instrumentName)) {
            alert('Ya existe un instrumento con este nombre. Por favor, elija un nombre diferente.');
            return;
        }

        const fileInput = document.getElementById('instrument-images');
        const images = fileInput.files;

        try {
            const instrumentData = {
                name: instrumentName,
                categoryId: parseInt(form['instrument-category'].value),
                pricePerDay: parseFloat(form['instrument-price'].value),
                description: form['instrument-description'].value,
                status: form['instrument-status'].value
            };

            // Lógica para manejar imágenes
            if (modalMode === 'create') {
                // En modo creación, las imágenes son obligatorias
                if (images.length === 0) {
                    alert('Debe seleccionar al menos una imagen');
                    return;
                }

                if (images.length > 5) {
                    alert('Solo puede seleccionar un máximo de 5 imágenes');
                    return;
                }

                const imagePromises = Array.from(images).map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                });

                const base64Images = await Promise.all(imagePromises);
                instrumentData.images = base64Images;
                instrumentData.mainImage = base64Images[0];
            } else {
                // En modo edición
                if (images.length > 0) {
                    // Si se seleccionaron nuevas imágenes
                    if (images.length > 5) {
                        alert('Solo puede seleccionar un máximo de 5 imágenes');
                        return;
                    }

                    const imagePromises = Array.from(images).map(file => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        });
                    });

                    const base64Images = await Promise.all(imagePromises);
                    instrumentData.images = base64Images;
                    instrumentData.mainImage = base64Images[0];
                }
            }

            // Lógica de creación o actualización
            if (modalMode === 'create') {
                await localDB.createProduct(instrumentData);
                alert('Instrumento creado con éxito');
            } else {
                await localDB.updateProduct(currentInstrument.id, instrumentData);
                alert('Instrumento actualizado con éxito');
            }

            loadInstruments();
            setModalOpen(false);
            setPreviews([]);
        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('nombre ya existe')) {
                alert('Ya existe un instrumento con este nombre. Por favor, elija un nombre diferente.');
            } else {
                alert('Error al ' + (modalMode === 'create' ? 'crear' : 'actualizar') + ' el instrumento');
            }
        }
    };

    const handleDeleteInstrument = async (instrument) => {
        const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar el instrumento "${instrument.name}"?`);

        if (!confirmDelete) {
            return;
        }

        try {
            await localDB.deleteProduct(instrument.id);
            // Update the local state immediately by filtering out the deleted instrument
            setInstruments(prevInstruments =>
                prevInstruments.filter(item => item.id !== instrument.id)
            );
            alert('Instrumento eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar instrumento:', error);
            alert('Error al eliminar el instrumento');
        }
    };

    const checkDuplicateName = (name) => {
        const normalizedName = name.trim().toLowerCase();
        return instruments.some(instrument =>
            instrument.name.trim().toLowerCase() === normalizedName &&
            (modalMode === 'create' || instrument.id !== currentInstrument?.id)
        );
    };

    // Manejadores de paginación
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    return (
        <div className={styles.instrumentsSection}>
            <div className={styles.sectionHeader}>
                <h2>Gestión de Instrumentos</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchContainer}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9C9C9C',
                            fontSize: '20px'
                        }}>
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                            style={{ paddingLeft: '35px' }}
                        />
                    </div>
                    <button
                        onClick={handleAddInstrument}
                        className={styles.addButton}
                    >
                        <i className="fas fa-plus"></i> Agregar Instrumento
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.instrumentsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Precio/Día</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instruments.map(instrument => (
                            <tr key={instrument.id}>
                                <td>{instrument.id}</td>
                                <td>
                                    <img
                                        src={instrument.mainImage}
                                        alt={instrument.name}
                                        className={styles.productImage}
                                    />
                                </td>
                                <td>{instrument.name}</td>
                                <td>{getProductCategory(instrument.categoryId)}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[instrument.status.toLowerCase()]}`}>
                                        {instrument.status}
                                    </span>
                                </td>
                                <td>${instrument.pricePerDay.toFixed(2)}</td>
                                <td className="flex items-center gap-4 h-[83.33px]">
                                    <button
                                        onClick={() => handleEditInstrument(instrument)}
                                        className={styles.editButton}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteInstrument(instrument)}
                                        className={styles.deleteButton}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{modalMode === 'create' ? 'Agregar Instrumento' : 'Editar Instrumento'}</h3>
                            <button
                                onClick={() => {
                                    setModalOpen(false);
                                    setPreviews([]);
                                }}
                                className={styles.modalClose}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleModalSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-name">Nombre del Instrumento</label>
                                <input
                                    type="text"
                                    id="instrument-name"
                                    defaultValue={currentInstrument?.name || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-category">Categoría</label>
                                <select
                                    id="instrument-category"
                                    defaultValue={currentInstrument?.categoryId || ''}
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {localDB.data.categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-price">Precio por día</label>
                                <input
                                    type="number"
                                    id="instrument-price"
                                    min="0"
                                    step="0.01"
                                    defaultValue={currentInstrument?.pricePerDay || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-images">Imágenes del Instrumento</label>
                                <input
                                    type="file"
                                    id="instrument-images"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        const previews = Array.from(files).map(file => URL.createObjectURL(file));
                                        setPreviews(previews);
                                    }}
                                />
                                {previews.length > 0 && (
                                    <div className={styles.imagePreviewContainer}>
                                        {previews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className={styles.imagePreview}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-description">Descripción</label>
                                <textarea
                                    id="instrument-description"
                                    rows="4"
                                    defaultValue={currentInstrument?.description || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-status">Estado</label>
                                <select
                                    id="instrument-status"
                                    defaultValue={currentInstrument?.status || 'Disponible'}
                                    required
                                >
                                    <option value="Disponible">Disponible</option>
                                    <option value="Reservado">Reservado</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setPreviews([]);
                                    }}
                                    className={styles.modalBtnSecondary}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.modalBtnPrimary}
                                >
                                    {modalMode === 'create' ? 'Crear' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Categories component
const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);
    
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadCategories();
    }, [searchTerm, currentPage]);

    const loadCategories = () => {
        try {
            const allCategories = localDB.getAllCategories();
            let filteredCategories = allCategories;

            if (searchTerm) {
                filteredCategories = allCategories.filter(category =>
                    category.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Calcular paginación manualmente
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

            setCategories(paginatedCategories);
            setTotalPages(Math.ceil(filteredCategories.length / itemsPerPage));
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            alert('Error al cargar las categorías');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar a primera página al buscar
    };

    const handleAddCategory = () => {
        setModalMode('create');
        setCurrentCategory(null);
        setModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setModalMode('edit');
        setCurrentCategory(category);
        setModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const iconInput = document.getElementById('category-icon');
        const icon = iconInput.files.length > 0 
            ? URL.createObjectURL(iconInput.files[0]) 
            : (currentCategory?.icon || '/src/assets/icons/default-category.png');

        const categoryData = {
            name: form['category-name'].value,
            description: form['category-description'].value,
            icon: icon
        };

        try {
            if (modalMode === 'create') {
                await localDB.createCategory(categoryData);
                alert('Categoría creada con éxito');
            } else {
                await localDB.updateCategory(currentCategory.id, categoryData);
                alert('Categoría actualizada con éxito');
            }

            loadCategories();
            setModalOpen(false);
            setPreviews([]);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleDeleteCategory = async (category) => {
        const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar la categoría "${category.name}"?`);

        if (!confirmDelete) return;

        try {
            await localDB.deleteCategory(category.id);
            loadCategories(); // Recargar categorías después de eliminar
            alert('Categoría eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            alert(error.message);
        }
    };

    // Manejadores de paginación
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className={styles.instrumentsSection}>
            <div className={styles.sectionHeader}>
                <h2>Gestión de Categorías</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchContainer}>
                        <span className="material-symbols-outlined" style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9C9C9C',
                            fontSize: '20px'
                        }}>
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                            style={{ paddingLeft: '35px' }}
                        />
                    </div>
                    <button
                        onClick={handleAddCategory}
                        className={styles.addButton}
                    >
                        <i className="fas fa-plus"></i> Agregar Categoría
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.instrumentsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ícono</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className={styles.productImage}
                                    />
                                </td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>{localDB.getProductsByCategory(category.id).length}</td>
                                <td className="flex items-center gap-4 h-[83.33px]">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className={styles.editButton}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category)}
                                        className={styles.deleteButton}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Primero
                </button>
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Anterior
                </button>
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Siguiente
                </button>
            </div>

            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{modalMode === 'create' ? 'Agregar Categoría' : 'Editar Categoría'}</h3>
                            <button
                                onClick={() => {
                                    setModalOpen(false);
                                    setPreviews([]);
                                }}
                                className={styles.modalClose}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleModalSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="category-name">Nombre de la Categoría</label>
                                <input
                                    type="text"
                                    id="category-name"
                                    defaultValue={currentCategory?.name || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="category-description">Descripción</label>
                                <textarea
                                    id="category-description"
                                    rows="4"
                                    defaultValue={currentCategory?.description || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="category-icon">Ícono de Categoría</label>
                                <input
                                    type="file"
                                    id="category-icon"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        const previews = Array.from(files).map(file => URL.createObjectURL(file));
                                        setPreviews(previews);
                                    }}
                                />
                                {previews.length > 0 && (
                                    <div className={styles.imagePreviewContainer}>
                                        {previews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className={styles.imagePreview}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setPreviews([]);
                                    }}
                                    className={styles.modalBtnSecondary}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.modalBtnPrimary}
                                >
                                    {modalMode === 'create' ? 'Crear' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Rentals component
const Rentals = () => (
    <div className={styles.rentalsContent}>
        <div className={styles.placeholderContainer}>
            <img
                src="/src/assets/no-disponible.jpg"
                alt="No disponible"
                className={styles.placeholderImage}
            />
        </div>
    </div>
);

// Users component
const Users = () => (
    <div className={styles.usersContent}>
        <div className={styles.placeholderContainer}>
            <img
                src="/src/assets/no-disponible.jpg"
                alt="No disponible"
                className={styles.placeholderImage}
            />
        </div>
    </div>
);

const Admin = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link); // Limpia al desmontar el componente
        };
    }, []);

    // const navigate = useNavigate();
    // // const [user, setUser] = useState(null);

    // useEffect(() => {
    //     checkAdmin();
    // }, []);

    // const checkAdmin = () => {
    //     const currentUser = localDB.getCurrentUser();
    //     if (!currentUser || currentUser.role !== 'admin') {
    //         navigate('/login');
    //         return;
    //     }
    //     setUser(currentUser);
    // };

    // // const handleLogout = () => {
    // //     localDB.logout();
    // //     navigate('/login');
    // // };

    return (
        <div>

            {/* Agregar el div del mensaje responsive */}
            <div className={styles.responsiveMessage}>
                <Header />
                <div className={styles.responsiveContent}>
                    <div className="w-[90%]">
                        {/* <img 
                src="/src/assets/no-disponible.jpg" 
                alt="Vista no disponible en móviles" 
                className={styles.responsiveImage}
            /> */}
                        <h3 className="pt-3 text-3xl font-semibold">Esta modalidad no esta disponible en móviles.</h3>
                    </div>
                </div>
                <Footer />
            </div>

            <div className={styles.adminContainer}>
                <aside className={styles.sidebar}>
                    <nav className={styles.sidebarNav}>
                        <ul>
                            <li>
                                <Link to="/admin/dashboard">
                                    <i className="fas fa-home"></i> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/instruments">
                                    <i className="fas fa-guitar"></i> Lista Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/rentals">
                                    <i className="fas fa-calendar-alt"></i> Alquileres
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/categories">
                                    <i className="fas fa-tags"></i> Categorías
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/users">
                                    <i className="fas fa-users"></i> Usuarios
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className={styles.mainContent}>
                    <div className={styles.contentArea}>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="instruments" element={<Instruments />} />
                            <Route path="rentals" element={<Rentals />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="users" element={<Users />} />
                            <Route path="" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;