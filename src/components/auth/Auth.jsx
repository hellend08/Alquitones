// Auth.jsx
import { useState } from 'react';
import { localDB } from '../../database/LocalDB';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const Auth = () => {
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('login'); 
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

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
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
            
            setActiveForm('login');
            setError('Registro exitoso, por favor inicia sesión');
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await localDB.login(formData.email, formData.password);
            if (user) {
                navigate(user.role === 'admin' ? '/admin' : '/');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className={styles.authContainer}>
            <img src="/src/assets/alquitonesLogo.png" alt="AlquiTones" className={styles.logo}/>
            <div className={styles.formContainer}>
                <div className={styles.formToggle}>
                    <button 
                        onClick={() => setActiveForm('login')}
                        className={`${styles.toggleButton} ${activeForm === 'login' ? styles.active : ''}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button 
                        onClick={() => setActiveForm('register')}
                        className={`${styles.toggleButton} ${activeForm === 'register' ? styles.active : ''}`}
                    >
                        Registrarse
                    </button>
                </div>

                {error && (
                    <div className={`${styles.errorMessage} ${error.includes('exitoso') ? styles.success : ''}`}>
                        {error}
                    </div>
                )}

                {activeForm === 'register' ? (
                    <form onSubmit={handleRegister} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Nombre y Apellido</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                minLength={3}
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
                            />
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
                            />
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
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Registrarse
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
                            />
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
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Iniciar Sesión
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Auth;