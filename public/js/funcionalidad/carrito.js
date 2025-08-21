

let carrito = [];
let subtotal = 0;
let taxes = 0;
let shipping = 0;
let total = 0;
let discount = 0;

// Cargar carrito desde localStorage al iniciar
function cargarCarrito() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        renderCarrito();
        updateCartBadge();
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
}

// Inicializar carrito
function initCarrito() {
    cargarCarrito();

    // Event listeners
    document.getElementById('clear-cart')?.addEventListener('click', vaciarCarrito);
    document.getElementById('checkout-btn')?.addEventListener('click', finalizarCompra);
    document.getElementById('applyCoupon')?.addEventListener('click', aplicarCupon);
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    try {
        const cantidadInput = document.getElementById(`cantidad-${id}`);
        const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;

        // Buscar el producto en el array global de productos
        const producto = window.productos ? window.productos.find(p => parseInt(p.id) === parseInt(id)) : null;

        if (!producto) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Producto no encontrado'
            });
            return;
        }

        if (cantidad > producto.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: 'No hay suficiente stock disponible'
            });
            return;
        }

        // Buscar si el producto ya existe en el carrito
        const itemExistente = carrito.find(item => parseInt(item.id) === parseInt(id));

        if (itemExistente) {
            const nuevaCantidad = itemExistente.cantidad + cantidad;
            if (nuevaCantidad > producto.stock) {
                Swal.fire({
                    icon: 'error',
                    title: 'Stock insuficiente',
                    text: 'La cantidad total excedería el stock disponible'
                });
                return;
            }
            itemExistente.cantidad = nuevaCantidad;
        } else {
            carrito.push({
                id: parseInt(producto.id),
                nombre: producto.nombre,
                precio: parseFloat(producto.precio),
                imagen: producto.imagen,
                stock: parseInt(producto.stock),
                cantidad: cantidad,
                categoria: producto.categoria,
                descripcion: producto.descripcion
            });
        }

        guardarCarrito();

        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${producto.nombre} se ${itemExistente ? 'actualizó en' : 'agregó al'} carrito`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });

        renderCarrito();
        updateCartBadge();

        // Resetear cantidad a 1
        if (cantidadInput) {
            cantidadInput.value = 1;
        }

    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto al carrito'
        });
    }
}

// Guardar carrito en localStorage
function guardarCarrito() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

// Renderizar productos del carrito - VISTA ANTIGUA
function renderCarrito() {
    const contenedor = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');

    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = '';
        if (emptyCart) emptyCart.style.display = 'block';
        actualizarTotales();
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';

    contenedor.innerHTML = '';

    carrito.forEach(item => {
        const itemSubtotal = item.precio * item.cantidad;

        const itemElement = document.createElement('div');
        itemElement.className = 'card mb-3';
        itemElement.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="card-title mb-1">${item.nombre}</h6>
                        <p class="card-text text-muted mb-1">${item.categoria}</p>
                        <small class="text-muted">${item.descripcion || ''}</small>
                    </div>
                    <div class="col-md-2 text-center">
                        <span class="fw-bold">$${item.precio.toFixed(2)}</span>
                        <br><small class="text-muted">c/u</small>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" type="button" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control text-center" value="${item.cantidad}" min="1" max="${item.stock}" 
                                   onchange="actualizarCantidad(${item.id}, this.value)" style="max-width: 60px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <small class="text-muted">Stock: ${item.stock}</small>
                    </div>
                    <div class="col-md-1 text-center">
                        <span class="fw-bold">$${itemSubtotal.toFixed(2)}</span>
                    </div>
                    <div class="col-md-1 text-center">
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarDelCarrito(${item.id})" title="Eliminar producto">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>`;

        contenedor.appendChild(itemElement);
    });

    actualizarTotales();
}

// Actualizar totales
function actualizarTotales() {
    subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    taxes = subtotal * 0.16; // 16% de impuestos
    shipping = subtotal > 500 ? 0 : 50; // Envío gratis si compra más de $500
    total = subtotal + taxes + shipping - discount;

    // Actualizar DOM
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    // Habilitar/deshabilitar botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = carrito.length === 0;
    }
}

// Actualizar cantidad de un producto
function actualizarCantidad(id, nuevaCantidad) {
    try {
        nuevaCantidad = parseInt(nuevaCantidad);

        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }

        const item = carrito.find(item => parseInt(item.id) === parseInt(id));

        if (!item) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Producto no encontrado en el carrito'
            });
            return;
        }

        if (nuevaCantidad > item.stock) {
            Swal.fire({
                icon: 'error',
                title: 'Stock insuficiente',
                text: 'No hay suficiente stock disponible'
            });
            return;
        }

        item.cantidad = nuevaCantidad;
        guardarCarrito();
        renderCarrito();
        updateCartBadge();

    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la cantidad'
        });
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Se eliminará este producto del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                carrito = carrito.filter(item => parseInt(item.id) !== parseInt(id));
                guardarCarrito();
                renderCarrito();
                updateCartBadge();

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Producto eliminado del carrito',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                });
            } catch (error) {
                console.error('Error al eliminar del carrito:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el producto'
                });
            }
        }
    });
}

// Vaciar carrito completamente
function vaciarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No hay productos en el carrito'
        });
        return;
    }

    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Se eliminarán todos los productos del carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            guardarCarrito();
            renderCarrito();
            updateCartBadge();

            Swal.fire({
                icon: 'success',
                title: 'Carrito vaciado',
                text: 'Se eliminaron todos los productos',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}

// Aplicar cupón de descuento
function aplicarCupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();

    if (!couponCode) {
        Swal.fire({
            icon: 'warning',
            title: 'Código requerido',
            text: 'Ingresa un código de descuento'
        });
        return;
    }

    // Cupones disponibles
    const cupones = {
        'DESCUENTO10': 0.10,
        'WELCOME20': 0.20,
        'SAVE15': 0.15,
        'NEWUSER': 0.25
    };

    if (cupones[couponCode]) {
        discount = subtotal * cupones[couponCode];
        actualizarTotales();

        Swal.fire({
            icon: 'success',
            title: 'Cupón aplicado',
            text: `¡Descuento de ${(cupones[couponCode] * 100)}% aplicado!`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        document.getElementById('couponCode').value = '';
        document.getElementById('applyCoupon').disabled = true;
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Cupón inválido',
            text: 'El código de descuento no es válido'
        });
    }
}

// Finalizar compra - VERSIÓN SIMPLIFICADA SIN BORRAR TOKENS
async function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de finalizar la compra'
        });
        return;
    }

    // Verificar si el usuario está autenticado - SIN verificarAutenticacion()
    const usuarioAutenticado = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    console.log('🔐 Verificando autenticación...');
    console.log('Usuario en localStorage:', usuarioAutenticado ? 'Sí existe' : 'No existe');
    console.log('Token en localStorage:', token ? 'Sí existe' : 'No existe');

    if (!usuarioAutenticado || !token) {
        Swal.fire({
            icon: 'warning',
            title: 'Iniciar sesión requerido',
            text: 'Debes iniciar sesión para finalizar la compra',
            showCancelButton: true,
            confirmButtonText: 'Ir a Usuario',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/usuario';
            }
        });
        return;
    }

    // Validar formato básico del token (debe tener al menos 2 puntos para ser JWT)
    if (!token.includes('.') || token.split('.').length !== 3) {
        console.error('❌ Token no tiene formato JWT válido');
        Swal.fire({
            icon: 'error',
            title: 'Token inválido',
            text: 'Por favor, inicia sesión nuevamente',
            confirmButtonText: 'Ir a Usuario'
        }).then(() => {
            window.location.href = '/usuario';
        });
        return;
    }

    Swal.fire({
        title: '¿Confirmar compra?',
        html: `
            <div class="text-start">
                <p><strong>Productos:</strong> ${carrito.length}</p>
                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <p><strong>Impuestos:</strong> $${taxes.toFixed(2)}</p>
                <p><strong>Envío:</strong> ${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</p>
                ${discount > 0 ? `<p><strong>Descuento:</strong> -$${discount.toFixed(2)}</p>` : ''}
                <hr>
                <p><strong>Total a pagar:</strong> $${total.toFixed(2)}</p>
                <hr>
                <small class="text-muted">Se procesará tu pedido y recibirás una confirmación.</small>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Confirmar compra',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const usuario = JSON.parse(usuarioAutenticado);

                // Mostrar loading
                Swal.fire({
                    title: 'Procesando compra...',
                    text: 'Creando pedidos en el sistema...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Preparar datos para enviar al backend
                const pedidoData = {
                    productos: carrito.map(item => ({
                        producto_id: item.id,
                        cantidad: item.cantidad
                    }))
                };

                console.log('📦 Datos del pedido a enviar:', pedidoData);
                console.log('🔑 Usando token de localStorage');
                console.log('👤 Usuario que realiza la compra:', usuario.nombre);

                // Llamar a la API para crear los pedidos
                const response = await fetch('/api/pedidos/carrito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(pedidoData)
                });

                console.log('📡 Respuesta HTTP status:', response.status);

                const result = await response.json();
                console.log('📡 Respuesta del servidor:', result);

                if (response.ok && result.success) {
                    // Limpiar carrito solo si la compra fue exitosa
                    carrito = [];
                    discount = 0;
                    guardarCarrito();
                    renderCarrito();
                    updateCartBadge();

                    Swal.fire({
                        icon: 'success',
                        title: '¡Compra exitosa!',
                        html: `
                            <div class="text-center">
                                <p>Gracias por tu compra, <strong>${usuario.nombre}</strong>!</p>
                                <p>Tu pedido ha sido registrado exitosamente en el sistema.</p>
                                <p>Se han creado ${result.pedidos ? result.pedidos.length : 'varios'} pedidos con estado <strong>PENDIENTE</strong>.</p>
                                <hr>
                                <small class="text-muted">Puedes ver tus pedidos en la sección "Usuario > Pedidos"</small>
                            </div>
                        `,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Ver mis pedidos'
                    }).then(() => {
                        window.location.href = '/usuario';
                    });
                } else {
                    // Manejar errores específicos del servidor
                    if (response.status === 401 || response.status === 403) {
                        console.error('❌ Error de autenticación:', result.message);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sesión inválida',
                            text: 'Tu sesión no es válida. Por favor, inicia sesión nuevamente',
                            confirmButtonText: 'Ir a Usuario'
                        }).then(() => {
                            // Solo ahora eliminamos los tokens si hay error de autenticación
                            localStorage.removeItem('usuario');
                            localStorage.removeItem('token');
                            window.location.href = '/usuario';
                        });
                    } else if (result.message && result.message.includes('Stock insuficiente')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Stock insuficiente',
                            text: result.message
                        });
                    } else {
                        throw new Error(result.message || 'Error al procesar la compra');
                    }
                }

            } catch (error) {
                console.error('❌ Error al finalizar compra:', error);

                // Determinar el tipo de error
                let errorMessage = 'No se pudo completar la compra. Intenta nuevamente.';
                let shouldRedirect = false;

                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
                } else if (error.message.includes('Unauthorized') || error.message.includes('Token')) {
                    errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                    shouldRedirect = true;
                } else if (error.message.includes('Stock insuficiente')) {
                    errorMessage = error.message;
                } else if (error.message.includes('Producto') && error.message.includes('no encontrado')) {
                    errorMessage = 'Algunos productos ya no están disponibles.';
                }

                if (shouldRedirect) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión expirada',
                        text: errorMessage,
                        confirmButtonText: 'Ir a Usuario'
                    }).then(() => {
                        localStorage.removeItem('usuario');
                        localStorage.removeItem('token');
                        window.location.href = '/usuario';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error en la compra',
                        text: errorMessage,
                        footer: error.message !== errorMessage ? `<small>Detalles: ${error.message}</small>` : ''
                    });
                }
            }
        }
    });
}

// Actualizar badge del carrito en navbar
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartBadge.textContent = totalItems;

        if (totalItems > 0) {
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Hacer funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidad = actualizarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.finalizarCompra = finalizarCompra;
window.aplicarCupon = aplicarCupon;
window.updateCartBadge = updateCartBadge;
window.initCarrito = initCarrito;

// Inicializar carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
});