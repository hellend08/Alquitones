// src/tests/LocalDB.test.js
import { localDB } from '../database/LocalDB';

// Utilidad para limpiar localStorage
const clearLocalStorage = () => {
    localStorage.clear();
    localDB.initializeStorage();
};

// Suite de pruebas para Productos
const testProducts = async () => {
    console.log('🧪 Iniciando pruebas de Productos...');
    
    try {
        // CREATE
        console.log('\n📝 Prueba: Crear Producto');
        const newProduct = {
            name: 'Test Guitar',
            description: 'Test Description',
            categoryId: 1,
            pricePerDay: 50.00,
            status: 'Disponible',
            specifications: [
                { label: 'Marca', value: 'Test Brand' }
            ],
            images: Array(5).fill('https://alquitones.s3.us-east-2.amazonaws.com/test.jpg')
        };

        const created = localDB.createProduct(newProduct);
        if (!created || !created.id) throw new Error('Error al crear producto');
        console.log('✅ Producto creado correctamente');

        // READ
        console.log('\n📖 Prueba: Leer Productos');
        const readProduct = localDB.getProductById(created.id);
        if (!readProduct) throw new Error('Error al leer producto');
        console.log('✅ Producto leído correctamente');

        // UPDATE
        console.log('\n📝 Prueba: Actualizar Producto');
        const updated = localDB.updateProduct(created.id, { name: 'Updated Guitar' });
        if (!updated || updated.name !== 'Updated Guitar') throw new Error('Error al actualizar producto');
        console.log('✅ Producto actualizado correctamente');

        // DELETE
        console.log('\n🗑️ Prueba: Eliminar Producto');
        const deleted = localDB.deleteProduct(created.id);
        if (!deleted) throw new Error('Error al eliminar producto');
        console.log('✅ Producto eliminado correctamente');

    } catch (error) {
        console.error('❌ Error en pruebas de productos:', error.message);
        throw error;
    }
};

// Suite de pruebas para Usuarios
const testUsers = async () => {
    console.log('\n🧪 Iniciando pruebas de Usuarios...');

    try {
        // CREATE
        console.log('\n📝 Prueba: Crear Usuario');
        const newUser = {
            username: 'testuser',
            email: 'test@test.com',
            password: 'test123',
            role: 'client'
        };

        const created = localDB.createUser(newUser);
        if (!created || !created.id) throw new Error('Error al crear usuario');
        console.log('✅ Usuario creado correctamente');

        // READ
        console.log('\n📖 Prueba: Leer Usuario');
        const readUser = localDB.getUserById(created.id);
        if (!readUser) throw new Error('Error al leer usuario');
        console.log('✅ Usuario leído correctamente');

        // UPDATE
        console.log('\n📝 Prueba: Actualizar Usuario');
        const updated = localDB.updateUser(created.id, { username: 'updateduser' });
        if (!updated || updated.username !== 'updateduser') throw new Error('Error al actualizar usuario');
        console.log('✅ Usuario actualizado correctamente');

        // DELETE
        console.log('\n🗑️ Prueba: Eliminar Usuario');
        const deleted = localDB.deleteUser(created.id);
        if (!deleted) throw new Error('Error al eliminar usuario');
        console.log('✅ Usuario eliminado correctamente');

    } catch (error) {
        console.error('❌ Error en pruebas de usuarios:', error.message);
        throw error;
    }
};

// Suite de pruebas de Autenticación
const testAuth = async () => {
    console.log('\n🔐 Iniciando pruebas de Autenticación...');

    try {
        // Preparar usuario de prueba
        const testUser = {
            username: 'authuser',
            email: 'auth@test.com',
            password: 'auth123',
            role: 'client'
        };
        localDB.createUser(testUser);

        // 1. Login exitoso
        console.log('\n🔑 Prueba: Login exitoso');
        const loggedUser = localDB.login('auth@test.com', 'auth123');
        if (!loggedUser || loggedUser.email !== 'auth@test.com') {
            throw new Error('Login fallido con credenciales correctas');
        }
        console.log('✅ Login exitoso funciona');

        // 2. Persistencia de sesión
        console.log('\n💾 Prueba: Persistencia de sesión');
        const currentUser = localDB.getCurrentUser();
        if (!currentUser || currentUser.id !== loggedUser.id) {
            throw new Error('Sesión no persistida en localStorage');
        }
        console.log('✅ Sesión persistida correctamente');

        // 3. Verificación de rol
        console.log('\n🛡️ Prueba: Verificación de rol admin');
        const adminCheck = localDB.isAdmin();
        if (adminCheck) throw new Error('Usuario normal detectado como admin');
        
        // Verificar admin real
        localDB.login('admin@alquitones.com', 'admin123');
        if (!localDB.isAdmin()) throw new Error('Admin real no detectado');
        console.log('✅ Roles verificados correctamente');

        // 4. Logout
        console.log('\n🚪 Prueba: Logout');
        localDB.logout();
        if (localDB.getCurrentUser()) throw new Error('Logout fallido');
        console.log('✅ Logout funciona correctamente');

        // 5. Login fallido
        console.log('\n❌ Prueba: Credenciales inválidas');
        try {
            localDB.login('noexiste@test.com', 'wrongpass');
            throw new Error('Permite login con credenciales falsas');
        } catch (error) {
            if (!error.message.includes('Credenciales')) throw error;
            console.log('✅ Bloquea credenciales inválidas');
        }

        // 6. Usuario desactivado
        console.log('\n🚫 Prueba: Cuenta desactivada');
        localDB.createUser({ // <-- Eliminar la asignación a variable
            username: 'inactive',
            email: 'inactive@test.com',
            password: 'test123',
            role: 'client',
            isActive: false
        });
        try {
            localDB.login('inactive@test.com', 'test123');
            throw new Error('Permite login en cuenta desactivada');
        } catch (error) {
            if (!error.message.includes('desactivada')) throw error;
            console.log('✅ Bloquea cuentas desactivadas');
        }

    } catch (error) {
        console.error('❌ Error en pruebas de autenticación:', error.message);
        throw error;
    }
};

// Función para ejecutar todas las pruebas
const runAllTests = async () => {
    console.log('🚀 Iniciando todas las pruebas...\n');
    clearLocalStorage();
    
    try {
        await testProducts();
        await testUsers();
        await testAuth();
        console.log('\n✨ Todas las pruebas completadas exitosamente');
    } catch (error) {
        console.error('\n❌ Error en las pruebas:', error.message);
        throw error;
    }
};

// Exportar funciones de prueba
export const dbTests = {
    runAllTests,
    testProducts,
    testUsers,
    testAuth,
    clearLocalStorage
};