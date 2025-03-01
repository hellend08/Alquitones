// src/components/auth/AccountConfirmation.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmailConfirmationService from '../../services/emailConfirmationService';
import styles from './Auth.module.css';

const AccountConfirmation = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Obtener el token y email de la URL
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const emailParam = queryParams.get('email');

        if (!token) {
          setStatus('error');
          setMessage('Token de confirmación no proporcionado');
          return;
        }

        // Si tenemos el email en los parámetros, lo usamos directamente
        if (emailParam) {
          setEmail(decodeURIComponent(emailParam));
        }

        // Verificar el token
        const result = EmailConfirmationService.verifyConfirmationToken(token);

        if (result.success) {
          setStatus('success');
          setMessage('¡Tu cuenta ha sido verificada correctamente!');
          setEmail(result.email);
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result.message || 'Error al verificar la cuenta');
        }
      } catch (error) {
        console.error('Error en verificación:', error);
        setStatus('error');
        setMessage('Ha ocurrido un error al procesar tu solicitud');
      }
    };

    verifyAccount();
  }, [location.search, navigate]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.formContainer}>
        <div className={styles.authTitle}>
          <h2>Confirmación de Cuenta</h2>
        </div>

        <div className={`${styles.confirmationMessage} ${styles[status]}`}>
          <div className={styles.statusIcon}>
            {status === 'verifying' && <span className="material-symbols-outlined">hourglass_top</span>}
            {status === 'success' && <span className="material-symbols-outlined">check_circle</span>}
            {status === 'error' && <span className="material-symbols-outlined">error</span>}
          </div>
          
          <p>{message}</p>
          
          {status === 'success' && (
            <p className={styles.smallText}>
              La cuenta asociada a <strong>{email}</strong> ha sido confirmada.
              <br />
              Serás redirigido a la página de inicio de sesión...
            </p>
          )}
          
          {status === 'error' && (
            <div className={styles.errorActions}>
              <p className={styles.smallText}>
                Si tienes problemas para confirmar tu cuenta, intenta nuevamente o contacta a soporte.
              </p>
              <button
                onClick={() => navigate('/login')}
                className={styles.submitButton}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountConfirmation;