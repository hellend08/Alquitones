// Auth.jsx - Simplified email sending
import { useState, useEffect } from 'react';
import { localDB } from '../../database/LocalDB';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Auth.module.css';
import EmailConfirmationService from '../../services/emailConfirmationService';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeForm, setActiveForm] = useState('login');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check URL and set active form accordingly
    useEffect(() => {
        const path = location.pathname;
        if (path === '/register') {
            setActiveForm('register');
        } else if (path === '/login') {
            setActiveForm('login');
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|info|biz)$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingrese un correo electrónico válido con un dominio reconocido');
            return false;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (!validateForm()) {
                return;
            }
            
            setLoading(true);
            
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                role: 'client'
            };
            
            // Crear el usuario en la base de datos local
            await localDB.createUser(userData);
            
            // Mantener el envío del correo de bienvenida
            const emailResult = await EmailConfirmationService.sendWelcomeEmail(userData);
            
            if (emailResult.success) {
                setActiveForm('login');
                setError('Registro exitoso. Se ha enviado un correo de bienvenida.');
                
                // Limpiar formulario
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                
                // Opcional: redirigir después de un breve retraso
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Si el email falló
                setError('Tu cuenta fue creada pero hubo un problema al enviar el correo.');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'debil';
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'fuerte';
        return 'media';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const user = await localDB.login(formData.email, formData.password);
            if (user) {
                navigate(user.role === 'admin' ? '/administracion' : '/');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.formContainer}>
                <div className={styles.authTitle}>
                    <h2 className="font-bold text-3xl text-(--color-secondary)">{activeForm === 'login' ? 'Inicia Sesión' : 'Regístrate'}</h2>
                </div>

                {error && (
                    <div className={`${styles.errorMessage} ${error.includes('exitoso') ? styles.success : ''}`}>
                        {error}
                    </div>
                )}

                {activeForm === 'register' ? (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <section className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)">Nombre:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    disabled={loading}
                                    className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa tu nombre"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-sm text-(--color-secondary)">Apellido:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    disabled={loading}
                                    className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                    placeholder="Ingresa tu apellido"
                                />
                            </div>
                        </section>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-(--color-secondary)">Correo Electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                placeholder="Ingresa tu correo"
                            />
                            {/* <small className="text-xs text-gray-500">Ingrese un correo electrónico válido</small> */}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-(--color-secondary)">Contraseña:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                placeholder="Ingresa tu contraseña"
                            />
                            {formData.password && (
                                <div className={`${styles.passwordStrength} ${styles[getPasswordStrength(formData.password)]}`}>
                                    Fuerza: {getPasswordStrength(formData.password) === 'debil' ? 'Débil' : 
                                            getPasswordStrength(formData.password) === 'media' ? 'Media' : 'Fuerte'}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-(--color-secondary)">Verificar Contraseña:</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                placeholder="Ingresa nuevamente tu contraseña"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="p-2 mt-8 bg-(--color-primary) text-white font-semibold rounded hover:bg-(--color-secondary) transition-colors duration-200 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Registrarse'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-(--color-secondary)">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                placeholder="Ingresa tu correo"
                            />
                            {/* <small className="text-xs text-gray-500">ejemplo: usuario@dominio.com</small> */}
                            {/* Ingrese un correo electrónico válido () */}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-sm text-(--color-secondary)">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                                className=" rounded-md py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm/6 outline-[1.5px] -outline-offset-1 outline-[#CDD1DE] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-(--color-primary)"
                                placeholder="Ingresa tu contraseña"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="p-2 mt-8 bg-(--color-primary) text-white font-semibold rounded hover:bg-(--color-secondary) transition-colors duration-200 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                )}

                <div className={styles.formSwitch}>
                    {activeForm === 'login' ? (
                        <p className="text-sm text-gray-500">¿No tienes una cuenta? <span onClick={() => {
                            setActiveForm('register');
                            navigate('/register');
                        }} className="text-(--color-primary) hover:text-(--color-secondary) text-sm font-bold cursor-pointer transition-colors duration-200">Regístrate</span></p>
                    ) : (
                        <p className="text-sm text-gray-500">¿Ya tienes una cuenta? <span onClick={() => {
                            setActiveForm('login');
                            navigate('/login');
                        }} className="text-(--color-primary) hover:text-(--color-secondary) text-sm font-bold cursor-pointer transition-colors duration-200">Inicia sesión</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;