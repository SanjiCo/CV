// İsmail Çakıl - Otomasyon Ajansı JS (2026 Edition)
class AutomationAgency {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupAnimations();
        this.setupCounters();
        this.setupN8nForm();
        this.setupScrollEffects();
        console.log("🚀 Automation Agency Engine Started");
    }

    // --- n8n Webhook & Lead Capture (Güncellenmiş & Güvenli Versiyon) ---
    setupN8nForm() {
        const contactForm = document.getElementById('n8n-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerHTML;
            
            // 1. ADIM: Formu ve Butonu Kilitle (Mükerrer gönderimi önler)
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'not-allowed';
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Lütfen Bekleyiniz...';
            
            // Kullanıcıya bilgi popup'ı göster
            this.showNotification('Talebiniz iletiliyor, lütfen sayfayı kapatmayın.', 'info');

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // n8n Webhook Adresi
                const response = await fetch('https://n8n.ismailcakil.com/webhook/landing-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        source: 'ismailcakil.com_landing',
                        timestamp: new Date().toISOString(),
                        browser: navigator.userAgent
                    })
                });

                if (response.ok) {
                    // 2. ADIM: Başarı Durumu
                    this.showNotification('Randevunuz başarıyla iletilmiştir!', 'success');
                    contactForm.reset(); // Formu temizle
                } else {
                    throw new Error('Bağlantı Sorunu');
                }
            } catch (error) {
                // 3. ADIM: Hata Durumu
                console.error('Gönderim Hatası:', error);
                this.showNotification('Bir sorun oluştu. Lütfen tekrar deneyin veya e-posta gönderin.', 'error');
                btn.disabled = false; // Hata varsa butonu tekrar aç
            } finally {
                // İşlem tamamlansa da hata olsa da butonu eski haline getir (2 sn sonra)
                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }, 2000);
            }
        });
    }

    // --- Modern Bildirim Sistemi ---
    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notif-box');
        if (existing) existing.remove();

        const notif = document.createElement('div');
        notif.className = `notif-box notif-${type}`;
        
        // Renk Belirleme
        const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ff4757' : '#3b82f6');
        const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle');

        notif.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
        `;

        notif.style.cssText = `
            position: fixed; top: 30px; right: 30px; z-index: 9999;
            background: ${bgColor};
            color: white; padding: 1.2rem 2rem; border-radius: 15px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3); font-weight: 600;
            transform: translateX(150%); transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-family: sans-serif;
        `;

        document.body.appendChild(notif);
        setTimeout(() => notif.style.transform = 'translateX(0)', 100);
        
        // 5 saniye sonra kaldır
        setTimeout(() => {
            notif.style.transform = 'translateX(150%)';
            setTimeout(() => notif.remove(), 500);
        }, 5000);
    }

    // --- Tema Yönetimi ---
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            this.setTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#theme-toggle i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // --- Animasyonlar & Akış ---
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.service-card, .skill-category').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = '0.6s ease-out';
            observer.observe(el);
        });
    }

    // --- Sayaç Animasyonu ---
    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const update = () => {
                const count = +counter.innerText;
                const speed = target / 100;
                if (count < target) {
                    counter.innerText = Math.ceil(count + speed);
                    setTimeout(update, 20);
                } else {
                    counter.innerText = target;
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    update();
                    observer.unobserve(counter);
                }
            });
            observer.observe(counter);
        });
    }

    // --- Navigasyon & Scroll ---
    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollEffects() {
        const nav = document.querySelector('.floating-nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 10, 11, 0.95)';
                nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            } else {
                nav.style.background = 'rgba(10, 10, 11, 0.8)';
                nav.style.boxShadow = 'none';
            }
        });
    }
}

// Uygulamayı Başlat
document.addEventListener('DOMContentLoaded', () => {
    new AutomationAgency();
});
