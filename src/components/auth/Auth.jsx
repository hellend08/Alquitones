import { useState } from 'react';
import { localDB } from '../../database/LocalDB';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const Auth = () => {
    const navigate = useNavigate();
    
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
            <div className={styles.logoContainer}>
                <a href="/">
                    <img 
                        src="/src/assets/alquitonesLogo.png" 
                        alt="AlquiTones Logo" 
                        className={styles.logo}
                    />
                </a>
            </div>

            <div className={styles.formsContainer}>
                <div className={styles.formsSide}>
                    <div className={styles.formBox}>
                        <h2 className="text-2xl font-bold text-amber-900 mb-6">Registrarse</h2>
                        
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label htmlFor="register-username" className="block text-sm font-medium text-amber-900">
                                    Nombre y Apellido
                                </label>
                                <input
                                    type="text"
                                    id="register-username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                    minLength={3}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-amber-900">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="register-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-amber-900">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-amber-900">
                                    Verificar Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="register-confirm-password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-amber-700 text-white rounded-md py-3 px-4 font-semibold hover:bg-amber-600 transition duration-200"
                            >
                                Registrarse
                            </button>
                        </form>
                    </div>

                    <div className={styles.formBox}>
                        <h2 className="text-2xl font-bold text-amber-900 mb-6">Iniciar Sesión</h2>
                        
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-amber-900">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="login-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-amber-900">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-amber-300 shadow-sm p-3 focus:border-amber-500 focus:ring focus:ring-amber-200"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-amber-700 text-white rounded-md py-3 px-4 font-semibold hover:bg-amber-600 transition duration-200"
                            >
                                Iniciar Sesión
                            </button>
                        </form>
                    </div>
                </div>

                <div className={styles.imageSide}>
                    <div className={styles.imageContainer}>
                        <img 
                            src="https://alquitones.s3.us-east-2.amazonaws.com/50.PNG"
                            alt="Música" 
                            className={styles.sideImage}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="max-w-md mx-auto mt-6">
                    <div className={`border-l-4 p-4 rounded ${
                        error.includes('exitoso') 
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'bg-red-50 border-red-500 text-red-700'
                    }`}>
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;