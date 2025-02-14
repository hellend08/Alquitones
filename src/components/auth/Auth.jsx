import { useState } from 'react';
import { localDB } from '../../database/LocalDB';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom'; 

const Auth = () => {
    const navigate = useNavigate();
    const isLoginPage = window.location.pathname.includes('login');
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!isLoginPage) {
                // Lógica de registro
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    return;
                }
                
                await localDB.createUser({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: 'client'
                });
                
                window.location.href = '/login';
            } else {
                // Lógica de login
                const user = await localDB.login(formData.email, formData.password);
                if (user) {
                    navigate(user.role === 'admin' ? '/admin' : '/home');
                  }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <a href="/">
                        <img 
                            src="/src/assets/alquitonesLogo.png" 
                            alt="AlquiTones Logo" 
                            className={styles.authLogo}
                        />
                    </a>
                    <h1 className={styles.authTitle}>
                        {isLoginPage ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h1>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    {!isLoginPage && (
                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.formLabel}>
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                minLength={3}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.formInput}
                            required
                            minLength={6}
                        />
                    </div>

                    {!isLoginPage && (
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.formLabel}>
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                minLength={6}
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.submitButton}>
                        {isLoginPage ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <hr className={styles.divider} />
                    {isLoginPage ? (
                        <p>
                            ¿No tienes cuenta? {' '}
                            <a href="/register" className={styles.authLink}>
                                Crear cuenta
                            </a>
                        </p>
                    ) : (
                        <p>
                            ¿Ya tienes cuenta? {' '}
                            <a href="/login" className={styles.authLink}>
                                Iniciar sesión
                            </a>
                        </p>
                    )}
                    <a href="/" className={styles.backLink}>
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Auth;