// Configuración de la API
const API_BASE_URL = '/api';

// Variables globales
let productos = [];
let carrito = [];
let usuario = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        await verificarAutenticacion();
        await cargarProductos();
        cargarCarrito();
        actualizarContadorCarrito();
        
        // Si estamos en la página principal, mostrar productos destacados
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            mostrarProductosDestacados();
        }
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        mostrarNotificacion('Error al cargar la aplicación', 'error');
    }
}

async function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                usuario = data.usuario;
                actualizarUIUsuario();
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            localStorage.removeItem('token');
        }
    }
}

async function cargarProductos() {
    try {
        console.log('Cargando productos desde API...');
        const response = await fetch(`${API_BASE_URL}/productos`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Productos cargados:', data);

        if (!data.success || !Array.isArray(data.productos)) {
            throw new Error('Formato de respuesta inválido');
        }

        productos = data.productos.map(p => ({
            ...p,
            precio: parseFloat(p.precio),
            stock: parseInt(p.stock),
            imagen: p.imagen.startsWith('default') ? 
                'assets/images/default.jpg' : 
                `assets/images/${p.imagen}`
        }));

        console.log('Productos procesados:', productos);
        
        // Actualizar contador en página principal
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            const totalProductos = document.getElementById('total-productos');
            if (totalProductos) {
                totalProductos.textContent = productos.length;
            }
        }

        // Si hay un contenedor de productos, renderizarlos
        const contenedorProductos = document.getElementById('productos-container');
        if (contenedorProductos) {
            renderProductos();
        }

    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarNotificacion('Error al cargar productos: ' + error.message, 'error');
    }
}

function mostrarProductosDestacados() {
    const contenedor = document.getElementById('productos-destacados');
    if (!contenedor || productos.length === 0) return;

    // Mostrar los primeros 3 productos como destacados
    const productosDestacados = productos.slice(0, 3);
    
    contenedor.innerHTML = productosDestacados.map(producto => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 featured-card">
                <div class="badge bg-danger position-absolute top-0 end-0 m-3">Destacado</div>
                <img src="${producto.imagen}" class="card-img-top featured-img" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion || 'Sin descripción disponible'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">$${producto.precio.toFixed(2)}</span>
                        <div>
                            <button class="btn btn-outline-primary btn-sm me-2" onclick="verDetalleProducto(${producto.id})">
                                Ver Detalles
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProductos() {
    const contenedor = document.getElementById('productos-container');
    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay productos disponibles</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 producto-card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small">${producto.categoria}</p>
                    <p class="card-text flex-grow-1">${producto.descripcion || 'Sin descripción'}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="h5 mb-0 text-primary">$${producto.precio.toFixed(2)}</span>
                            <small class="text-muted">Stock: ${producto.stock}</small>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})" 
                                    ${producto.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cart-plus"></i> 
                                ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        console.log('Carrito cargado:', carrito);
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carrito = [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarContadorCarrito();
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
        mostrarNotificacion('Producto no encontrado', 'error');
        return;
    }

    if (producto.stock === 0) {
        mostrarNotificacion('Producto sin stock', 'warning');
        return;
    }

    const itemEnCarrito = carrito.find(item => item.id === productoId);
    
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
            mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
        } else {
            mostrarNotificacion('No hay más stock disponible', 'warning');
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1,
            categoria: producto.categoria
        });
        mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
    }

    guardarCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

function verDetalleProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    Swal.fire({
        title: producto.nombre,
        html: `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid mb-3" style="max-height: 200px;">
            <p><strong>Categoría:</strong> ${producto.categoria}</p>
            <p><strong>Subcategoría:</strong> ${producto.subcategoria || 'N/A'}</p>
            <p><strong>Descripción:</strong> ${producto.descripcion || 'Sin descripción disponible'}</p>
            <p><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
            <p><strong>Stock:</strong> ${producto.stock} unidades</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar al Carrito',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#007bff'
    }).then((result) => {
        if (result.isConfirmed) {
            agregarAlCarrito(productoId);
        }
    });
}

function actualizarUIUsuario() {
    // Actualizar elementos de la UI basados en el estado del usuario
    const userLinks = document.querySelectorAll('.user-link');
    userLinks.forEach(link => {
        if (usuario) {
            link.textContent = usuario.nombre;
        }
    });
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const iconos = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    Swal.fire({
        icon: iconos[tipo],
        title: mensaje,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}

// Funciones de utilidad
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(precio);
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Exportar funciones globales para uso en otras páginas
window.cargarProductos = cargarProductos;
window.agregarAlCarrito = agregarAlCarrito;
window.verDetalleProducto = verDetalleProducto;
window.mostrarNotificacion = mostrarNotificacion;
window.API_BASE_URL = API_BASE_URL;
