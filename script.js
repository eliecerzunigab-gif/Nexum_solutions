/* ============================================
   NEXUM SOLUTIONS - Main JavaScript
   ============================================ */

// ==========================================
// SECURITY & PROTECTION LAYER
// ==========================================
(function() {
    // --- Disable right-click context menu ---
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // --- Disable keyboard shortcuts for devtools ---
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save Page)
        if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
            e.preventDefault();
            return false;
        }
    });

    // --- Disable text selection and copy ---
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    // --- Anti-devtools: detect devtools opening ---
    let devtoolsOpen = false;
    const checkDevTools = function() {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                document.body.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:white;font-family:sans-serif;text-align:center;padding:20px;">
                        <div>
                            <h1 style="font-size:2rem;margin-bottom:16px;">🔒 Acceso Restringido</h1>
                            <p style="font-size:1.1rem;color:rgba(255,255,255,0.7);">Las herramientas de desarrollo no están permitidas en este sitio.</p>
                            <p style="font-size:0.9rem;color:rgba(255,255,255,0.4);margin-top:12px;">Por favor, cierre DevTools para continuar navegando.</p>
                        </div>
                    </div>
                `;
            }
        } else {
            devtoolsOpen = false;
        }
    };
    setInterval(checkDevTools, 1000);
})();

// ==========================================
// MAIN APPLICATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar background on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    });

    // ==========================================
    // MOBILE NAV TOGGLE
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // ACTIVE NAV LINK
    // ==========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS (Intersection Observer) - Premium
    // ==========================================
    const animateElements = document.querySelectorAll('.servicio-card, .met-item, .stat-item, .contact-item, .ia-card');

    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger animation with spring-like easing
                const delay = parseFloat(entry.target.dataset.delay) || 0;
                entry.target.style.transition = `opacity 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                entry.target.style.transitionDelay = `${delay * 0.08}s`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.97)';
        el.style.willChange = 'opacity, transform';
        observer.observe(el);
    });

    // ==========================================
    // 3D TILT EFFECT ON SERVICE CARDS
    // ==========================================
    const tiltCards = document.querySelectorAll('.servicio-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max ±5 degrees)
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `translateY(-8px) scale(1.01) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) perspective(800px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 60; // 60 steps for smooth animation
            
            const updateCounter = () => {
                const current = parseInt(counter.innerText);
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counters when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) statsObserver.observe(statsGrid);

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showFormMessage('Por favor complete los campos requeridos.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Por favor ingrese un correo electrónico válido.', 'error');
            return;
        }

        // Simulate sending
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    function showFormMessage(text, type) {
        // Remove existing message
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `form-message ${type}`;
        msg.innerHTML = text;
        msg.style.cssText = `
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 0.9rem;
            font-weight: 500;
            ${type === 'success' 
                ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' 
                : 'background: #fef2f2; color: #991b1b; border: 1px solid #fecaca;'}
        `;

        contactForm.insertBefore(msg, contactForm.firstChild);

        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }, 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const email = input.value.trim();
        
        if (email && isValidEmail(email)) {
            const btn = newsletterForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-arrow-right"></i>';
            }, 2000);
            input.value = '';
            alert('¡Gracias por suscribirse! Recibirá nuestras novedades pronto.');
        } else {
            alert('Por favor ingrese un correo electrónico válido.');
        }
    });

    // ==========================================
    // DOWNLOAD BROCHURE (PDF Generation)
    // ==========================================
    function generateBrochure() {
        const currentYear = new Date().getFullYear();
        const brochureContent = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nexum Solutions - Brochure Corporativo</title>
                <style>
                    /* ===== UNIFIED DARK THEME - All sections same background ===== */
                    :root {
                        --primary: #3b82f6;
                        --primary-dark: #2563eb;
                        --accent: #22d3ee;
                        --gradient-1: linear-gradient(135deg, #3b82f6, #22d3ee);
                        --gradient-bg: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
                        --text-white: #ffffff;
                        --text-muted: rgba(255,255,255,0.7);
                        --text-dim: rgba(255,255,255,0.5);
                        --card-bg: rgba(255,255,255,0.06);
                        --card-border: rgba(255,255,255,0.1);
                        --card-hover: rgba(255,255,255,0.1);
                        --divider: rgba(255,255,255,0.08);
                    }

                    @page { margin: 12mm 10mm; }
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: 'Segoe UI', -apple-system, Arial, sans-serif; 
                        color: var(--text-white);
                        background: var(--gradient-bg);
                        line-height: 1.6;
                        padding: 0;
                        min-height: 100vh;
                    }

                    /* ===== COVER PAGE ===== */
                    .cover {
                        background: var(--gradient-bg);
                        color: white;
                        padding: 60px 40px;
                        text-align: center;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-height: 95vh;
                    }
                    .cover h1 { font-size: 42px; margin-bottom: 10px; letter-spacing: -1px; }
                    .cover h1 span { color: var(--accent); }
                    .cover .tagline { font-size: 18px; color: var(--text-muted); margin-bottom: 16px; }
                    .cover .pitch { font-size: 15px; color: var(--text-muted); max-width: 650px; margin: 0 auto 28px; line-height: 1.8; font-style: italic; }
                    .cover .subtitle { font-size: 16px; color: var(--text-dim); max-width: 600px; margin: 0 auto; line-height: 1.8; }
                    .cover .date { margin-top: 40px; font-size: 14px; color: var(--text-dim); }

                    /* ===== ALL SECTIONS - Same dark background ===== */
                    .section { 
                        padding: 32px 36px; 
                        page-break-inside: avoid;
                        background: var(--gradient-bg);
                        color: var(--text-white);
                    }
                    
                    .section h2 { 
                        font-size: 24px; 
                        color: var(--primary); 
                        border-bottom: 3px solid var(--primary); 
                        padding-bottom: 8px; 
                        margin-bottom: 16px; 
                    }
                    
                    .section h3.cat-title {
                        font-size: 16px;
                        color: var(--text-white);
                        margin: 20px 0 8px;
                        padding-left: 12px;
                        border-left: 3px solid var(--primary);
                        font-weight: 700;
                    }
                    
                    .section p { 
                        margin-bottom: 10px; 
                        color: var(--text-muted); 
                        font-size: 13px; 
                    }

                    .section .intro-text {
                        font-size: 13.5px;
                        color: var(--text-muted);
                        margin-bottom: 16px;
                        line-height: 1.7;
                    }

                    .section .cat-desc {
                        font-size: 12px;
                        color: var(--text-dim);
                        margin-bottom: 10px;
                        font-style: italic;
                    }

                    /* ===== SERVICES GRID ===== */
                    .services-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 12px; 
                        margin-top: 10px; 
                    }
                    
                    .service-item { 
                        background: var(--card-bg); 
                        padding: 14px 16px; 
                        border-radius: 10px; 
                        border: 1px solid var(--card-border);
                        border-left: 4px solid var(--primary);
                        transition: background 0.2s;
                    }
                    .service-item h3 { 
                        font-size: 13px; 
                        color: var(--text-white); 
                        margin-bottom: 4px; 
                        font-weight: 700;
                    }
                    .service-item p { 
                        font-size: 11.5px; 
                        color: var(--text-muted); 
                        margin: 0; 
                        line-height: 1.5;
                    }

                    /* ===== IA GRID ===== */
                    .ia-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 12px; 
                        margin-top: 12px; 
                    }
                    .ia-item { 
                        background: var(--card-bg); 
                        padding: 14px; 
                        border-radius: 10px; 
                        border: 1px solid var(--card-border);
                    }
                    .ia-item h3 { 
                        font-size: 12.5px; 
                        color: var(--accent); 
                        margin-bottom: 4px; 
                        font-weight: 700;
                    }
                    .ia-item p { 
                        font-size: 11px; 
                        color: var(--text-muted); 
                        margin: 0; 
                        line-height: 1.5;
                    }

                    /* ===== FOOTER ===== */
                    .footer-text { 
                        text-align: center; 
                        padding: 20px; 
                        font-size: 12px; 
                        color: var(--text-dim); 
                        border-top: 1px solid var(--divider); 
                        margin-top: 28px; 
                    }

                    .quote-text {
                        margin-top: 24px;
                        font-style: italic;
                        color: var(--text-muted);
                        font-size: 14px;
                        text-align: center;
                        padding: 18px 0;
                        border-top: 1px solid var(--divider);
                    }

                    /* ===== RESPONSIVE ===== */
                    @media (max-width: 768px) {
                        .cover { padding: 40px 28px; min-height: auto; }
                        .cover h1 { font-size: 32px; }
                        .cover .pitch { font-size: 13px; }
                        .cover .subtitle { font-size: 14px; }
                        .section { padding: 24px 22px; }
                        .section h2 { font-size: 20px; }
                        .services-grid { grid-template-columns: 1fr; gap: 10px; }
                        .ia-grid { grid-template-columns: 1fr; gap: 10px; }
                        .service-item { padding: 12px 14px; }
                        .service-item h3 { font-size: 12.5px; }
                        .service-item p { font-size: 11px; }
                        .ia-item { padding: 12px; }
                        .ia-item h3 { font-size: 12px; }
                        .ia-item p { font-size: 10.5px; }
                    }

                    @media (max-width: 480px) {
                        .cover { padding: 28px 18px; }
                        .cover h1 { font-size: 26px; }
                        .cover .tagline { font-size: 15px; }
                        .cover .pitch { font-size: 12px; }
                        .cover .subtitle { font-size: 12px; }
                        .section { padding: 18px 14px; }
                        .section h2 { font-size: 17px; }
                        .section h3.cat-title { font-size: 14px; }
                        .section .intro-text { font-size: 12px; }
                        .service-item { padding: 10px 12px; }
                        .service-item h3 { font-size: 11.5px; }
                        .service-item p { font-size: 10.5px; }
                        .ia-item { padding: 10px; }
                        .ia-item h3 { font-size: 11px; }
                        .ia-item p { font-size: 10px; }
                        .footer-text { font-size: 10px; padding: 14px; }
                        .quote-text { font-size: 12px; padding: 14px 0; }
                    }

                    @media (max-width: 360px) {
                        .cover { padding: 20px 12px; }
                        .cover h1 { font-size: 22px; }
                        .section { padding: 14px 10px; }
                        .section h2 { font-size: 15px; }
                        .service-item { padding: 8px 10px; }
                        .ia-item { padding: 8px; }
                    }

                    /* ===== PRINT ===== */
                    @media print {
                        body { 
                            background: #0f172a !important; 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                        }
                        .cover { 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                        }
                        .section { 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                        }
                        .service-item, .ia-item { 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                        }
                    }
                </style>
            </head>
            <body>
                <!-- ===== COVER ===== -->
                <div class="cover">
                    <h1>Nexum <span>Solutions</span></h1>
                    <p class="tagline">Conectando la Estrategia con el Futuro Digital</p>
                    <p class="pitch">"En Nexum Solutions, entendemos que la TI actual no se trata solo de infraestructura, sino de conexiones: conectar la estrategia con la ejecución, los costos con el valor, y el potencial de la Inteligencia Artificial con la operatividad diaria. No somos solo proveedores; somos el puente hacia la agilidad tecnológica de su empresa."</p>
                    <p class="subtitle">Soluciones innovadoras de consultoría y servicios de TI, apoyando a nuestros clientes en el diseño, transformación y operación del área, incrementando sus capacidades y alineando los objetivos a la estrategia de negocio.</p>
                    <p class="date">Brochure Corporativo — ${currentYear}</p>
                </div>

                <!-- ===== SERVICIOS ===== -->
                <div class="section">
                    <h2>Nuestros Servicios</h2>
                    <p class="intro-text">Agrupamos nuestros servicios bajo los desafíos que resolvemos para impulsar su transformación digital.</p>
                    
                    <h3 class="cat-title">I. Estrategia y Gobierno — La Fundación</h3>
                    <p class="cat-desc">Aseguramos que la tecnología sea el motor del negocio, no un gasto operativo.</p>
                    <div class="services-grid">
                        <div class="service-item">
                            <h3>Consultoría TI Estratégica</h3>
                            <p>Acompañamiento en transformación digital alineando tecnología con objetivos de negocio.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión de Compliance & Gobierno IT</h3>
                            <p>Marcos de trabajo seguros, normados y escalables para cumplimiento normativo.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión Estratégica VMO</h3>
                            <p>Optimización del valor del ecosistema de proveedores mediante diseño estratégico.</p>
                        </div>
                        <div class="service-item">
                            <h3>GRC Avanzado</h3>
                            <p>Evaluación de riesgos, continuidad operativa (BIA/BCP/DRP) y resiliencia empresarial.</p>
                        </div>
                    </div>

                    <h3 class="cat-title">II. Eficiencia Operativa — El Motor</h3>
                    <p class="cat-desc">Maximizamos el rendimiento de sus activos mediante metodologías probadas.</p>
                    <div class="services-grid">
                        <div class="service-item">
                            <h3>Gestión ITSM & ITIL</h3>
                            <p>Estandarización y eficiencia en servicios TI basados en las mejores prácticas ITIL.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión de SLA/SLO</h3>
                            <p>Aseguramiento de niveles de servicio alineados a la realidad operativa.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión y Análisis SAM</h3>
                            <p>Control, optimización y transparencia en activos de software para reducir costos.</p>
                        </div>
                        <div class="service-item">
                            <h3>Sourcing Estratégico (RFXs)</h3>
                            <p>Procesos de adquisición RFI, RFQ, RFT, RFP de alto impacto.</p>
                        </div>
                        <div class="service-item">
                            <h3>Benchmarking y Reducción de Costos</h3>
                            <p>Proyectos de eficiencia financiera y maximización de inversiones TI. Caso destacado: migración Oracle → PostgreSQL con ahorro del 70% en licencias.</p>
                        </div>
                        <div class="service-item">
                            <h3>Operational Model & Transition</h3>
                            <p>Diseño y aceleración de capacidades competitivas. Gestión de transiciones sin disrupción.</p>
                        </div>
                    </div>

                    <h3 class="cat-title">III. Innovación y Capa Agéntica — La Evolución</h3>
                    <p class="cat-desc">Construimos el mañana con soluciones inteligentes diseñadas para escalar.</p>
                    <div class="services-grid">
                        <div class="service-item">
                            <h3>Desarrollo de Capa Agéntica</h3>
                            <p>Sistemas autónomos e inteligentes para automatización de procesos complejos.</p>
                        </div>
                        <div class="service-item">
                            <h3>IA Operacional Automatizada</h3>
                            <p>Software a medida para ejecución inteligente sin fricción de procesos críticos.</p>
                        </div>
                        <div class="service-item">
                            <h3>Desarrollo de Productos & Web</h3>
                            <p>Soluciones digitales escalables centradas en experiencia de usuario.</p>
                        </div>
                        <div class="service-item">
                            <h3>Change Management</h3>
                            <p>Estrategias de adopción para evolucionar con la tecnología de manera efectiva.</p>
                        </div>
                    </div>
                </div>

                <!-- ===== IA AGÉNTICA ===== -->
                <div class="section">
                    <h2>Casos de Uso de IA Agéntica</h2>
                    <p class="intro-text">Nuestra mayor ventaja competitiva. Sistemas autónomos que aprenden, deciden y ejecutan para transformar su operación.</p>
                    <div class="ia-grid">
                        <div class="ia-item">
                            <h3>🤖 Soporte TI Autónomo</h3>
                            <p>Agentes que diagnostican y resuelven incidencias en tiempo real, reduciendo tiempos de respuesta en un 70%.</p>
                        </div>
                        <div class="ia-item">
                            <h3>📋 Compliance y Auditoría</h3>
                            <p>Monitoreo continuo de cumplimiento normativo con reportes automatizados y detección de desviaciones.</p>
                        </div>
                        <div class="ia-item">
                            <h3>📊 Optimización SAM</h3>
                            <p>Análisis de uso de software, identificación de licencias infrautilizadas y optimización autónoma.</p>
                        </div>
                        <div class="ia-item">
                            <h3>🔗 Gestión VMO</h3>
                            <p>Evaluación de rendimiento de proveedores, negociación y gestión contractual basada en datos.</p>
                        </div>
                        <div class="ia-item">
                            <h3>⚙️ Automatización Operacional</h3>
                            <p>Orquestación de flujos de trabajo complejos integrando sistemas legacy con nuevas tecnologías.</p>
                        </div>
                        <div class="ia-item">
                            <h3>👥 Gestión Estratégica WMO</h3>
                            <p>Agente autónomo que analiza la estructura organizacional, evalúa capacidades del personal, identifica brechas de habilidades y recomienda mejoras estratégicas en funciones y perfiles para optimizar la productividad.</p>
                        </div>
                        <div class="ia-item">
                            <h3>🛡️ Resiliencia y Continuidad</h3>
                            <p>Ejecución automática de protocolos BCP/DRP ante incidentes y coordinación de recuperación.</p>
                        </div>
                    </div>
                </div>

                <!-- ===== CONTACTO ===== -->
                <div class="section">
                    <h2>Contacto</h2>
                    <p class="intro-text">Para más información sobre nuestros servicios y soluciones, lo invitamos a visitar nuestro sitio web y completar el formulario de contacto. Estamos listos para escuchar sus necesidades y ofrecerle la solución que su empresa merece.</p>
                    <div class="quote-text">
                        "Conectando la estrategia con el futuro digital."
                    </div>
                    <div class="footer-text">
                        <p>© ${currentYear} Nexum Solutions. Todos los derechos reservados.</p>
                        <p>Conectando la Estrategia con el Futuro Digital</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Open in new window for printing/PDF
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(brochureContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Trigger print dialog after a short delay to let content render
        setTimeout(() => {
            printWindow.print();
        }, 600);
    }

    // Attach download handlers to all download buttons
    const downloadButtons = [
        document.getElementById('downloadBtn'),
        document.getElementById('downloadBtn2'),
        document.getElementById('downloadBtn3'),
        document.getElementById('downloadBtn4')
    ].filter(btn => btn !== null);

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            generateBrochure();
        });
    });

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // PARALLAX EFFECT ON HERO
    // ==========================================
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero && window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.4;
            hero.style.backgroundPositionY = `${offset}px`;
        }
    });

    console.log('🚀 Nexum Solutions - Web initialized successfully');
});
