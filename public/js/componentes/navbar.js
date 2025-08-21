function loadNavbar() {
    // Verificar si ya existe un navbar para evitar duplicación
    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) {
        existingNavbar.remove();
    }

    const navbar = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container-fluid">
                <button class="btn btn-outline-light me-3" type="button" onclick="toggleSidebar()" id="sidebar-toggle">
                    <i class="fas fa-bars"></i>
                </button>
                
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="assets/icons/logo.png" alt="Logo" width="32" height="32" class="me-2">
                    AG-Store
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/"><i class="fas fa-home"></i> Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/productos"><i class="fas fa-box"></i> Productos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/carrito"><i class="fas fa-shopping-cart"></i> Carrito</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/usuario"><i class="fas fa-user"></i> Usuario</a>
                        </li>
                    </ul>

                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-light me-2 position-relative" onclick="window.location.href='/carrito'">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="cart-badge" class="cart-badge">0</span>
                        </button>
                        
                        <div class="dropdown">
                            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-user"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="/usuario"><i class="fas fa-user-circle"></i> Mi Perfil</a></li>
                                <li><a class="dropdown-item" href="/usuario#pedidos"><i class="fas fa-box"></i> Mis Pedidos</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>`;

    document.body.insertAdjacentHTML('afterbegin', navbar);
    initNavbar();
}

function initNavbar() {
    // Marcar enlace activo basado en la URL actual
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Actualizar contador del carrito
    updateCartBadge();
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;

        if (totalItems > 0) {
            cartBadge.style.display = 'inline-block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

function logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('datosAdicionales');

    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        window.location.href = '/';
    });
}

// Hacer funciones globales
window.updateCartBadge = updateCartBadge;
window.logout = logout;