// src/services/emailConfirmationService.js
import emailjs from '@emailjs/browser';

// Configuración de EmailJS con las credenciales correctas
// Actualizado con el template ID que sabemos que funciona
const SERVICE_ID = 'service_it1cutn';
const TEMPLATE_ID = 'template_u7xf5tf'; // Actualizado al template_id que funcionó
const PUBLIC_KEY = 'Of_hmvXTNvW6Ox045';

/**
 * Servicio para manejar la confirmación de email para usuarios
 */
class EmailConfirmationService {
  /**
   * Inicializa el servicio de EmailJS
   */
  static init() {
    // Método de inicialización actualizado para EmailJS v4
    emailjs.init({
      publicKey: PUBLIC_KEY
    });
  }

  /**
   * Genera un token único para confirmar la cuenta
   * @param {string} email - Email del usuario
   * @returns {string} Token único
   */
  static generateConfirmationToken(email) {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 10);
    const emailBase64 = btoa(email);
    return `${emailBase64}_${timestamp}_${randomPart}`;
  }

  /**
   * Construye la URL de confirmación
   * @param {string} token - Token de confirmación
   * @param {string} email - Email del usuario para añadir como parámetro adicional
   * @returns {string} URL completa de confirmación
   */
  static buildConfirmationUrl(token, email) {
    // URL de confirmación con token y email como parámetros adicionales
    const baseUrl = window.location.origin;
    const encodedEmail = encodeURIComponent(email);
    return `${baseUrl}/confirm-account?token=${token}&email=${encodedEmail}`;
  }

  /**
   * Envía correo electrónico de confirmación al usuario recién registrado
   * @param {Object} userData - Datos del usuario
   * @returns {Promise} Resultado del envío
   */
  static async sendConfirmationEmail(userData) {
    try {
      // Inicializar EmailJS
      this.init();
      
      // Generar token de confirmación
      const token = this.generateConfirmationToken(userData.email);
      
      // Guardar token en localStorage para verificación posterior
      localStorage.setItem(`confirmation_token_${userData.email}`, token);
      
      // Construir URL de confirmación
      const confirmationUrl = this.buildConfirmationUrl(token, userData.email);
      
      // Preparar datos para la plantilla
      // Adaptado según la estructura que vimos en los logs
      const templateParams = {
        user_name: userData.firstName || 'Usuario',
        user_email: userData.email,
        confirmation_link: confirmationUrl,
        // Añadir parámetros adicionales que parecen ser necesarios
        user_os: navigator.platform || 'Unknown OS',
        user_platform: navigator.userAgent.includes('Windows') ? 'Microsoft Windows' : 
                      (navigator.userAgent.includes('Mac') ? 'Apple MacOS' : 'Unknown Platform'),
        user_browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                     (navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Unknown Browser'),
        user_version: '1.0',
        user_country: 'Unknown',
        user_ip: 'Anonymous',
        user_referrer: document.referrer || window.location.origin
      };
      
      console.log('Enviando correo con los siguientes parámetros:', templateParams);
      
      // Enviar correo usando EmailJS
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
      );
      
      console.log('Respuesta de EmailJS:', response);
      
      if (response.status === 200) {
        return {
          success: true,
          message: 'Se ha enviado un correo de confirmación a tu dirección de email'
        };
      } else {
        throw new Error('Error al enviar el correo de confirmación');
      }
    } catch (error) {
      console.error('Error en EmailConfirmationService:', error);
      return {
        success: false,
        message: 'No se pudo enviar el correo de confirmación',
        error: error.message
      };
    }
  }

  /**
   * Reenvía el correo de confirmación
   * @param {string} email - Email del usuario
   * @returns {Promise} Resultado del reenvío
   */
  static async resendConfirmationEmail(userData) {
    // Si se pasa solo el email como string
    if (typeof userData === 'string') {
      const email = userData;
      const user = this.getUserByEmail(email);
      if (user) {
        userData = user;
      } else {
        userData = { 
          email,
          firstName: 'Usuario'
        };
      }
    }
    
    // Generamos un nuevo token
    const token = this.generateConfirmationToken(userData.email);
    localStorage.setItem(`confirmation_token_${userData.email}`, token);
    
    // Enviamos el email de nuevo
    return this.sendConfirmationEmail(userData);
  }
  
  /**
   * Busca un usuario por email (para reenvío)
   * @param {string} email - Email a buscar
   * @returns {Object|null} Usuario encontrado o null
   */
  static getUserByEmail(email) {
    try {
      // Intentar obtener usuario de localStorage (simulado)
      const dbData = JSON.parse(localStorage.getItem('alquitonesDB'));
      if (!dbData || !dbData.users) return null;
      
      return dbData.users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      return null;
    }
  }
  
  /**
   * Verifica si un token de confirmación es válido
   * @param {string} token - Token a verificar
   * @returns {boolean} Si el token es válido o no
   */
  static verifyConfirmationToken(token) {
    try {
      // Extraer el email del token (formato: base64_timestamp_random)
      const emailBase64 = token.split('_')[0];
      const email = atob(emailBase64);
      
      // Verificar si el token coincide con el almacenado
      const storedToken = localStorage.getItem(`confirmation_token_${email}`);
      
      if (token === storedToken) {
        // Marcar la cuenta como verificada
        localStorage.setItem(`email_confirmed_${email}`, 'true');
        
        // También actualizar el usuario en la base de datos local
        this.updateUserEmailVerification(email, true);
        
        return {
          success: true,
          email: email
        };
      }
      
      return {
        success: false,
        message: 'Token de confirmación inválido o expirado'
      };
    } catch (error) {
      console.error('Error al verificar token:', error);
      return {
        success: false,
        message: 'Error al procesar el token de confirmación'
      };
    }
  }
  
  /**
   * Actualiza el estado de verificación de email de un usuario
   * @param {string} email - Email del usuario
   * @param {boolean} verified - Estado de verificación
   */
  static updateUserEmailVerification(email, verified) {
    try {
      // Obtener la base de datos del localStorage
      const dbData = JSON.parse(localStorage.getItem('alquitonesDB'));
      if (!dbData || !dbData.users) return;
      
      // Buscar y actualizar el usuario
      const userIndex = dbData.users.findIndex(user => user.email === email);
      if (userIndex !== -1) {
        dbData.users[userIndex].emailVerified = verified;
        localStorage.setItem('alquitonesDB', JSON.stringify(dbData));
      }
    } catch (error) {
      console.error('Error al actualizar verificación de email:', error);
    }
  }
  
  /**
   * Verifica si una cuenta de usuario está confirmada
   * @param {string} email - Email a verificar
   * @returns {boolean} Si la cuenta está confirmada
   */
  static isAccountConfirmed(email) {
    return localStorage.getItem(`email_confirmed_${email}`) === 'true';
  }
}

export default EmailConfirmationService;