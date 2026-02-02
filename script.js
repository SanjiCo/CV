/**
 * İsmail Çakıl - Profesyonel CV & Altyapı Motoru (2026)
 * Tasarım: ATS Uyumluluğu %100 ve Profesyonel İş Akışı
 */

class ProfessionalCV {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupN8nForm();
        this.setupScrollEffects();
        this.setupProfessionalAnimations();
        console.log("💼 İsmail Çakıl - Professional Engine Active");
    }

    // --- Kariyer Odaklı Form Yönetimi (FormSubmit.co - Ücretsiz Altyapı) ---
    setupN8nForm() {
        const contactForm = document.getElementById('n8n-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.innerHTML;
            
            // Buton ve Form Kilitleme
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İletiliyor...';
            
            const formData = new FormData(contactForm);
            
            // FormSubmit.co Ayarları
            // Spam koruması için captcha'yı kapatabilir veya açık bırakabiliriz. 
            // _template: table (varsayılan) mailde düzgün tablo olarak görünmesini sağlar.
            formData.append("_captcha", "false"); 
            formData.append("_template", "table");
            formData.append("_subject", "Yeni IT Servis Talebi - ismailcakil.com");

            try {
                // FormSubmit.co AJAX Endpoint
                // İlk gönderimde e-postanıza "Activate" butonu gelecek. Tıklayınca aktif olur.
                const response = await fetch('https://formsubmit.co/ajax/admin@ismailcakil.com', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success === "true") {
                    this.showStatus('Talebiniz başarıyla alındı. En kısa sürede dönüş yapılacaktır.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Form servisi yanıt vermedi.');
                }
            } catch (error) {
                console.error(error);
                this.showStatus('Bir hata oluştu. Lütfen doğrudan admin@ismailcakil.com adresine yazınız.', 'error');
            } finally {
                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                }, 2000);
            }
        });
    }

    // --- Profesyonel Durum Bildirimleri ---
    showStatus(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-msg msg-${type}`;
        statusDiv.innerText = message;
        
        // Stil: ATS sitelerinde dikkat dağıtmayan ama net bilgi veren yapı
        statusDiv.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 1000;
            padding: 15px 25px; border-radius: 8px; color: #white;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: Arial, sans-serif;
        `;

        document.body.appendChild(statusDiv);
        setTimeout(() => statusDiv.remove(), 4000);
    }

    // --- Deneyim Bölümü İçin Akıcı Navigasyon ---
    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --- Header & Navigasyon Efektleri ---
    setupScrollEffects() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.borderBottom = '1px solid #ddd';
            } else {
                header.style.borderBottom = 'none';
            }
        });
    }

    // --- Profesyonel Animasyonlar ---
    // Not: ATS uyumu için sadece içerik görünürlüğünü destekleyen hafif geçişler
    setupProfessionalAnimations() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transition = 'opacity 0.8s ease-in';
                }
            });
        }, { threshold: 0.05 });

        sections.forEach(section => {
            section.style.opacity = '0.3'; // Tamamen kaybolma değil, odaklanma efekti
            observer.observe(section);
        });
    }
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalCV();
});
