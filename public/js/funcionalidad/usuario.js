let usuarioAutenticado = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
let datosAdicionales = localStorage.getItem('datosAdicionales') ? JSON.parse(localStorage.getItem('datosAdicionales')) : {};

// Función helper para obtener headers con autenticación
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Cargar contenido de usuario
function cargarUsuario() {
    const userContent = document.getElementById('user-content');
    if (!usuarioAutenticado) {
        // Mostrar formulario de login/register
        userContent.innerHTML = `
            <div class="card p-4">
                <h4 class="card-title" style="color: #dcdcdc !important;">Iniciar Sesión o Registrarse</h4>
                <form id="loginForm">
                    <div class="mb-3">
                        <input type="email" class="form-control" id="email" placeholder="Correo" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="password" placeholder="Contraseña" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    <p class="mt-3">¿No tienes cuenta? <a href="#" id="showRegister">Regístrate</a></p>
                </form>
                <form id="registerForm" style="display: none;">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regNombre" placeholder="Nombre" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regApellido" placeholder="Apellido" required>
                    </div>
                    <div class="mb-3">
                        <input type="email" class="form-control" id="regEmail" placeholder="Correo" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="regPassword" placeholder="Contraseña" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regEmpresa" placeholder="Empresa (Opcional)">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regDireccion" placeholder="Dirección (Opcional)">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regCiudad" placeholder="Ciudad (Opcional)">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regPais" placeholder="País (Opcional)">
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="regCodigoPostal" placeholder="Código Postal (Opcional)">
                    </div>
                    <button type="submit" class="btn btn-primary">Registrarse</button>
                    <p class="mt-3">¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia sesión</a></p>
                </form>
            </div>
        `;

        // Manejar inicio de sesión
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                correo: document.getElementById('email').value,
                contrasena: document.getElementById('password').value
            };
            try {
                const response = await fetch('/api/usuarios/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) {
                    usuarioAutenticado = result.usuario; // Cambiado de result.user a result.usuario
                    console.log('Usuario autenticado:', usuarioAutenticado);
                    
                    // Guardar usuario y token en localStorage
                    localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                    if (result.token) {
                        localStorage.setItem('token', result.token);
                        console.log('Token guardado:', result.token);
                    }
                    
                    // Si no hay datos adicionales en localStorage, se inicializan vacíos
                    if (!localStorage.getItem('datosAdicionales')) {
                        datosAdicionales = {};
                        localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
                    }
                    Swal.fire('Éxito', 'Sesión iniciada', 'success');
                    cargarUsuario();
                } else {
                    Swal.fire('Error', result.message || 'Error al iniciar sesión', 'error');
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                Swal.fire('Error', 'Error de conexión al servidor', 'error');
            }
        });

        // Manejar registro
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
        });

        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('regNombre').value,
                apellido: document.getElementById('regApellido').value,
                correo: document.getElementById('regEmail').value,
                contrasena: document.getElementById('regPassword').value
            };
            datosAdicionales = {
                empresa: document.getElementById('regEmpresa').value,
                direccion: document.getElementById('regDireccion').value,
                ciudad: document.getElementById('regCiudad').value,
                pais: document.getElementById('regPais').value,
                codigo_postal: document.getElementById('regCodigoPostal').value
            };
            localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    Swal.fire('Éxito', 'Usuario registrado', 'success');
                    usuarioAutenticado = result.usuario || data;
                    
                    // Guardar usuario y token en localStorage
                    localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                    if (result.token) {
                        localStorage.setItem('token', result.token);
                        console.log('Token de registro guardado:', result.token);
                    }
                    
                    cargarUsuario();
                } else {
                    Swal.fire('Error', result.message || 'Correo ya registrado', 'error');
                }
            } catch (error) {
                console.error('Error al registrar:', error);
                Swal.fire('Error', 'Error al registrar', 'error');
            }
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        });
    } else {
        // Mostrar perfil editable
        userContent.innerHTML = `
            <div class="card p-4">
                <h4 class="card-title">Perfil de ${usuarioAutenticado.nombre}</h4>
                <form id="editProfileForm">
                    <div class="mb-3">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="editNombre" value="${usuarioAutenticado.nombre || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="editApellido" value="${usuarioAutenticado.apellido || ''}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo</label>
                        <input type="email" class="form-control" id="editCorreo" value="${usuarioAutenticado.correo || ''}" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nueva Contraseña (Opcional)</label>
                        <input type="password" class="form-control" id="editPassword" placeholder="Dejar vacío para mantener la actual">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Empresa</label>
                        <input type="text" class="form-control" id="editEmpresa" value="${datosAdicionales.empresa || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Dirección</label>
                        <input type="text" class="form-control" id="editDireccion" value="${datosAdicionales.direccion || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ciudad</label>
                        <input type="text" class="form-control" id="editCiudad" value="${datosAdicionales.ciudad || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">País</label>
                        <input type="text" class="form-control" id="editPais" value="${datosAdicionales.pais || ''}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Código Postal</label>
                        <input type="text" class="form-control" id="editCodigoPostal" value="${datosAdicionales.codigo_postal || ''}">
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </form>
                <button id="logoutButton" class="btn btn-danger mt-3">Cerrar Sesión</button>
            </div>
        `;

        document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                id: usuarioAutenticado.id,
                nombre: document.getElementById('editNombre').value,
                apellido: document.getElementById('editApellido').value,
                correo: usuarioAutenticado.correo
            };
            
            const password = document.getElementById('editPassword').value;
            if (password) {
                data.contrasena = password;
            }
            
            datosAdicionales = {
                empresa: document.getElementById('editEmpresa').value,
                direccion: document.getElementById('editDireccion').value,
                ciudad: document.getElementById('editCiudad').value,
                pais: document.getElementById('editPais').value,
                codigo_postal: document.getElementById('editCodigoPostal').value
            };
            localStorage.setItem('datosAdicionales', JSON.stringify(datosAdicionales));
            
            try {
                const response = await fetch(`/api/usuarios/${usuarioAutenticado.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    Swal.fire('Éxito', 'Perfil actualizado', 'success');
                    usuarioAutenticado = { ...usuarioAutenticado, ...data };
                    localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
                } else {
                    Swal.fire('Error', result.message || 'Error al actualizar perfil', 'error');
                }
            } catch (error) {
                console.error('Error al actualizar:', error);
                Swal.fire('Error', 'Error al actualizar', 'error');
            }
        });

        // Manejar cierre de sesión
        document.getElementById('logoutButton').addEventListener('click', () => {
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            localStorage.removeItem('datosAdicionales');
            usuarioAutenticado = null;
            datosAdicionales = {};
            Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success').then(() => {
                cargarUsuario();
            });
        });
    }
}

// Cargar contenido de pedidos
function cargarPedidos() {
    const ordersContent = document.getElementById('orders-content');
    if (!usuarioAutenticado) {
        ordersContent.innerHTML = '<p class="text-muted">Debes iniciar sesión para ver tus pedidos.</p>';
        return;
    }
    
    // Mostrar indicador de carga
    ordersContent.innerHTML = `
        <div class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando pedidos...</p>
        </div>
    `;
    
    // Solo cargar pedidos del usuario autenticado
    fetch('/api/pedidos/mis-pedidos', {
        headers: getAuthHeaders()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de pedidos recibidos:', data);
            
            if (data.success && data.pedidos && Array.isArray(data.pedidos)) {
                if (data.pedidos.length === 0) {
                    ordersContent.innerHTML = `
                        <div class="text-center py-5">
                            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No tienes pedidos aún.</p>
                            <p><small>Cuando realices una compra, tus pedidos aparecerán aquí.</small></p>
                        </div>
                    `;
                } else {
                    ordersContent.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0">
                                <i class="fas fa-box"></i> 
                                Mis Pedidos 
                                <span class="badge bg-primary">${data.pedidos.length}</span>
                            </h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Cantidad</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.pedidos.map(p => `
                                        <tr>
                                            <td><strong>#${p.id}</strong></td>
                                            <td>${new Date(p.creacion || Date.now()).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</td>
                                            <td>
                                                <strong>${p.nombre_producto || 'Producto'}</strong>
                                            </td>
                                            <td>
                                                <span class="badge bg-info">${p.categoria_producto || 'Sin categoría'}</span>
                                            </td>
                                            <td>
                                                <span class="badge bg-secondary">${p.cantidad}</span>
                                            </td>
                                            <td>
                                                <span class="badge bg-${getEstadoColor(p.estado)}">
                                                    <i class="fas ${getEstadoIcon(p.estado)}"></i>
                                                    ${p.estado ? p.estado.toUpperCase() : 'PENDIENTE'}
                                                </span>
                                            </td>
                                            <td>
                                                ${p.estado?.toLowerCase() === 'pendiente' ? `
                                                    <button class="btn btn-danger btn-sm" 
                                                            onclick="cancelarPedido(${p.id})"
                                                            title="Cancelar pedido">
                                                        <i class="fas fa-times"></i> Cancelar
                                                    </button>
                                                ` : `
                                                    <button class="btn btn-secondary btn-sm" 
                                                            disabled
                                                            title="No se puede cancelar - Estado: ${p.estado || 'N/A'}">
                                                        <i class="fas fa-ban"></i> ${getEstadoTexto(p.estado)}
                                                    </button>
                                                `}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                }
            } else {
                ordersContent.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        No se pudieron cargar los pedidos. ${data.message || 'Error desconocido.'}
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error al cargar pedidos:', error);
            ordersContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle"></i>
                    <strong>Error al cargar pedidos:</strong> ${error.message}
                    <br><small>Verifica tu conexión e intenta nuevamente.</small>
                </div>
            `;
        });
}

// Funciones auxiliares para la visualización de pedidos
function getEstadoColor(estado) {
    switch (estado?.toLowerCase()) {
        case 'completado':
        case 'entregado':
            return 'success';
        case 'pendiente':
            return 'warning';
        case 'enviado':
            return 'info';
        case 'cancelado':
            return 'danger';
        default:
            return 'secondary';
    }
}

function getEstadoIcon(estado) {
    switch (estado?.toLowerCase()) {
        case 'completado':
        case 'entregado':
            return 'fa-check-circle';
        case 'pendiente':
            return 'fa-clock';
        case 'enviado':
            return 'fa-truck';
        case 'cancelado':
            return 'fa-times-circle';
        default:
            return 'fa-question-circle';
    }
}

function getEstadoTexto(estado) {
    switch (estado?.toLowerCase()) {
        case 'enviado':
            return 'Enviado';
        case 'entregado':
            return 'Entregado';
        case 'cancelado':
            return 'Cancelado';
        default:
            return 'No disponible';
    }
}

// Función para cancelar un pedido
async function cancelarPedido(pedidoId) {
    try {
        // Mostrar confirmación
        const result = await Swal.fire({
            title: '¿Cancelar pedido?',
            text: `¿Estás seguro de que quieres cancelar el pedido #${pedidoId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, mantener',
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        // Mostrar loading
        Swal.fire({
            title: 'Cancelando pedido...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Realizar petición para cancelar
        const response = await fetch(`/api/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ estado: 'cancelado' })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Pedido cancelado',
                text: `El pedido #${pedidoId} ha sido cancelado exitosamente`,
                confirmButtonText: 'Entendido'
            }).then(() => {
                // Recargar la lista de pedidos
                cargarPedidos();
            });
        } else {
            throw new Error(data.message || 'Error al cancelar el pedido');
        }

    } catch (error) {
        console.error('Error al cancelar pedido:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cancelar',
            text: error.message || 'No se pudo cancelar el pedido. Intenta nuevamente.',
            confirmButtonText: 'Entendido'
        });
    }
}

// Inicializar pestañas
document.addEventListener('DOMContentLoaded', function() {
    const userTab = document.getElementById('user-tab');
    const ordersTab = document.getElementById('orders-tab');
    
    if (userTab) {
        userTab.addEventListener('shown.bs.tab', cargarUsuario);
    }
    
    if (ordersTab) {
        ordersTab.addEventListener('shown.bs.tab', cargarPedidos);
    }
    
    // Cargar por defecto
    cargarUsuario();
});