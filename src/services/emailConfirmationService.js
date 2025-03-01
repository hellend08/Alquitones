// src/services/emailConfirmationService.js
import emailjs from '@emailjs/browser';

class EmailConfirmationService {
  /**
   * Configuración de EmailJS
   */
  static #config = {
    SERVICE_ID: 'service_it1cutn', 
    TEMPLATE_ID: 'template_u7xf5tf', 
    PUBLIC_KEY: 'Of_hmvXTNvW6Ox045' 
  };

  /**
   * Envía correo de bienvenida
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Resultado del envío de correo
   */
  static async sendWelcomeEmail(userData) {
    try {
      // Preparar parámetros para el template de EmailJS
      const templateParams = {
        user_name: userData.firstName,
        user_email: userData.email
      };

      // Enviar correo usando EmailJS
      const result = await emailjs.send(
        this.#config.SERVICE_ID, 
        this.#config.TEMPLATE_ID, 
        templateParams,
        this.#config.PUBLIC_KEY
      );

      console.log('Correo de bienvenida enviado:', result);

      return {
        success: true,
        message: 'Correo de bienvenida enviado exitosamente'
      };
    } catch (error) {
      console.error('Error al enviar correo:', error);
      
      return {
        success: false,
        message: 'Error al enviar correo',
        error: error.text
      };
    }
  }
}

export default EmailConfirmationService;