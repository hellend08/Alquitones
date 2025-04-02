// src/services/emailConfirmationService.js
import emailjs from '@emailjs/browser';

class EmailConfirmationService {
  /**
   * Configuración de EmailJS
   */
  static #config = {
    SERVICE_ID: 'service_it1cutn',
    TEMPLATE_ID: 'template_u7xf5tf',
    PUBLIC_KEY: 'Of_hmvXTNvW6Ox045',
    RESERVATION_TEMPLATE_ID: 'template_bgjp5y7' // ID de la plantilla de reserva
  };

  /**
   * Ajusta una fecha añadiendo un día para compensar problemas de zona horaria
   * @param {string} dateString - Fecha en formato YYYY-MM-DD
   * @returns {string} - Fecha ajustada en formato YYYY-MM-DD
   */
  static adjustDateForEmail(dateString) {
    if (!dateString) return '';

    try {
      // Formato esperado: "YYYY-MM-DD"
      const [year, month, day] = dateString.split('-').map(Number);

      // Verificar que los componentes sean números válidos
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.warn('Componentes de fecha inválidos:', year, month, day);
        return dateString;
      }

      // Los meses en JavaScript van de 0-11
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 1); // Sumar un día para compensar

      // Formatear de nuevo a YYYY-MM-DD
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (err) {
      console.error('Error al ajustar fecha para email:', err);
      return dateString;
    }
  }

  /**
   * Formatea una fecha en formato uruguayo (DD/MM/YYYY)
   * @param {string} dateString - Fecha en formato YYYY-MM-DD
   * @returns {string} - Fecha formateada
   */
  static formatDateUY(dateString) {
    if (!dateString) return '';

    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString('es-UY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.error('Error al formatear fecha:', err);
      return dateString;
    }
  }

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

  /**
   * Envía correo de confirmación de reserva
   * @param {Object} reservationData - Datos de la reserva
   * @param {Object} userData - Datos del usuario
   * @param {Object} instrumentData - Datos del instrumento
   * @returns {Promise<Object>} Resultado del envío de correo
   */
  static async sendReservationConfirmationEmail(reservationData, userData, instrumentData) {
    try {
      const startDate = reservationData.startDate;
      const endDate = reservationData.endDate || reservationData.startDate;

      console.log('Fechas originales:', startDate, endDate);

      // Calcular número total de días
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día
      const totalDays = Math.round(Math.abs((endDateObj - startDateObj) / oneDay)) + 1;

      // Calcular precio total
      const totalPrice = (instrumentData.pricePerDay * totalDays * (reservationData.quantity || 1)).toFixed(2);
      // Formatear fechas directamente sin ajustarlas
      const formattedStartDate = this.formatDateUY(startDate);
      const formattedEndDate = this.formatDateUY(endDate);

      // Generar un número de orden simple
      const orderNumber = `R${Date.now().toString().substring(7)}`;

      // Preparar parámetros para el template de EmailJS
      const templateParams = {
        user_name: userData.firstName || userData.username || 'Usuario',
        user_email: userData.email,
        instrument_name: instrumentData.name,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        total_days: totalDays,
        price_per_day: instrumentData.pricePerDay.toFixed(2),
        total_price: totalPrice,
        quantity: reservationData.quantity || 1,
        reservation_notes: reservationData.notes || 'Sin notas adicionales',
        provider_name: instrumentData.provider?.name || 'Proveedor',
        provider_contact: instrumentData.provider?.contact || 'Sin información de contacto',
        order_number: orderNumber || 'N/A'
      };

      // El resto del código permanece igual
      const result = await emailjs.send(
        this.#config.SERVICE_ID,
        this.#config.RESERVATION_TEMPLATE_ID,
        templateParams,
        this.#config.PUBLIC_KEY
      );

      console.log('Correo de confirmación de reserva enviado:', result);

      return {
        success: true,
        message: 'Correo de confirmación de reserva enviado exitosamente'
      };
    } catch (error) {
      console.error('Error al enviar correo de confirmación:', error);

      return {
        success: false,
        message: 'Error al enviar correo de confirmación',
        error: error.text
      };
    }
  }
}

export default EmailConfirmationService;