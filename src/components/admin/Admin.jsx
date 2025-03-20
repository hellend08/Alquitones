import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';
import styles from './Admin.module.css';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from '../crossSections/header';
import Footer from '../crossSections/footer';
import { useInstrumentState, useInstrumentDispatch } from "../../context/InstrumentContext";
import { useCategoryState, useCategoryDispatch } from "../../context/CategoryContext";

// Dashboard component
const Dashboard = () => (
    <div className={styles.dashboardContent}>
        <div className={styles.placeholderContainer}>
            <img
                src="https://alquitones.s3.us-east-2.amazonaws.com/no-disponible.jpg"
                alt="No disponible"
                className={styles.placeholderImage}
            />
        </div>
    </div>
);

// Instruments component (moved from main Admin component)
const Instruments = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentInstrument, setCurrentInstrument] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);
    const { instruments, specifications, loading: instrumentsLoading, addInstrument, updateInstrument, deleteInstrument } = useInstrumentState();
    const dispatch = useInstrumentDispatch();

    useEffect(() => {
        if (searchTerm) {
            const filteredInstruments = instruments.filter(instrument =>
                instrument.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            dispatch({ type: "SET_INSTRUMENTS", payload: filteredInstruments });
        } else {
            dispatch({ type: "SET_INSTRUMENTS", payload: instruments });
        }
    }, [searchTerm, instruments]);
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
        const imagesAdj = fileInput.files;

        // Validación de imágenes SOLO para creación
        if (modalMode === 'create' && (images.length < 1 || images.length > 6)) {
            alert('Debes seleccionar entre 1 y 6 imágenes');
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
                await addInstrument(instrumentData, imagesAdj);
                alert('Instrumento creado con éxito');
            } else {
                await updateInstrument(currentInstrument.id, instrumentData, imagesAdj);
                // await apiService.updateInstrument(currentInstrument.id, instrumentData, imagesAdj);
                // dispatch({ type: "UPDATE_INSTRUMENT", payload: { id: currentInstrument.id, ...instrumentData } });
                alert('Instrumento actualizado con éxito');
            }

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
            await deleteInstrument(instrument.id);
            // await localDB.deleteProduct(instrument.id);
            // dispatch({ type: "DELETE_INSTRUMENT", payload: instrument.id });
            alert('Instrumento eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar instrumento:', error);
            alert('Error al eliminar el instrumento');
        }
    };

    const getProductCategory = (categoryId) => {
        const categories = localDB.data.categories;
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Sin categoría';
    };

    return (
        <div className={styles.instrumentsSection}>
            <div className={styles.sectionHeader}>
                <h2 className="text-(--color-secondary) text-2xl font-bold">Gestión de Instrumentos</h2>
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
                            <th>categoria</th>
                            <th>Estado</th>
                            <th>Precio/Día</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instruments.map(instrument => {
                            const status = (instrument.stock > 0 || instrument.status =='Disponible') ? 'Disponible' : 'No disponible';
                            return (
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
                                    <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
                                        {status}
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
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setPreviews([]);
                            }}
                            className={styles.modalClose}
                        >
                            &times;
                        </button>
                        <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">{modalMode === 'create' ? 'Agregar Instrumento' : 'Editar Instrumento'}</h3>
                        <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-name">Nombre del Instrumento:</label>
                                <input
                                    type="text"
                                    id="instrument-name"
                                    defaultValue={currentInstrument?.name || ''}
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa un nombre"
                                />
                            </div>
                            <section className="flex flex-row justify-between">
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-category">categoria</label>
                                    <select
                                        id="instrument-category"
                                        defaultValue={currentInstrument?.categoryId || ''}
                                        className="border-r-[8px] border-transparent h-[36px] rounded-md py-1.5 px-3 text-base text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    >
                                        <option value="">Seleccionar categoria</option>
                                        {localDB.data.categories.map(category => (
                                            <option className="text-gray-900" key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-price">Precio por día</label>
                                    <input
                                        type="number"
                                        id="instrument-price"
                                        min="0"
                                        step="0.01"
                                        defaultValue={currentInstrument?.pricePerDay || ''}
                                        className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                        placeholder="Ingresa un precio"
                                    />
                                </div>
                            </section>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-images">Imágenes del Instrumento</label>
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
                                    className="rounded-md py-1.5 px-3 text-base bg-(--color-secondary) text-white sm:text-sm/6 outline-[1.5px] -outline-offset-1 cursor-pointer"

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
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" >Características</label>
                                <div className={styles.specificationsContainer}>
                                    {localDB.getAllSpecifications().map(spec => (
                                        <div key={spec.id} className="flex flex-col gap-1 bg-(--color-light) p-2 rounded-md">
                                            <label className="font-semibold text-sm text-(--color-secondary)" htmlFor={`spec-${spec.id}`}>{spec.label}</label>
                                            <input
                                                type="text"
                                                id={`spec-${spec.id}`}
                                                name={`spec-${spec.id}`}
                                                placeholder={`Valor para ${spec.label}`}
                                                defaultValue={
                                                    currentInstrument?.specifications?.find(
                                                        s => s.specification.id === spec.id
                                                    )?.spValue || ''
                                                }
                                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-description">Descripción:</label>
                                <textarea
                                    id="instrument-description"
                                    rows="4"
                                    defaultValue={currentInstrument?.description || ''}
                                    className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Escribe la descripción del producto"

                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="instrument-status">Estado</label>
                                <select
                                    id="instrument-status"
                                    defaultValue={currentInstrument?.status || 'Disponible'}
                                    className="border-r-[8px] border-transparent h-[36px] rounded-md py-1.5 px-3 text-base text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                >
                                    <option className="text-gray-900" value="Disponible">Disponible</option>
                                    <option className="text-gray-900" value="Reservado">Reservado</option>
                                    <option className="text-gray-900" value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 mt-6 mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setPreviews([]);
                                    }}
                                    className="border-2 border-(--color-secondary) w-[95px] text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-1 px-4 rounded shadow-sm transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-(--color-primary) hover:bg-(--color-secondary) w-[95px] text-white font-semibold py-1 rounded shadow-sm transition-colors duration-200"
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

// Categories component - Solo con iconos predefinidos (sin imagen personalizada)
const Categories = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [previews, setPreviews] = useState([]);
    const { categories, loading: categoriesLoading } = useCategoryState();
    const dispatch = useCategoryDispatch();

    useEffect(() => {
        if (searchTerm) {
            const filteredCategories = categories.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            dispatch({ type: "SET_CATEGORIES", payload: filteredCategories });
        } else {
            dispatch({ type: "SET_CATEGORIES", payload: categories });

        }
    }, [searchTerm, categories]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reiniciar a primera página al buscar
    };

    const handleAddCategory = () => {
        setModalMode('create');
        setCurrentCategory(null);
        setPreviews([]);
        setModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setModalMode('edit');
        setCurrentCategory(category);
        setPreviews([]);
        setModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        // Obtener SOLO el icono de Font Awesome, eliminar cualquier otra opción
        const icon = form['icon-class'].value;

        const categoryData = {
            name: form['category-name'].value,
            description: form['category-description'].value,
            icon: icon // Siempre usar el valor del select, sin considerar imágenes personalizadas
        };

        try {
            if (modalMode === 'create') {
                await localDB.createCategory(categoryData);
                dispatch({ type: "ADD_CATEGORY", payload: categoryData });
                alert('Categoría creada con éxito');
            } else {
                await localDB.updateCategory(currentCategory.id, categoryData);
                dispatch({ type: "UPDATE_CATEGORY", payload: { id: currentCategory.id, ...categoryData } });
                alert('Categoría actualizada con éxito');
            }
    
            setModalOpen(false);
            setPreviews([]);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    // Agregar esta nueva función para procesar la eliminación confirmada:
    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            // Obtener productos asociados
            const associatedProducts = localDB.getProductsByCategory(categoryToDelete.id);

            // Eliminar productos asociados primero
            associatedProducts.forEach(async product => {
                await localDB.deleteProduct(product.id);
            });

            // Eliminar la categoria
            await localDB.deleteCategory(categoryToDelete.id);

            // Actualizar la lista de categorías
            loadCategories();

            // Cerrar el modal de eliminación
            setDeleteModalOpen(false);

            // Mostrar mensaje de éxito
            setSuccessMessage('categoria y productos asociados eliminados exitosamente');
            setSuccessModalOpen(true);

            // Limpiar el estado
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error al eliminar categoria:', error);

            // También podríamos usar un popup para errores
            alert(`Error: ${error.message}`);
        }
    };

    // Iconos específicos para categorías de instrumentos musicales
    const categoryIcons = [
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/accordion.png', label: 'Acordeón' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/bagpipes.png', label: 'Gaita' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/banjo.png', label: 'Banjo' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/bassoon.png', label: 'Fagot' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/clarinet.png', label: 'Clarinete' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/djembe.png', label: 'Djembe' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/drum.png', label: 'Tambor' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/drum-kit.png', label: 'Batería' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/flute.png', label: 'Flauta' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/french-horn.png', label: 'Trompa' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/gong.png', label: 'Gong' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/grand-piano.png', label: 'Piano de Cola' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/guitar.png', label: 'Guitarra' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/guitar-bass-head.png', label: 'Bajo' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/guitar-head.png', label: 'Mástil de Guitarra' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/harp.png', label: 'Arpa' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/lyre.png', label: 'Lira' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/maracas.png', label: 'Maracas' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/musical-keyboard.png', label: 'Teclado' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/ocarina.png', label: 'Ocarina' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/otamatone.png', label: 'Otamatone' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/pan-flute.png', label: 'Flauta de Pan' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/pianist.png', label: 'Pianista' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/piano-keys.png', label: 'Teclas de Piano' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/pipe-organ.png', label: 'Órgano' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/saxophone.png', label: 'Saxofón' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/tambourine.png', label: 'Pandereta' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/trombone.png', label: 'Trombón' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/trumpet.png', label: 'Trompeta' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/tuba.png', label: 'Tuba' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/violin.png', label: 'Violín' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/xylophone.png', label: 'Xilófono' },
        { value: 'https://alquitones.s3.us-east-2.amazonaws.com/yunluo.png', label: 'Yunluo' }
    ];

    return (
        <div className={styles.instrumentsSection}>
            <div className={styles.sectionHeader}>
                <h2 className="text-(--color-secondary) text-2xl font-bold">Gestión de Categorías</h2>
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
                        <i className="fas fa-plus"></i> Agregar categoria
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
                                    {category.icon?.startsWith('fa-') ? (
                                        <i className={`fas ${category.icon} fa-2x`} style={{ color: '#9C6615' }}></i>
                                    ) : (
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className={styles.productImage}
                                            onError={(e) => {
                                                console.error(`Error loading image: ${category.icon}`);
                                                e.target.onerror = null;
                                                e.target.src = 'https://alquitones.s3.us-east-2.amazonaws.com/yunluo.png';
                                            }}
                                        />
                                    )}
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
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setPreviews([]);
                            }}
                            className={styles.modalClose}
                        >
                            &times;
                        </button>
                        <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">
                            {modalMode === 'create' ? 'Agregar categoria' : 'Editar categoria'}
                        </h3>
                        <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="category-name">
                                    Nombre de la categoria
                                </label>
                                <input
                                    type="text"
                                    id="category-name"
                                    defaultValue={currentCategory?.name || ''}
                                    required
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa un nombre"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="category-description">
                                    Descripción
                                </label>
                                <textarea
                                    id="category-description"
                                    rows="4"
                                    defaultValue={currentCategory?.description || ''}
                                    required
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa una descripción"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="icon-class">
                                    Seleccionar Icono
                                </label>
                                <select
                                    id="icon-class"
                                    name="icon-class"
                                    defaultValue={currentCategory?.icon?.startsWith('fa-') ? currentCategory.icon : 'fa-music'}
                                    className="border-r-[8px] border-transparent h-[36px] rounded-md py-1.5 px-3 text-base text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                >
                                    {categoryIcons.map((icon, index) => (
                                        <option className="text-gray-900" key={index} value={icon.value}>
                                            {icon.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.iconPreview}>
                                    <p className="font-semibold text-sm text-(--color-secondary)">Vista previa:</p>
                                    <div className={styles.iconPreviewBox}>
                                        {categoryIcons.map((icon, index) => (
                                            <img
                                                key={index}
                                                src={icon.value}
                                                alt={icon.label}
                                                title={icon.label}
                                                style={{
                                                    margin: '5px',
                                                    cursor: 'pointer',
                                                    width: '32px',
                                                    height: '32px',
                                                    background: 'transparent',
                                                    mixBlendMode: 'multiply'
                                                }}
                                                onClick={(e) => {
                                                    document.getElementById('icon-class').value = icon.value;
                                                    // Mantener la funcionalidad para resaltar el seleccionado
                                                    const iconPreviewContainer = document.querySelector(`.${styles.iconPreviewBox}`);
                                                    iconPreviewContainer.querySelectorAll('img').forEach(img => {
                                                        img.classList.remove(styles.selectedIcon);
                                                    });
                                                    e.target.classList.add(styles.selectedIcon);
                                                }}
                                                className={icon.value === (currentCategory?.icon || categoryIcons[0].value) ? styles.selectedIcon : ''}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setPreviews([]);
                                    }}
                                    className="border-2 border-(--color-secondary) w-[95px] text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-1 px-4 rounded shadow-sm transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-(--color-primary) hover:bg-(--color-secondary) w-[95px] text-white font-semibold py-1 rounded shadow-sm transition-colors duration-200"
                                >
                                    {modalMode === 'create' ? 'Crear' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteModalOpen && categoryToDelete && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setCategoryToDelete(null);
                            }}
                            className={styles.modalClose}
                        >
                            &times;
                        </button>
                        <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">
                            Confirmar Eliminación
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 text-center">
                                <i className="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-2"></i>
                                <p className="font-semibold text-lg text-(--color-secondary)">
                                    ¿Estás seguro que deseas eliminar la categoria?
                                </p>
                                <p className="text-base text-gray-700">
                                    <span className="font-bold">{categoryToDelete.name}</span>
                                </p>
                            </div>

                            {/* Productos asociados */}
                            {(() => {
                                const associatedProducts = localDB.getProductsByCategory(categoryToDelete.id);
                                return associatedProducts.length > 0 ? (
                                    <div className="bg-gray-100 p-3 rounded-md">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Esta acción eliminará permanentemente:
                                        </p>
                                        <ul className="list-disc pl-5 text-sm text-gray-600">
                                            <li>La categoria</li>
                                            <li>{associatedProducts.length} producto(s) asociado(s)</li>
                                        </ul>
                                        <p className="text-sm italic text-gray-500 mt-2">
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-gray-500">
                                        Esta acción no se puede deshacer.
                                    </p>
                                );
                            })()}

                            {/* Campo para confirmar la eliminación */}
                            <div className="flex flex-col gap-2 mt-2">
                                <label className="font-semibold text-sm text-gray-700">
                                    Para eliminar definitivamente la categoria, escribe: "eliminar categoria {categoryToDelete.name}"
                                </label>
                                <input
                                    type="text"
                                    id="delete-confirmation"
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Escribe el texto de confirmación"
                                    onChange={(e) => {
                                        const confirmText = `eliminar categoria ${categoryToDelete.name}`.toLowerCase();
                                        const inputText = e.target.value.toLowerCase();
                                        setDeleteConfirmationValid(confirmText === inputText);
                                    }}
                                />
                            </div>

                            <div className={styles.formActions}>
                                {/* CAMBIO DE POSICIÓN: Botón de Eliminar primero (izquierda) */}
                                <button
                                    id="delete-button"
                                    type="button"
                                    onClick={() => {
                                        if (deleteConfirmationValid) {
                                            confirmDeleteCategory();
                                        }
                                    }}
                                    disabled={!deleteConfirmationValid}
                                    className={`w-[110px] text-white font-semibold py-1 rounded shadow-sm transition-colors duration-200 ${deleteConfirmationValid
                                        ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Eliminar
                                </button>

                                {/* CAMBIO DE POSICIÓN: Botón de Cancelar después (derecha) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteModalOpen(false);
                                        setCategoryToDelete(null);
                                    }}
                                    className="border-2 border-(--color-secondary) w-[110px] text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-1 px-4 rounded shadow-sm transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {successModalOpen && (
                <div className={styles.modal}>
                    <div className={`${styles.modalContent} max-w-md`}>
                        <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">
                            Operación Exitosa
                        </h3>

                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-green-100">
                                <i className="fas fa-check text-green-500 text-3xl"></i>
                            </div>

                            <p className="text-gray-700">
                                {successMessage}
                            </p>

                            <button
                                onClick={() => setSuccessModalOpen(false)}
                                className="bg-(--color-primary) hover:bg-(--color-secondary) w-[110px] text-white font-semibold py-1 px-4 rounded shadow-sm transition-colors duration-200 mt-2"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Specifications component - Solo eliminando imagen personalizada pero manteniendo la funcionalidad original
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

    // Mantener el efecto original para manejar la selección de iconos
    useEffect(() => {
        if (modalOpen) {
            const iconClassSelect = document.getElementById('icon-class');
            const iconPreviewContainer = document.querySelector(`.${styles.iconPreviewBox}`);

            const updateIconPreview = () => {
                if (!iconClassSelect || !iconPreviewContainer) return;

                const selectedIcon = iconClassSelect.value;
                iconPreviewContainer.querySelectorAll('i').forEach(icon => {
                    icon.classList.remove(styles.selectedIcon);
                    if (icon.classList.contains(selectedIcon)) {
                        icon.classList.add(styles.selectedIcon);
                    }
                });
            };

            const handleIconSelection = (e) => {
                if (!iconClassSelect) return;

                if (e.target.classList.contains('fas')) {
                    iconClassSelect.value = e.target.classList[1];
                    updateIconPreview();
                }
            };

            // Actualizar visibilidad inicial
            updateIconPreview();

            // Añadir event listeners
            if (iconClassSelect) iconClassSelect.addEventListener('change', updateIconPreview);
            if (iconPreviewContainer) iconPreviewContainer.addEventListener('click', handleIconSelection);

            // Cleanup
            return () => {
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

            if (searchTerm) {
                filteredSpecifications = allSpecifications.filter(spec =>
                    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

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

        // Obtener el icono de Font Awesome
        const icon = form['icon-class'].value;

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
                <h2 className="text-(--color-secondary) text-2xl font-bold">Gestión de Características</h2>
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
                        <i className="fas fa-plus"></i> Agregar Nueva
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
                                        <i className={`fas ${specification.icon} fa-2x`} style={{ color: '#001F3F' }}></i>
                                    ) : (
                                        <img
                                            src={specification.icon}
                                            alt={`Icono de ${specification.label}`}
                                            className={styles.productImage}
                                        />
                                    )}
                                </td>
                                <td>{specification.label}</td>
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
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setPreviews([]);
                            }}
                            className={styles.modalClose}
                        >
                            &times;
                        </button>
                        <h3 className="text-(--color-secondary) text-xl text-center font-bold mb-4">
                            {modalMode === 'create' ? 'Agregar Nueva' : 'Editar Característica'}
                        </h3>
                        <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="specification-name">
                                    Nombre de la Característica
                                </label>
                                <input
                                    type="text"
                                    id="specification-name"
                                    defaultValue={currentSpecification?.label || ''}
                                    required
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa un nombre"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="specification-description">
                                    Descripción
                                </label>
                                <textarea
                                    id="specification-description"
                                    rows="4"
                                    defaultValue={currentSpecification?.description || ''}
                                    required
                                    className="rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa una descripción"
                                />
                            </div>

                            <div className="flex flex-col gap-2" id="font-awesome-selector">
                                <label className="font-semibold text-sm text-(--color-secondary)" htmlFor="icon-class">
                                    Seleccionar Icono
                                </label>
                                <select
                                    id="icon-class"
                                    name="icon-class"
                                    defaultValue={currentSpecification?.icon?.startsWith('fa-') ? currentSpecification.icon : 'fa-tag'}
                                    className="border-r-[8px] border-transparent h-[36px] rounded-md py-1.5 px-3 text-base text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                >
                                    {fontAwesomeIcons.map((icon, index) => (
                                        <option className="text-gray-900" key={index} value={icon.value}>
                                            {icon.label}
                                        </option>
                                    ))}
                                </select>
                                <div className={styles.iconPreview}>
                                    <p className="font-semibold text-sm text-(--color-secondary)">Vista previa:</p>
                                    <div className={styles.iconPreviewBox}>
                                        {fontAwesomeIcons.map((icon, index) => (
                                            <i
                                                key={index}
                                                className={`fas ${icon.value} fa-2x`}
                                                title={icon.label}
                                                style={{
                                                    margin: '5px',
                                                    cursor: 'pointer',
                                                    color: '#001F3F'
                                                }}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModalOpen(false);
                                        setPreviews([]);
                                    }}
                                    className="border-2 border-(--color-secondary) w-[95px] text-(--color-secondary) hover:bg-(--color-secondary) hover:text-white font-semibold sm:text-xs md:text-sm py-1 px-4 rounded shadow-sm transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-(--color-primary) hover:bg-(--color-secondary) w-[95px] text-white font-semibold py-1 rounded shadow-sm transition-colors duration-200"
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
                src="https://alquitones.s3.us-east-2.amazonaws.com/no-disponible.jpg"
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
                <h2 className="text-(--color-secondary) text-2xl font-bold">Gestión de Usuarios</h2>
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
                                    backgroundColor: '#FFF3CD',
                                    color: '#856404',
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
                                    backgroundColor: '#FFF3CD',
                                    color: '#856404',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    marginBottom: '1rem'
                                }}>
                                    <p style={{ fontWeight: 'bold' }}>
                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                                        Advertencia: Estás otorgando acceso completo al panel de administración
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
                                <Link to="/administracion/dashboard">
                                    <i className="fas fa-home"></i> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/administracion/instruments">
                                    <i className="fas fa-guitar"></i> Lista Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/administracion/specifications">
                                    <i className="fas fa-list-ul"></i> Características
                                </Link>
                            </li>
                            <li>
                                <Link to="/administracion/rentals">
                                    <i className="fas fa-calendar-alt"></i> Alquileres
                                </Link>
                            </li>
                            <li>
                                <Link to="/administracion/categories">
                                    <i className="fas fa-tags"></i> Categorías
                                </Link>
                            </li>
                            <li>
                                <Link to="/administracion/users">
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