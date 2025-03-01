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
                navigate(user.role === 'admin' ? '/admin' : '/');
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
                    <h2>{activeForm === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
                </div>

                {error && (
                    <div className={`${styles.errorMessage} ${error.includes('exitoso') ? styles.success : ''}`}>
                        {error}
                    </div>
                )}

                {activeForm === 'register' ? (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                minLength={2}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                minLength={2}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <small className={styles.helpText}>Ingrese un correo electrónico válido</small>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                            {formData.password && (
                                <div className={`${styles.passwordStrength} ${styles[getPasswordStrength(formData.password)]}`}>
                                    Fuerza: {getPasswordStrength(formData.password) === 'debil' ? 'Débil' : 
                                            getPasswordStrength(formData.password) === 'media' ? 'Media' : 'Fuerte'}
                                </div>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Verificar Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Registrarse'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <small className={styles.helpText}>Ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)</small>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                )}

                <div className={styles.formSwitch}>
                    {activeForm === 'login' ? (
                        <p>¿No tienes una cuenta? <span onClick={() => {
                            setActiveForm('register');
                            navigate('/register');
                        }} className={styles.switchLink}>Regístrate</span></p>
                    ) : (
                        <p>¿Ya tienes una cuenta? <span onClick={() => {
                            setActiveForm('login');
                            navigate('/login');
                        }} className={styles.switchLink}>Inicia sesión</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;