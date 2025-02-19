import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';
import styles from './Admin.module.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Dashboard component (placeholder)
const Dashboard = () => (
    <div className={styles.dashboardContent}>
        <h2>Panel de Administración</h2>
        {/* Add dashboard statistics and overview */}
    </div>
);

// Instruments component (moved from main Admin component)
const Instruments = () => {
    const [instruments, setInstruments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentInstrument, setCurrentInstrument] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        loadInstruments();
    }, [currentPage, searchTerm]);

    const loadInstruments = () => {
        try {
            const allProducts = localDB.getAllProducts();
            let filteredProducts = allProducts;

            if (searchTerm) {
                filteredProducts = allProducts.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;

            setInstruments(filteredProducts.slice(start, end));
            setTotalPages(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
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
        setCurrentPage(1);
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
        const fileInput = document.getElementById('instrument-images');
        const images = fileInput.files;
    
        // Validar que se hayan seleccionado imágenes
        if (images.length === 0) {
            alert('Debe seleccionar al menos una imagen');
            return;
        }
    
        if (images.length > 5) {
            alert('Solo puede seleccionar un máximo de 5 imágenes');
            return;
        }
    
        // Convertir imágenes a base64
        const imagePromises = Array.from(images).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
    
        try {
            const base64Images = await Promise.all(imagePromises);
    
            const instrumentData = {
                name: form['instrument-name'].value,
                categoryId: parseInt(form['instrument-category'].value),
                pricePerDay: parseFloat(form['instrument-price'].value),
                description: form['instrument-description'].value,
                status: form['instrument-status'].value,
                images: base64Images,
                mainImage: base64Images[0]  // Primera imagen como imagen principal
            };
    
            if (modalMode === 'create') {
                await localDB.createProduct(instrumentData);
                alert('Instrumento creado con éxito');
            } else {
                await localDB.updateProduct(currentInstrument.id, instrumentData);
                alert('Instrumento actualizado con éxito');
            }
    
            loadInstruments();
            setModalOpen(false);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al ' + (modalMode === 'create' ? 'crear' : 'actualizar') + ' el instrumento');
        }
    };

    // Agregar esta nueva función dentro del componente Instruments
    const handleDeleteInstrument = async (instrument) => {
        // Mostrar mensaje de confirmación
        const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar el instrumento "${instrument.name}"?`);

        // Si el usuario no confirma, salimos de la función
        if (!confirmDelete) {
            return;
        }

        try {
            // Intentar eliminar el producto
            await localDB.deleteProduct(instrument.id);

            // Recargar la lista de instrumentos
            loadInstruments();

            // Mostrar mensaje de éxito
            alert('Instrumento eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar instrumento:', error);
            alert('Error al eliminar el instrumento');
        }
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
                                <td>
                                    {getProductCategory(instrument.categoryId)}
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${styles[instrument.status.toLowerCase()]}`}>
                                        {instrument.status}
                                    </span>
                                </td>
                                <td>${instrument.pricePerDay.toFixed(2)}</td>
                                <td className={styles.actions}>
                                    {/* <button
                                        onClick={() => handleEditInstrument(instrument)}
                                        className={styles.editButton}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button> */}
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

            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Anterior
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Siguiente
                </button>
            </div>

            {/* Modal for adding/editing instruments (similar to previous implementation) */}
            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{modalMode === 'create' ? 'Agregar Instrumento' : 'Editar Instrumento'}</h3>
                            <button
                                onClick={() => setModalOpen(false)}
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
                                    onClick={() => setModalOpen(false)}
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

// Categories component (placeholder)
const Categories = () => (
    <div className={styles.categoriesContent}>
        <h2>Gestión de Categorías</h2>
        {/* Add category management functionality */}
    </div>
);

// Rentals component (placeholder)
const Rentals = () => (
    <div className={styles.rentalsContent}>
        <h2>Gestión de Alquileres</h2>
        {/* Add rental management functionality */}
    </div>
);

// Users component (placeholder)
const Users = () => (
    <div className={styles.usersContent}>
        <h2>Gestión de Usuarios</h2>
        {/* Add user management functionality */}
    </div>
);

const Admin = () => {
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
                No disponible por el momento en responsive
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