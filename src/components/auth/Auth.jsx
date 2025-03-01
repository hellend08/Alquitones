// Auth.jsx con integración de EmailJS
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
        // Expresión regular mejorada para validar correos electrónicos
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|io|info|biz)$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingrese un correo electrónico válido con un dominio reconocido');
            return false;
        }

        // Validación de contraseña
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        // Validación de coincidencia de contraseñas
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
                role: 'client',
                emailVerified: false // Inicialmente no verificado
            };
            
            // Crear el usuario en la base de datos local
            await localDB.createUser(userData);
            
            // Enviar correo de confirmación
            const emailResult = await EmailConfirmationService.sendConfirmationEmail(userData);
            
            if (emailResult.success) {
                setActiveForm('login');
                setError('Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta.');
                
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
                // Si el email falló pero el usuario fue creado
                setError('Tu cuenta fue creada pero hubo un problema al enviar el correo de confirmación. Por favor, contacta a soporte.');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Agregar un indicador de fuerza de contraseña
    const getPasswordStrength = (password) => {
        if (!password) return '';
        if (password.length < 6) return 'debil'; // Sin acento
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'fuerte';
        return 'media';
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Verificar si el email está confirmado
            const isConfirmed = EmailConfirmationService.isAccountConfirmed(formData.email);
            
            // Si no está confirmado, mostrar mensaje de error y opción para reenviar
            if (!isConfirmed) {
                setError('Tu cuenta aún no ha sido confirmada. Por favor revisa tu correo o haz clic para reenviar el correo de confirmación.');
                setLoading(false);
                return;
            }
            
            // Continuar con el login normal
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

    const handleResendConfirmation = async () => {
        if (!formData.email) {
            setError('Por favor ingresa tu correo electrónico primero');
            return;
        }
        
        try {
            setLoading(true);
            const result = await EmailConfirmationService.resendConfirmationEmail(formData.email);
            
            if (result.success) {
                setError('Se ha reenviado el correo de confirmación. Por favor revisa tu bandeja de entrada.');
            } else {
                setError('Error al reenviar el correo: ' + (result.error || 'Inténtalo más tarde'));
            }
        } catch (error) {
            setError('Error al reenviar el correo: ' + error.message);
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

                        {/* Botón para reenviar correo de confirmación */}
                        {error && error.includes('no ha sido confirmada') && (
                            <div className={styles.resendContainer}>
                                <button
                                    type="button"
                                    onClick={handleResendConfirmation}
                                    className={styles.resendButton}
                                    disabled={loading}
                                >
                                    Reenviar correo de confirmación
                                </button>
                            </div>
                        )}
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