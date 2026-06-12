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
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Nexum Solutions - Brochure Corporativo</title>
                <style>
                    @page { margin: 20mm 15mm; }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        color: #1e293b; 
                        line-height: 1.6;
                        padding: 0;
                    }
                    .cover {
                        background: linear-gradient(135deg, #0f172a, #1e3a5f);
                        color: white;
                        padding: 60px 40px;
                        text-align: center;
                        page-break-after: always;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-height: 90vh;
                    }
                    .cover h1 { font-size: 42px; margin-bottom: 10px; }
                    .cover h1 span { color: #06b6d4; }
                    .cover .tagline { font-size: 18px; opacity: 0.8; margin-bottom: 16px; }
                    .cover .pitch { font-size: 15px; opacity: 0.75; max-width: 650px; margin: 0 auto 30px; line-height: 1.8; font-style: italic; }
                    .cover .subtitle { font-size: 16px; opacity: 0.7; max-width: 600px; margin: 0 auto; line-height: 1.8; }
                    .cover .date { margin-top: 40px; font-size: 14px; opacity: 0.5; }
                    .section { padding: 30px 40px; page-break-inside: avoid; }
                    .section h2 { 
                        font-size: 24px; 
                        color: #2563eb; 
                        border-bottom: 3px solid #2563eb; 
                        padding-bottom: 8px; 
                        margin-bottom: 16px; 
                    }
                    .section h3.cat-title {
                        font-size: 16px;
                        color: #0f172a;
                        margin: 20px 0 10px;
                        padding-left: 12px;
                        border-left: 3px solid #2563eb;
                    }
                    .section p { margin-bottom: 12px; color: #475569; font-size: 13px; }
                    .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
                    .service-item { 
                        background: #f8f9fc; 
                        padding: 14px; 
                        border-radius: 8px; 
                        border-left: 4px solid #2563eb; 
                    }
                    .service-item h3 { font-size: 13px; color: #0f172a; margin-bottom: 4px; }
                    .service-item p { font-size: 11px; color: #64748b; margin: 0; }
                    .ia-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
                    .ia-item { background: #f0f4ff; padding: 12px; border-radius: 8px; }
                    .ia-item h3 { font-size: 12px; color: #2563eb; margin-bottom: 4px; }
                    .ia-item p { font-size: 11px; color: #64748b; margin: 0; }
                    .contact-info { margin-top: 16px; }
                    .contact-info p { margin-bottom: 6px; font-size: 14px; }
                    .footer-text { 
                        text-align: center; 
                        padding: 20px; 
                        font-size: 12px; 
                        color: #94a3b8; 
                        border-top: 1px solid #e2e8f0; 
                        margin-top: 30px; 
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
                    
                    <h3 class="cat-title">I. Estrategia y Gobierno — La Fundación</h3>
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
                            <p>Optimización del valor del ecosistema de proveedores.</p>
                        </div>
                        <div class="service-item">
                            <h3>GRC Avanzado</h3>
                            <p>Evaluación de riesgos, continuidad operativa (BIA/BCP/DRP) y resiliencia.</p>
                        </div>
                    </div>

                    <h3 class="cat-title">II. Eficiencia Operativa — El Motor</h3>
                    <div class="services-grid">
                        <div class="service-item">
                            <h3>Gestión ITSM & ITIL</h3>
                            <p>Estandarización y eficiencia en servicios TI basados en ITIL.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión de SLA/SLO</h3>
                            <p>Aseguramiento de niveles de servicio alineados a la realidad operativa.</p>
                        </div>
                        <div class="service-item">
                            <h3>Gestión y Análisis SAM</h3>
                            <p>Control, optimización y transparencia en activos de software.</p>
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
                            <p>Diseño y aceleración de capacidades competitivas.</p>
                        </div>
                    </div>

                    <h3 class="cat-title">III. Innovación y Capa Agéntica — La Evolución</h3>
                    <div class="services-grid">
                        <div class="service-item">
                            <h3>Desarrollo de Capa Agéntica</h3>
                            <p>Sistemas autónomos para automatización de procesos complejos.</p>
                        </div>
                        <div class="service-item">
                            <h3>IA Operacional Automatizada</h3>
                            <p>Software a medida para ejecución inteligente sin fricción.</p>
                        </div>
                        <div class="service-item">
                            <h3>Desarrollo de Productos & Web</h3>
                            <p>Soluciones digitales escalables centradas en UX.</p>
                        </div>
                        <div class="service-item">
                            <h3>Change Management</h3>
                            <p>Estrategias de adopción para evolucionar con la tecnología.</p>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Casos de Uso de IA Agéntica</h2>
                    <p>Nuestra mayor ventaja competitiva. Sistemas autónomos que aprenden, deciden y ejecutan.</p>
                    <div class="ia-grid">
                        <div class="ia-item">
                            <h3>🤖 Soporte TI Autónomo</h3>
                            <p>Agentes que diagnostican y resuelven incidencias en tiempo real (-70% respuesta).</p>
                        </div>
                        <div class="ia-item">
                            <h3>📋 Compliance y Auditoría</h3>
                            <p>Monitoreo continuo de cumplimiento normativo con reportes automatizados.</p>
                        </div>
                        <div class="ia-item">
                            <h3>📊 Optimización SAM</h3>
                            <p>Análisis de uso de software y optimización autónoma de licencias.</p>
                        </div>
                        <div class="ia-item">
                            <h3>🔗 Gestión VMO</h3>
                            <p>Evaluación y negociación autónoma con proveedores.</p>
                        </div>
                        <div class="ia-item">
                            <h3>⚙️ Automatización Operacional</h3>
                            <p>Orquestación de flujos de trabajo complejos sin intervención manual.</p>
                        </div>
                        <div class="ia-item">
                            <h3>🛡️ Resiliencia y Continuidad</h3>
                            <p>Ejecución automática de protocolos BCP/DRP ante incidentes.</p>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Contacto</h2>
                    <div class="contact-info">
                        <p><strong>Email:</strong> contacto@nexumsolutions.com</p>
                        <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                        <p><strong>Ubicación:</strong> Santiago, Chile</p>
                        <p><strong>Web:</strong> www.nexumsolutions.com</p>
                    </div>
                    <p style="margin-top: 20px; font-style: italic; color: #64748b;">
                        "Conectando la estrategia con el futuro digital."
                    </p>
                    <div class="footer-text">
                        <p>© ${currentYear} Nexum Solutions. Todos los derechos reservados.</p>
                        <p>Conectando la Estrategia con el Futuro Digital</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Open in new window for printing/PDF
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(brochureContent);
        printWindow.document.close();
        printWindow.focus();
        
        // Trigger print dialog after a short delay to let content render
        setTimeout(() => {
            printWindow.print();
        }, 500);
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
