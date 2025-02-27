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


    useEffect(() => {
        loadInstruments();
    }, [searchTerm]);

    const loadInstruments = () => {
        try {
            // Obtener todos los productos sin paginación
            const result = localDB.getProductsPaginated(
                1,
                Infinity, // Tamaño infinito para obtener todos
                searchTerm,
                false // Desactivar paginación
            );

            setInstruments(result.products);
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
        const fileInput = document.getElementById('instrument-images');
        const images = Array.from(fileInput.files);

        // Validación de imágenes SOLO para creación
        if (modalMode === 'create' && (images.length < 1 || images.length > 5)) {
            alert('Debes seleccionar entre 1 y 5 imágenes');
            return;
        }

        try {
            // Convertir imágenes solo si hay nuevas
            const imageUrls = images.length > 0
                ? await Promise.all(images.map(file => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    });
                }))
                : null;

            // Recopilar especificaciones
            const specifications = localDB.getAllSpecifications();
            const productSpecifications = specifications
                .map(spec => {
                    const value = form[`spec-${spec.id}`]?.value;
                    return value?.trim() ? {
                        spValue: value.trim(),
                        specification: { id: spec.id }
                    } : null;
                })
                .filter(spec => spec !== null);

            // Usar valores existentes si los campos están vacíos
            const instrumentData = {
                name: form['instrument-name'].value.trim() || currentInstrument?.name,
                categoryId: parseInt(form['instrument-category'].value) || currentInstrument?.categoryId,
                pricePerDay: parseFloat(form['instrument-price'].value) || currentInstrument?.pricePerDay,
                description: form['instrument-description'].value.trim() || currentInstrument?.description,
                status: form['instrument-status'].value || currentInstrument?.status,
                images: imageUrls || currentInstrument?.images,
                mainImage: (imageUrls?.[0]) || currentInstrument?.mainImage,
                specifications: productSpecifications.length > 0 ? productSpecifications : currentInstrument?.specifications
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
            setPreviews([]);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
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
        // Permitir campo vacío en edición
        if (modalMode === 'edit' && !normalizedName) return false;

        return instruments.some(instrument =>
            instrument.name.trim().toLowerCase() === normalizedName &&
            (modalMode === 'create' || instrument.id !== currentInstrument?.id)
        );
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

                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-category">Categoría</label>
                                <select
                                    id="instrument-category"
                                    defaultValue={currentInstrument?.categoryId || ''}

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

                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-images">Imágenes del Instrumento</label>
                                <input
                                    type="file"
                                    id="instrument-images"
                                    accept="image/*"
                                    multiple
                                    required={modalMode === 'create'} // Solo requerido en creación
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
                                <label>Características</label>
                                <div className={styles.specificationsContainer}>
                                    {localDB.getAllSpecifications().map(spec => (
                                        <div key={spec.id} className={styles.specificationItem}>
                                            <label htmlFor={`spec-${spec.id}`}>{spec.name}</label>
                                            <input
                                                type="text"
                                                id={`spec-${spec.id}`}
                                                name={`spec-${spec.id}`}
                                                placeholder={`Valor para ${spec.name}`}
                                                defaultValue={
                                                    currentInstrument?.specifications?.find(
                                                        s => s.specification.id === spec.id
                                                    )?.spValue || ''
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-description">Descripción</label>
                                <textarea
                                    id="instrument-description"
                                    rows="4"
                                    defaultValue={currentInstrument?.description || ''}

                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="instrument-status">Estado</label>
                                <select
                                    id="instrument-status"
                                    defaultValue={currentInstrument?.status || 'Disponible'}

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

// Nuevo componente Specifications para Admin.jsx
// Nuevo componente Specifications actualizado con iconos
const Specifications = () => {
    const [specifications, setSpecifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentSpecification, setCurrentSpecification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadSpecifications();
    }, [searchTerm, currentPage]);

    useEffect(() => {
        // Añadir lógica de toggle para mostrar/ocultar selectores basado en radio button
        if (modalOpen) {
            const radioFontAwesome = document.querySelector('input[name="icon-type"][value="font-awesome"]');
            const radioImage = document.querySelector('input[name="icon-type"][value="image"]');
            const fontAwesomeSelector = document.getElementById('font-awesome-selector');
            const imageSelector = document.getElementById('image-selector');
            const iconClassSelect = document.getElementById('icon-class');
            const iconPreviewContainer = document.querySelector(`.${styles.iconPreviewBox}`);

            const updateVisibility = () => {
                if (radioFontAwesome.checked) {
                    fontAwesomeSelector.style.display = 'block';
                    imageSelector.style.display = 'none';
                } else {
                    fontAwesomeSelector.style.display = 'none';
                    imageSelector.style.display = 'block';
                }
            };

            const updateIconPreview = () => {
                const selectedIcon = iconClassSelect.value;
                iconPreviewContainer.querySelectorAll('i').forEach(icon => {
                    icon.classList.remove(styles.selectedIcon);
                    if (icon.classList.contains(selectedIcon)) {
                        icon.classList.add(styles.selectedIcon);
                    }
                });
            };

            const handleIconSelection = (e) => {
                if (e.target.classList.contains('fas')) {
                    iconClassSelect.value = e.target.classList[1];
                    updateIconPreview();
                }
            };

            // Actualizar visibilidad inicial
            updateVisibility();
            updateIconPreview();

            // Añadir event listeners
            radioFontAwesome.addEventListener('change', updateVisibility);
            radioImage.addEventListener('change', updateVisibility);
            iconClassSelect.addEventListener('change', updateIconPreview);
            iconPreviewContainer.addEventListener('click', handleIconSelection);

            // Cleanup
            return () => {
                radioFontAwesome?.removeEventListener('change', updateVisibility);
                radioImage?.removeEventListener('change', updateVisibility);
                iconClassSelect?.removeEventListener('change', updateIconPreview);
                iconPreviewContainer?.removeEventListener('click', handleIconSelection);
            };
        }
    }, [modalOpen]);

    const loadSpecifications = () => {
        try {
            const allSpecifications = localDB.getAllSpecifications();
            // Verificación adicional
            if (!Array.isArray(allSpecifications)) {
                console.error("Las especificaciones no son un array");
                setSpecifications([]);
                setTotalPages(1);
                return;
            }
            let filteredSpecifications = allSpecifications;

            // Calcular paginación manualmente
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedSpecifications = filteredSpecifications.slice(startIndex, endIndex);

            setSpecifications(paginatedSpecifications);
            setTotalPages(Math.ceil(filteredSpecifications.length / itemsPerPage));
        } catch (error) {
            console.error('Error al cargar características:', error);
            alert('Error al cargar las características');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar a primera página al buscar
    };

    const handleAddSpecification = () => {
        setModalMode('create');
        setCurrentSpecification(null);
        setPreviews([]);
        setModalOpen(true);
    };

    const handleEditSpecification = (specification) => {
        setModalMode('edit');
        setCurrentSpecification(specification);
        setPreviews([]);
        setModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const iconInput = document.getElementById('specification-icon');

        // Obtener el icono (ya sea una imagen subida o seleccionado del dropdown)
        let icon;
        if (form['icon-type'].value === 'font-awesome') {
            icon = form['icon-class'].value;
        } else {
            icon = iconInput.files.length > 0
                ? URL.createObjectURL(iconInput.files[0])
                : (currentSpecification?.icon || 'fa-tag');
        }

        const specificationData = {
            name: form['specification-name'].value,
            description: form['specification-description'].value,
            icon: icon
        };

        try {
            if (modalMode === 'create') {
                await localDB.createSpecification(specificationData);
                alert('Característica creada con éxito');
            } else {
                await localDB.updateSpecification(currentSpecification.id, specificationData);
                alert('Característica actualizada con éxito');
            }

            loadSpecifications();
            setModalOpen(false);
            setPreviews([]);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleDeleteSpecification = async (specification) => {
        const confirmDelete = window.confirm(`¿Estás seguro que deseas eliminar la característica "${specification.name}"?`);

        if (!confirmDelete) return;

        try {
            await localDB.deleteSpecification(specification.id);
            loadSpecifications();
            alert('Característica eliminada exitosamente');
        } catch (error) {
            console.error('Error al eliminar característica:', error);
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

    // Iconos de Font Awesome disponibles para características
    const fontAwesomeIcons = [
        { value: 'fa-trademark', label: 'Marca (Trademark)' },
        { value: 'fa-certificate', label: 'Certificado' },
        { value: 'fa-tag', label: 'Etiqueta' },
        { value: 'fa-cube', label: 'Cubo (Modelo)' },
        { value: 'fa-boxes', label: 'Cajas' },
        { value: 'fa-barcode', label: 'Código de barras' },
        { value: 'fa-layer-group', label: 'Capas (Material)' },
        { value: 'fa-atom', label: 'Átomo' },
        { value: 'fa-tree', label: 'Árbol (Madera)' },
        { value: 'fa-shapes', label: 'Formas (Tipo)' },
        { value: 'fa-project-diagram', label: 'Diagrama' },
        { value: 'fa-th-large', label: 'Cuadrícula' },
        { value: 'fa-cogs', label: 'Engranajes (Técnico)' },
        { value: 'fa-sliders-h', label: 'Controles' },
        { value: 'fa-tachometer-alt', label: 'Tacómetro' },
        { value: 'fa-plug', label: 'Enchufe (Accesorios)' },
        { value: 'fa-tools', label: 'Herramientas' },
        { value: 'fa-puzzle-piece', label: 'Puzzle' },
        { value: 'fa-guitar', label: 'Guitarra' },
        { value: 'fa-drum', label: 'Batería' },
        { value: 'fa-music', label: 'Nota musical' },
        { value: 'fa-volume-up', label: 'Volumen' },
        { value: 'fa-microphone', label: 'Micrófono' }
    ];

    return (
        <div className={styles.specificationsSection}>
            <div className={styles.sectionHeader}>
                <h2>Gestión de Características</h2>
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
                        onClick={handleAddSpecification}
                        className={styles.addButton}
                    >
                        <i className="fas fa-plus"></i> Agregar Característica
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.instrumentsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Icono</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Productos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specifications.map(specification => (
                            <tr key={specification.id}>
                                <td>{specification.id}</td>
                                <td>
                                    {specification.icon?.startsWith('fa-') ? (
                                        <i className={`fas ${specification.icon} fa-2x`} style={{ color: '#9C6615' }}></i>
                                    ) : (
                                        <img
                                            src={specification.icon}
                                            alt={`Icono de ${specification.name}`}
                                            className={styles.productImage}
                                        />
                                    )}
                                </td>
                                <td>{specification.name}</td>
                                <td>{specification.description}</td>
                                <td>{localDB.getProductsBySpecification(specification.id).length}</td>
                                <td className="flex items-center gap-4 h-[83.33px]">
                                    <button
                                        onClick={() => handleEditSpecification(specification)}
                                        className={styles.editButton}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSpecification(specification)}
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
                            <h3>{modalMode === 'create' ? 'Agregar Característica' : 'Editar Característica'}</h3>
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
                                <label htmlFor="specification-name">Nombre de la Característica</label>
                                <input
                                    type="text"
                                    id="specification-name"
                                    defaultValue={currentSpecification?.name || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="specification-description">Descripción</label>
                                <textarea
                                    id="specification-description"
                                    rows="4"
                                    defaultValue={currentSpecification?.description || ''}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tipo de Icono</label>
                                <div className={styles.iconTypeSelector}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="icon-type"
                                            value="font-awesome"
                                            defaultChecked={currentSpecification?.icon?.startsWith('fa-') || !currentSpecification}
                                        />
                                        Icono Font Awesome
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="icon-type"
                                            value="image"
                                            defaultChecked={currentSpecification?.icon && !currentSpecification.icon.startsWith('fa-')}
                                        />
                                        Imagen personalizada
                                    </label>
                                </div>
                            </div>
                            <div className={styles.formGroup} id="font-awesome-selector">
                                <label htmlFor="icon-class">Seleccionar Icono</label>
                                <select
                                    id="icon-class"
                                    name="icon-class"
                                    defaultValue={currentSpecification?.icon?.startsWith('fa-') ? currentSpecification.icon : 'fa-tag'}
                                >
                                    {fontAwesomeIcons.map((icon, index) => (
                                        <option key={index} value={icon.value}>
                                            {icon.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.iconPreview}>
                                    <p>Vista previa:</p>
                                    <div className={styles.iconPreviewBox}>
                                        {fontAwesomeIcons.map((icon, index) => (
                                            <i
                                                key={index}
                                                className={`fas ${icon.value} fa-2x`}
                                                title={icon.label}
                                                style={{
                                                    display: 'inline-block',
                                                    margin: '5px',
                                                    cursor: 'pointer',
                                                    color: '#9C6615'
                                                }}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroup} id="image-selector">
                                <label htmlFor="specification-icon">Imagen Personalizada</label>
                                <input
                                    type="file"
                                    id="specification-icon"
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
// Actualizar el componente Users en Admin.jsx
// Users component con popup de confirmación
const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    
    // Estados para el popup de confirmación
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingRoleChange, setPendingRoleChange] = useState(null);
    
    useEffect(() => {
        loadUsers();
    }, [searchTerm, currentPage]);
    
    const loadUsers = () => {
        try {
            const allUsers = localDB.getAllUsers();
            console.log('Todos los usuarios:', allUsers);
            
            let filteredUsers = allUsers;
            
            if (searchTerm) {
                filteredUsers = allUsers.filter(user => 
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            // Calcular paginación
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
            
            setUsers(paginatedUsers);
            setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Error al cargar los usuarios');
        }
    };
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    
    // Modificado para mostrar la confirmación
    const initiateRoleChange = (userId, newRole, currentRole) => {
        // Si no hay cambio, no hacer nada
        if (newRole === currentRole) return;
        
        // Obtener información del usuario
        const user = users.find(u => u.id === userId);
        if (!user) return;
        
        // Guardar la información del cambio pendiente
        setPendingRoleChange({
            userId,
            username: user.username,
            currentRole,
            newRole
        });
        
        // Mostrar el popup de confirmación
        setShowConfirmation(true);
    };
    
    // Ejecutar el cambio de rol después de la confirmación
    const executeRoleChange = async () => {
        if (!pendingRoleChange) return;
        
        try {
            // Obtener el usuario actual para verificar que no se quite permisos a sí mismo
            const currentUser = localDB.getCurrentUser();
            if (currentUser && currentUser.id === pendingRoleChange.userId && pendingRoleChange.newRole !== 'admin') {
                alert('No puedes quitarte permisos de administrador a ti mismo');
                setShowConfirmation(false);
                return;
            }
            
            // Actualizar el rol del usuario
            await localDB.updateUser(pendingRoleChange.userId, { role: pendingRoleChange.newRole });
            
            // Verificar explícitamente que los cambios se guardaron correctamente
            const updatedUsers = localDB.getAllUsers();
            const updatedUser = updatedUsers.find(u => u.id === pendingRoleChange.userId);
            
            if (!updatedUser || updatedUser.role !== pendingRoleChange.newRole) {
                throw new Error('Error: Los cambios no se aplicaron correctamente');
            }
            
            // Forzar una actualización de localStorage
            localDB.saveToStorage();
            
            // Si el usuario modificado es el actual, actualizar la sesión
            if (currentUser && currentUser.id === pendingRoleChange.userId) {
                // Actualizar el usuario en sesión con el nuevo rol
                const updatedCurrentUser = {
                    ...currentUser,
                    role: pendingRoleChange.newRole
                };
                localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
            }
            
            // Recargar la lista de usuarios
            loadUsers();
            alert(`Permisos actualizados correctamente`);
        } catch (error) {
            console.error('Error al cambiar permisos:', error);
            alert(`Error al cambiar permisos: ${error.message}`);
        } finally {
            // Cerrar el popup y limpiar el estado
            setShowConfirmation(false);
            setPendingRoleChange(null);
        }
    };
    
    // Cancelar el cambio de rol
    const cancelRoleChange = () => {
        setShowConfirmation(false);
        setPendingRoleChange(null);
        // Recargar los usuarios para restaurar los selectores
        loadUsers();
    };
    
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
        <div className={styles.usersSection}>
            <div className={styles.sectionHeader}>
                <h2>Gestión de Usuarios</h2>
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
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                            style={{ paddingLeft: '35px' }}
                        />
                    </div>
                </div>
            </div>
            
            <div className={styles.tableContainer}>
                <table className={styles.instrumentsTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha de creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${user.role === 'admin' ? styles.disponible : styles.reservado}`}>
                                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => initiateRoleChange(user.id, e.target.value, user.role)}
                                        className={styles.roleSelector}
                                    >
                                        <option value="client">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
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
                <span className="mx-2">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Siguiente
                </button>
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Último
                </button>
            </div>
            
            {/* Popup de confirmación */}
            {showConfirmation && pendingRoleChange && (
                <div className={styles.modal}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader}>
                            <h3>Confirmar cambio de rol</h3>
                            <button
                                onClick={cancelRoleChange}
                                className={styles.modalClose}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <p style={{ marginBottom: '1rem' }}>
                                ¿Estás seguro de que deseas cambiar el rol de <strong>{pendingRoleChange.username}</strong> de 
                                <strong> {pendingRoleChange.currentRole === 'admin' ? 'Administrador' : 'Cliente'}</strong> a 
                                <strong> {pendingRoleChange.newRole === 'admin' ? 'Administrador' : 'Cliente'}</strong>?
                            </p>
                            
                            {pendingRoleChange.currentRole === 'admin' && pendingRoleChange.newRole !== 'admin' && (
                                <div style={{ 
                                    backgroundColor: '#FFEBEE', 
                                    color: '#D32F2F', 
                                    padding: '0.5rem', 
                                    borderRadius: '4px',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{ fontWeight: 'bold' }}>
                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                                        Advertencia: Estás removiendo privilegios de administrador
                                    </p>
                                </div>
                            )}
                            
                            {pendingRoleChange.newRole === 'admin' && (
                                <div style={{ 
                                    backgroundColor: '#E8F5E9', 
                                    color: '#388E3C', 
                                    padding: '0.5rem', 
                                    borderRadius: '4px',
                                    marginBottom: '1rem'
                                }}>
                                    <p>
                                        <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                                        Estás otorgando acceso completo al panel de administración
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 justify-end p-4">
                            <button
                                onClick={cancelRoleChange}
                                className="border-2 border-(--color-secondary) text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-2 px-4 rounded shadow-sm transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeRoleChange}
                                className="bg-(--color-primary) hover:bg-(--color-secondary) text-white font-semibold py-2 px-4 rounded shadow-sm transition-colors duration-200"
                            >
                                Confirmar cambio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Admin = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
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
                                <Link to="/admin/specifications">
                                    <i className="fas fa-list-ul"></i> Características
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
                            <Route path="specifications" element={<Specifications />} />
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