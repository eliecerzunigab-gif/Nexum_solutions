/* ============================================
   NEXUM SOLUTIONS - Main JavaScript
   ============================================ */

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
    // SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================
    const animateElements = document.querySelectorAll('.servicio-card, .met-item, .stat-item, .contact-item, .ia-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        
        // Add delay based on data-delay attribute or index
        const delay = el.dataset.delay || 0;
        el.style.transitionDelay = `${delay * 0.1}s`;
        
        observer.observe(el);
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
                    /* CSS Variables - Light Mode */
                    :root {
                        --primary: #2563eb;
                        --primary-dark: #1d4ed8;
                        --accent: #06b6d4;
                        --gradient-1: linear-gradient(135deg, #2563eb, #06b6d4);
                        --gradient-2: linear-gradient(135deg, #1e3a5f, #2563eb);
                        --text-primary: #1e293b;
                        --text-secondary: #475569;
                        --text-light: #94a3b8;
                        --bg-white: #ffffff;
                        --bg-light: #f8f9fc;
                        --bg-dark: #0f172a;
                        --border: #e2e8f0;
                        --card-bg: #f8f9fc;
                        --card-border: #e2e8f0;
                        --ia-bg: #f0f4ff;
                        --footer-border: #e2e8f0;
                    }

                    /* Dark Mode */
                    @media (prefers-color-scheme: dark) {
                        :root {
                            --primary: #3b82f6;
                            --accent: #22d3ee;
                            --gradient-1: linear-gradient(135deg, #3b82f6, #22d3ee);
                            --gradient-2: linear-gradient(135deg, #1e293b, #3b82f6);
                            --text-primary: #f1f5f9;
                            --text-secondary: #94a3b8;
                            --text-light: #64748b;
                            --bg-white: #0f172a;
                            --bg-light: #1e293b;
                            --bg-dark: #020617;
                            --border: #334155;
                            --card-bg: #1e293b;
                            --card-border: #334155;
                            --ia-bg: rgba(59, 130, 246, 0.12);
                            --footer-border: #334155;
                        }
                    }

                    @page { margin: 15mm 12mm; }
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: 'Segoe UI', -apple-system, Arial, sans-serif; 
                        color: var(--text-primary); 
                        background: var(--bg-white);
                        line-height: 1.6;
                        padding: 0;
                        transition: none;
                    }

                    /* Cover */
                    .cover {
                        background: var(--gradient-2);
                        color: white;
                        padding: 50px 36px;
                        text-align: center;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-height: 90vh;
                    }
                    .cover h1 { font-size: 38px; margin-bottom: 8px; }
                    .cover h1 span { color: var(--accent); }
                    .cover .tagline { font-size: 17px; opacity: 0.85; margin-bottom: 14px; }
                    .cover .pitch { font-size: 14px; opacity: 0.75; max-width: 600px; margin: 0 auto 24px; line-height: 1.7; font-style: italic; }
                    .cover .subtitle { font-size: 15px; opacity: 0.7; max-width: 550px; margin: 0 auto; line-height: 1.7; }
                    .cover .date { margin-top: 36px; font-size: 13px; opacity: 0.5; }

                    /* Sections */
                    .section { padding: 28px 32px; page-break-inside: avoid; }
                    
                    .section h2 { 
                        font-size: 22px; 
                        color: var(--primary); 
                        border-bottom: 3px solid var(--primary); 
                        padding-bottom: 6px; 
                        margin-bottom: 14px; 
                    }
                    
                    .section h3.cat-title {
                        font-size: 15px;
                        color: var(--text-primary);
                        margin: 18px 0 8px;
                        padding-left: 10px;
                        border-left: 3px solid var(--primary);
                        font-weight: 700;
                    }
                    
                    .section p { 
                        margin-bottom: 10px; 
                        color: var(--text-secondary); 
                        font-size: 12.5px; 
                    }

                    .section .intro-text {
                        font-size: 13px;
                        margin-bottom: 14px;
                        line-height: 1.7;
                    }

                    /* Services Grid */
                    .services-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 10px; 
                        margin-top: 10px; 
                    }
                    
                    .service-item { 
                        background: var(--card-bg); 
                        padding: 12px 14px; 
                        border-radius: 8px; 
                        border-left: 4px solid var(--primary); 
                        border: 1px solid var(--card-border);
                        border-left-width: 4px;
                    }
                    .service-item h3 { 
                        font-size: 12.5px; 
                        color: var(--text-primary); 
                        margin-bottom: 3px; 
                        font-weight: 700;
                    }
                    .service-item p { 
                        font-size: 11px; 
                        color: var(--text-secondary); 
                        margin: 0; 
                        line-height: 1.5;
                    }

                    /* IA Grid */
                    .ia-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 10px; 
                        margin-top: 10px; 
                    }
                    .ia-item { 
                        background: var(--ia-bg); 
                        padding: 12px; 
                        border-radius: 8px; 
                        border: 1px solid var(--card-border);
                    }
                    .ia-item h3 { 
                        font-size: 12px; 
                        color: var(--primary); 
                        margin-bottom: 3px; 
                        font-weight: 700;
                    }
                    .ia-item p { 
                        font-size: 10.5px; 
                        color: var(--text-secondary); 
                        margin: 0; 
                        line-height: 1.5;
                    }

                    /* Footer */
                    .footer-text { 
                        text-align: center; 
                        padding: 18px; 
                        font-size: 11px; 
                        color: var(--text-light); 
                        border-top: 1px solid var(--footer-border); 
                        margin-top: 24px; 
                    }

                    .quote-text {
                        margin-top: 20px;
                        font-style: italic;
                        color: var(--text-secondary);
                        font-size: 13px;
                        text-align: center;
                        padding: 16px 0;
                        border-top: 1px solid var(--footer-border);
                    }

                    /* Responsive for small screens */
                    @media (max-width: 600px) {
                        .cover { padding: 36px 24px; min-height: auto; }
                        .cover h1 { font-size: 28px; }
                        .cover .pitch { font-size: 12px; }
                        .cover .subtitle { font-size: 13px; }
                        .section { padding: 20px 18px; }
                        .section h2 { font-size: 18px; }
                        .services-grid { grid-template-columns: 1fr; }
                        .ia-grid { grid-template-columns: 1fr; }
                        .service-item h3 { font-size: 12px; }
                        .service-item p { font-size: 10.5px; }
                    }

                    @media (max-width: 400px) {
                        .cover { padding: 24px 16px; }
                        .cover h1 { font-size: 22px; }
                        .section { padding: 16px 12px; }
                        .section h2 { font-size: 16px; }
                        .section h3.cat-title { font-size: 13px; }
                        .service-item { padding: 10px; }
                        .ia-item { padding: 10px; }
                    }

                    /* Print-specific */
                    @media print {
                        body { background: white; }
                        .cover { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .service-item { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        .ia-item { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="cover">
                    <h1>Nexum <span>Solutions</span></h1>
                    <p class="tagline">Conectando la Estrategia con el Futuro Digital</p>
                    <p class="pitch">"En Nexum Solutions, entendemos que la TI actual no se trata solo de infraestructura, sino de conexiones: conectar la estrategia con la ejecución, los costos con el valor, y el potencial de la Inteligencia Artificial con la operatividad diaria. No somos solo proveedores; somos el puente hacia la agilidad tecnológica de su empresa."</p>
                    <p class="subtitle">Soluciones innovadoras de consultoría y servicios de TI, apoyando a nuestros clientes en el diseño, transformación y operación del área, incrementando sus capacidades y alineando los objetivos a la estrategia de negocio.</p>
                    <p class="date">Brochure Corporativo — ${currentYear}</p>
                </div>

                <div class="section">
                    <h2>Nuestros Servicios</h2>
                    <p class="intro-text">Agrupamos nuestros servicios bajo los desafíos que resolvemos para impulsar su transformación digital.</p>
                    
                    <h3 class="cat-title">I. Estrategia y Gobierno — La Fundación</h3>
                    <p style="font-size:11.5px;color:var(--text-secondary);margin-bottom:8px;">Aseguramos que la tecnología sea el motor del negocio, no un gasto operativo.</p>
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
                    <p style="font-size:11.5px;color:var(--text-secondary);margin-bottom:8px;">Maximizamos el rendimiento de sus activos mediante metodologías probadas.</p>
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
                            <p>Proyectos de eficiencia financiera y maximización de inversiones TI.</p>
                        </div>
                        <div class="service-item">
                            <h3>Operational Model & Transition</h3>
                            <p>Diseño y aceleración de capacidades competitivas. Gestión de transiciones sin disrupción.</p>
                        </div>
                    </div>

                    <h3 class="cat-title">III. Innovación y Capa Agéntica — La Evolución</h3>
                    <p style="font-size:11.5px;color:var(--text-secondary);margin-bottom:8px;">Construimos el mañana con soluciones inteligentes diseñadas para escalar.</p>
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
                            <h3>🛡️ Resiliencia y Continuidad</h3>
                            <p>Ejecución automática de protocolos BCP/DRP ante incidentes y coordinación de recuperación.</p>
                        </div>
                    </div>
                </div>

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
