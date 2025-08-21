function loadSidebar() {
    // Verificar si ya existe un sidebar para evitar duplicación
    const existingSidebar = document.getElementById('sidebar');
    if (existingSidebar) {
        existingSidebar.remove();
    }

    const sidebar = `
        <nav class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="assets/icons/logo.png" alt="Logo" class="sidebar-logo">
                <h3>Menú</h3>
            </div>
            <ul>
                <li>
                    <a href="/">
                        <i class="fas fa-home"></i>
                        <span class="menu-text">Inicio</span>
                    </a>
                </li>
                <li>
                    <a href="/productos">
                        <i class="fas fa-box"></i>
                        <span class="menu-text">Productos</span>
                    </a>
                </li>
                <li>
                    <a href="/carrito">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="menu-text">Carrito</span>
                    </a>
                </li>
                <li>
                    <a href="/usuario">
                        <i class="fas fa-user"></i>
                        <span class="menu-text">Usuario</span>
                    </a>
                </li>
            </ul>
        </nav>`;

    document.body.insertAdjacentHTML('afterbegin', sidebar);
    initSidebar();
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) {
        console.error('Sidebar not found during initialization');
        return;
    }

    // Verificar estado inicial del sidebar basado en localStorage
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    
    // Aplicar estado inicial
    if (sidebarState === 'true') {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
        console.log('Sidebar initialized as collapsed');
    } else {
        sidebar.classList.remove('collapsed');
        document.body.classList.remove('sidebar-collapsed');
        console.log('Sidebar initialized as expanded');
    }

    // Agregar listeners para los enlaces del sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="/"], .sidebar a[href="/"]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                // Marcar como activo
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Marcar enlace activo basado en la URL actual
    const currentPath = window.location.pathname;
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    // Manejar responsive behavior
    handleResize();
    
    // Ajustar footer inmediatamente sin delay
    adjustFooterForSidebar();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) {
        console.error('Sidebar element not found');
        return;
    }

    // Verificar el estado actual del sidebar
    const isCurrentlyCollapsed = sidebar.classList.contains('collapsed');

    console.log('Toggling sidebar. Currently collapsed:', isCurrentlyCollapsed);

    if (isCurrentlyCollapsed) {
        // Expandir sidebar
        sidebar.classList.remove('collapsed');
        document.body.classList.remove('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'false');
        console.log('Sidebar expanded');
    } else {
        // Colapsar sidebar
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', 'true');
        console.log('Sidebar collapsed');
    }

    // Ajustar footer inmediatamente - SIN DELAY
    adjustFooterForSidebar();
}

function handleResize() {
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        // En móviles, siempre mantener colapsado visualmente
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    } else {
        // En desktop, respetar la preferencia del usuario
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
        }
    }

    // Ajustar footer inmediatamente sin delay
    adjustFooterForSidebar();
}

function adjustFooterForSidebar() {
    const footer = document.getElementById('main-footer');
    const sidebar = document.getElementById('sidebar');
    
    if (!footer || !sidebar) {
        console.log('Footer or sidebar not found for adjustment');
        return;
    }
    
    // Verificar si el sidebar está colapsado
    const isCollapsed = sidebar.classList.contains('collapsed') || 
                       document.body.classList.contains('sidebar-collapsed');
    
    console.log('Adjusting footer immediately. Sidebar collapsed:', isCollapsed);
    
    // APLICAR CAMBIOS CON TRANSICIÓN
    footer.style.marginLeft = '';
    footer.style.width = 'calc(100% - 250px)';  
    
    if (isCollapsed) {
        // Sidebar collapsed
        if (window.innerWidth <= 768) {
            footer.style.marginLeft = '0';
            footer.style.width = '100%';
        } else {
            footer.style.marginLeft = '60px';
            footer.style.width = 'calc(100% - 60px)';
        }
    } else {
        // Sidebar expanded
        footer.style.marginLeft = '250px';
        footer.style.width = 'calc(100% - 250px)';
    }
    
    // Restaurar transición después de aplicar cambios
    setTimeout(() => {
        footer.style.transition = 'all 0.3s ease';
    }, 50);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Cambiar ícono y texto
    const darkModeLink = document.querySelector('.sidebar a[onclick="toggleDarkMode()"]');
    if (darkModeLink) {
        const icon = darkModeLink.querySelector('i');
        const text = darkModeLink.querySelector('.menu-text');

        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            text.textContent = 'Modo Claro';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Modo Oscuro';
        }
    }

    // Mostrar notificación
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// Escuchar cambios en el tamaño de ventana
window.addEventListener('resize', handleResize);

// Hacer funciones globales
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;
window.handleResize = handleResize;
window.adjustFooterForSidebar = adjustFooterForSidebar;

                //     <a href="#" onclick="toggleDarkMode()">
                //         <i class="fas fa-moon"></i>
                //         <span class="menu-text">Modo Oscuro</span>
                //     </a>
                // </li>
                // <li>
                //     <a href="/health">
                //         <i class="fas fa-heartbeat"></i>
                //         <span class="menu-text">Estado API</span>
                //     </a>
                // </li>