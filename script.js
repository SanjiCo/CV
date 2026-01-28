// Modern CV JavaScript - n8n & Otomasyon Entegreli
class ModernCV {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupAnimations();
        this.setupSkillBars();
        this.setupCounters();
        this.setupPDFDownload();
        this.setupScrollEffects();
        this.setupN8nForm(); // YENİ: n8n bağlantısı eklendi
    }

    // YENİ: n8n Webhook Bağlantısı
    setupN8nForm() {
        const contactForm = document.getElementById('n8n-contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerHTML;
            
            // Yükleniyor durumu
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            btn.disabled = true;

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // n8n Tünel Adresinize POST isteği gönderir
                const response = await fetch('https://n8n.ismailcakil.com/webhook/landing-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        source: 'ismailcakil.com',
                        timestamp: new Date().toISOString()
                    })
                });

                if (response.ok) {
                    this.showNotification('Mesajınız başarıyla iletildi!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Bağlantı hatası');
                }
            } catch (error) {
                console.error('Webhook Hatası:', error);
                this.showNotification('Tünel bağlantısı kurulamadı. Lütfen direkt e-posta gönderin.', 'error');
            } finally {
                btn.innerHTML = originalBtnText;
                btn.disabled = false;
            }
        });
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Diğer mevcut fonksiyonlar (Navigation, Animations, Counters, PDF vb.) aynen devam eder...
    // [PDF oluşturma ve diğer fonksiyonların kodları burada saklı kalmalıdır]

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 100;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    setupAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, observerOptions);
        document.querySelectorAll('.timeline-card, .skill-category, .info-card, .contact-item, .cert-item').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    this.animateCounter(counter, 0, target, 2000);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(updateCounter);
            else element.textContent = end;
        };
        requestAnimationFrame(updateCounter);
    }

    setupPDFDownload() {
        const downloadBtn = document.getElementById('download-cv');
        if (!downloadBtn) return;
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.showNotification('PDF oluşturma özelliği aktif ediliyor...', 'info');
            // jspdf fonksiyonunu burada çağırabilirsiniz
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    setupScrollEffects() {
        let lastScrollTop = 0;
        const nav = document.querySelector('.floating-nav');
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (nav) {
                if (scrollTop > lastScrollTop && scrollTop > 100) nav.style.transform = 'translateX(-50%) translateY(-100px)';
                else nav.style.transform = 'translateX(-50%) translateY(0)';
            }
            lastScrollTop = scrollTop;
        });
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetProgress = progressBar.getAttribute('data-progress');
                    setTimeout(() => { progressBar.style.width = `${targetProgress}%`; }, 200);
                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        skillBars.forEach(bar => skillObserver.observe(bar));
    }
}

document.addEventListener('DOMContentLoaded', () => { new ModernCV(); });
