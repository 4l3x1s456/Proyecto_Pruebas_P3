function loadFooter() {
    // Verificar si ya existe un footer para evitar duplicación
    const existingFooter = document.getElementById('main-footer');
    if (existingFooter) {
        existingFooter.remove();
    }

    const footer = `
        <footer id="main-footer" class="footer bg-dark text-light">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 mb-4">
                        <h5><i class="fas fa-store"></i> AG-Store</h5>
                        <p class="text-muted">Tu tienda online de confianza para productos tecnológicos de alta calidad. Encuentra los mejores dispositivos al mejor precio.</p>
                        <div class="social-links">
                            <a href="#" class="text-light me-3"><i class="fab fa-facebook fa-lg"></i></a>
                            <a href="#" class="text-light me-3"><i class="fab fa-twitter fa-lg"></i></a>
                            <a href="#" class="text-light me-3"><i class="fab fa-instagram fa-lg"></i></a>
                            <a href="#" class="text-light me-3"><i class="fab fa-linkedin fa-lg"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-md-2 mb-4">
                        <h6>Navegación</h6>
                        <ul class="list-unstyled">
                            <li><a href="/" class="text-muted text-decoration-none">Inicio</a></li>
                            <li><a href="/productos" class="text-muted text-decoration-none">Productos</a></li>
                            <li><a href="/carrito" class="text-muted text-decoration-none">Carrito</a></li>
                            <li><a href="/usuario" class="text-muted text-decoration-none">Mi Cuenta</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-md-2 mb-4">
                        <h6>Categorías</h6>
                        <ul class="list-unstyled">
                            <li><a href="/productos?categoria=smartphone" class="text-muted text-decoration-none">Smartphones</a></li>
                            <li><a href="/productos?categoria=laptop" class="text-muted text-decoration-none">Laptops</a></li>
                            <li><a href="/productos?categoria=accesorio" class="text-muted text-decoration-none">Accesorios</a></li>
                            <li><a href="/productos?categoria=auricular" class="text-muted text-decoration-none">Auriculares</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-md-2 mb-4">
                        <h6>Ayuda</h6>
                        <ul class="list-unstyled">
                            <li><a href="#" class="text-muted text-decoration-none">Preguntas Frecuentes</a></li>
                            <li><a href="#" class="text-muted text-decoration-none">Política de Devoluciones</a></li>
                            <li><a href="#" class="text-muted text-decoration-none">Envíos</a></li>
                            <li><a href="#" class="text-muted text-decoration-none">Contacto</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-md-2 mb-4">
                        <h6>Información</h6>
                        <ul class="list-unstyled">
                            <li><a href="#" class="text-muted text-decoration-none">Sobre Nosotros</a></li>
                            <li><a href="#" class="text-muted text-decoration-none">Términos y Condiciones</a></li>
                            <li><a href="#" class="text-muted text-decoration-none">Política de Privacidad</a></li>
                            <li><a href="/health" class="text-muted text-decoration-none">Estado del Sistema</a></li>
                        </ul>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <div class="d-flex align-items-center">
                            <i class="fas fa-shield-alt text-success me-2"></i>
                            <small class="text-muted">Compra 100% Segura</small>
                            <i class="fas fa-shipping-fast text-primary ms-4 me-2"></i>
                            <small class="text-muted">Envío Rápido</small>
                        </div>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <div class="payment-methods">
                            <i class="fab fa-cc-visa fa-2x text-primary me-2"></i>
                            <i class="fab fa-cc-mastercard fa-2x text-warning me-2"></i>
                            <i class="fab fa-cc-amex fa-2x text-info me-2"></i>
                            <i class="fab fa-paypal fa-2x text-primary"></i>
                        </div>
                    </div>
                </div>
                
                <hr class="my-4">
                
                <div class="row">
                    <div class="col-md-6">
                        <p class="text-muted mb-0">
                            &copy; ${new Date().getFullYear()} AG-Store Node.js. Todos los derechos reservados.
                        </p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <small class="text-muted">
                            @AlexGames Studios Development Team <i class="fa-brands fa-galactic-senate"></i>
                        </small>
                    </div>
                </div>
            </div>
        </footer>`;

    document.body.insertAdjacentHTML('beforeend', footer);
    initFooter();
}

function initFooter() {
    // Efectos hover para enlaces del footer
    const footerLinks = document.querySelectorAll('#main-footer a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transition = 'color 0.3s ease';
            if (this.classList.contains('text-muted')) {
                this.style.color = '#ffffff';
            }
        });

        link.addEventListener('mouseleave', function () {
            if (this.classList.contains('text-muted')) {
                this.style.color = '';
            }
        });
    });

    // Ajustar footer basado en el estado inicial del sidebar - SIN DELAY
    if (window.adjustFooterForSidebar) {
        window.adjustFooterForSidebar();
    }
}

// ...resto de las funciones sin cambios...
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput.value.trim();

    if (!email) {
        Swal.fire({
            icon: 'warning',
            title: 'Email requerido',
            text: 'Por favor ingresa tu email para suscribirte',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    if (!isValidEmail(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido',
            text: 'Por favor ingresa un email válido',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Simular suscripción
    Swal.fire({
        icon: 'success',
        title: '¡Suscripción exitosa!',
        text: 'Te has suscrito correctamente a nuestro boletín',
        confirmButtonText: 'Excelente'
    });

    emailInput.value = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hacer funciones globales
window.subscribeNewsletter = subscribeNewsletter;


// <!-- Newsletter Section -->
//                 <div class="row mt-4">
//                     <div class="col-md-8 mx-auto text-center">
//                         <h6>Suscríbete a nuestro boletín</h6>
//                         <p class="text-muted">Recibe las últimas ofertas y novedades directamente en tu email</p>
//                         <div class="input-group mb-3">
//                             <input type="email" class="form-control" placeholder="Tu email..." id="newsletter-email">
//                             <button class="btn btn-primary" type="button" onclick="subscribeNewsletter()">
//                                 <i class="fas fa-paper-plane"></i> Suscribirse
//                             </button>
//                         </div>
//                     </div>
//                 </div>