# AG-Store Node.js

E-commerce API desarrollado en Node.js con Express, migrado desde una aplicación PHP.

## 🚀 Características

- **Backend**: Node.js + Express
- **Base de datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcryptjs para hash de contraseñas
- **Testing**: Jest + Supertest
- **Desarrollo**: Nodemon para hot reload

## 📁 Estructura del Proyecto

```
proyecto-de-pruebas-en-node/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de base de datos
│   ├── controllers/
│   │   ├── ProductoController.js
│   │   ├── UsuarioController.js
│   │   └── PedidoController.js
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación
│   │   └── errorHandler.js      # Manejo de errores
│   ├── models/
│   │   ├── Producto.js
│   │   ├── Usuario.js
│   │   └── Pedido.js
│   ├── routes/
│   │   ├── productos.js
│   │   ├── usuarios.js
│   │   └── pedidos.js
│   └── app.js                   # Aplicación principal
├── public/
│   ├── assets/                  # Imágenes e iconos
│   ├── css/                     # Estilos CSS
│   ├── js/                      # JavaScript del frontend
│   │   ├── __tests__/           # Pruebas para el frontend
│   │   ├── componentes/         # Funcionalidad de UI
│   │   └── funcionalidad/       # Funcionalidad de cada apartado
│   └── index.html               # Página principal
├── tests/
│   ├── api/                     # Tests de endpoints
│   ├── controllers/             # Test de controllers
│   ├── models/                  # Tests de modelos4
│   ├── k6/                      # Test de k6      
│   └── setup.js                 # Configuración de tests
├── .env                         # Variables de entorno
├── ecommerce-shop.sql          # Base de datos
└── package.json
```

## 🛠️ Instalación

1. **Clonar el repositorio y navegar al directorio:**
   ```bash
   cd "Proyecto de Pruebas en Node"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Editar el archivo `.env` con tu configuración:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=ecommerce-shop
   DB_PORT=3306
   
   PORT=3000
   NODE_ENV=development
   
   JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
   CORS_ORIGIN=*
   ```

4. **Importar la base de datos:**
   ```bash
   mysql -u root -p < ecommerce-shop.sql
   ```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Testing
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

## 📚 API Endpoints

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/categoria/:categoria` - Obtener productos por categoría
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

### Usuarios
- `POST /api/usuarios/registrar` - Registrar usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil (Autenticado)
- `PUT /api/usuarios/perfil` - Actualizar perfil (Autenticado)
- `GET /api/usuarios` - Obtener todos los usuarios (Admin)
- `GET /api/usuarios/:id` - Obtener usuario por ID (Admin)
- `PUT /api/usuarios/:id` - Actualizar usuario (Admin)
- `DELETE /api/usuarios/:id` - Eliminar usuario (Admin)

### Pedidos
- `POST /api/pedidos` - Crear pedido (Autenticado)
- `POST /api/pedidos/carrito` - Crear múltiples pedidos desde carrito (Autenticado)
- `GET /api/pedidos/mis-pedidos` - Obtener mis pedidos (Autenticado)
- `GET /api/pedidos` - Obtener todos los pedidos (Admin)
- `GET /api/pedidos/:id` - Obtener pedido por ID (Admin)
- `PUT /api/pedidos/:id/estado` - Actualizar estado de pedido (Admin)
- `DELETE /api/pedidos/:id` - Eliminar pedido (Admin)

## 🔐 Autenticación

La API utiliza JWT para autenticación. Incluir el token en el header:

```
Authorization: Bearer tu_jwt_token
```

### Roles
- **cliente**: Usuario normal, puede hacer pedidos
- **admin**: Administrador, acceso completo (no implementado)

## 🧪 Testing

El proyecto incluye tests para:
- Configuración de base de datos
- Modelos de datos
- Endpoints de API
- Middleware de autenticación

### Estructura de Tests
```
tests/
├── api/
│   └── productos.test.js       # Tests de endpoints de productos
├── models/
│   └── Producto.test.js        # Tests del modelo Producto
├── database.test.js            # Tests de conexión a DB
└── setup.js                    # Configuración global
```

### Jest
Configurado para tests de Node.js con:
- Entorno de Node.js
- Cobertura de código
- Setup global para tests
- Mock automático de módulos

## 🌐 Frontend

El frontend está incluido en la carpeta `public/` y se sirve automáticamente:
- **Página principal**: `http://localhost:3000/`
- **Productos**: `http://localhost:3000/productos`
- **Carrito**: `http://localhost:3000/carrito`
- **Usuario**: `http://localhost:3000/usuario`

## 📊 Monitoreo

- **Health Check**: `GET /health`
- **API Base**: `http://localhost:3000/api`

## 🔄 Migración desde PHP

Este proyecto es una migración completa de un e-commerce desarrollado en PHP a Node.js:

### Cambios principales:
1. **Backend**: PHP → Node.js + Express
2. **Autenticación**: Sesiones PHP → JWT
3. **Estructura**: MVC tradicional → Arquitectura en capas
4. **Testing**: Sin tests → Jest + Supertest
6. **API**: Endpoints PHP → API REST con Express

## 📝 Scripts Disponibles

```json
{
  "start": "node src/app.js",           // Producción
  "dev": "nodemon src/app.js",          // Desarrollo
  "test": "jest",                       // Tests
  "test:watch": "jest --watch",         // Tests en modo watch
  "test:coverage": "jest --coverage",   // Cobertura
  "lint": "eslint src/ tests/",         // Verificar código
  "lint:fix": "eslint src/ tests/ --fix" // Corregir código
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

**ChimbaAlexis**

---

🎉 **¡Proyecto migrado exitosamente de PHP a Node.js!** 🎉
