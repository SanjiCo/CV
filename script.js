// Modern CV JavaScript
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
    }

    // Theme Toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Set initial theme
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
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');

        // Smooth scrolling for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Active section highlighting
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        });
    }

    // Animations
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.timeline-card, .skill-category, .info-card, .contact-item, .cert-item'
        );

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // Add staggered animation delay
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Skill Bars Animation
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetProgress = progressBar.getAttribute('data-progress');

                    setTimeout(() => {
                        progressBar.style.width = `${targetProgress}%`;
                    }, 200);

                    skillObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // Counter Animation
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

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // PDF Download
    setupPDFDownload() {
        const downloadBtn = document.getElementById('download-cv');

        downloadBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Check if required libraries are loaded
            if (typeof jspdf === 'undefined') {
                alert('PDF kütüphanesi yükleniyor, lütfen birkaç saniye bekleyip tekrar deneyin.');
                return;
            }

            // Show loading state
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hazırlanıyor...';
            downloadBtn.style.pointerEvents = 'none';

            try {
                this.generateStandardCV();
                this.showNotification('CV başarıyla indirildi!', 'success');
            } catch (error) {
                console.error('PDF generation failed:', error);
                this.showNotification('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
            } finally {
                // Restore button
                downloadBtn.innerHTML = originalText;
                downloadBtn.style.pointerEvents = 'auto';
            }
        });
    }

    // Generate Standard CV Format (LinkedIn Style)
    generateStandardCV() {
        const { jsPDF } = jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Add UTF-8 support for Turkish characters
        pdf.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff2', 'Roboto', 'normal');
        pdf.setFont('helvetica'); // Fallback to helvetica which supports Turkish characters better

        // Page setup
        const pageWidth = 210;
        const pageHeight = 297;
        const leftColumnWidth = 60;
        const rightColumnWidth = 130;
        const leftMargin = 15;
        const rightMargin = leftMargin + leftColumnWidth + 10;
        const topMargin = 20;
        let leftY = topMargin;
        let rightY = topMargin;

        // Colors
        const darkBlue = [52, 73, 94];
        const lightGray = [149, 165, 166];
        const white = [255, 255, 255];
        const black = [0, 0, 0];

        // Helper function to add text with Turkish character support
        const addText = (text, x, y, options = {}) => {
            const {
                fontSize = 10,
                fontStyle = 'normal',
                color = black,
                maxWidth = rightColumnWidth - 10,
                align = 'left'
            } = options;

            pdf.setFontSize(fontSize);
            pdf.setFont('helvetica', fontStyle);
            pdf.setTextColor(...color);

            // Convert Turkish characters to compatible format
            const turkishChars = {
                'ğ': 'g', 'Ğ': 'G',
                'ü': 'u', 'Ü': 'U',
                'ş': 's', 'Ş': 'S',
                'ı': 'i', 'I': 'I',
                'ö': 'o', 'Ö': 'O',
                'ç': 'c', 'Ç': 'C'
            };

            // Function to convert text
            const convertText = (inputText) => {
                if (!inputText) return '';
                return inputText.toString().replace(/[ğĞüÜşŞıİöÖçÇ]/g, match => turkishChars[match] || match);
            };

            if (Array.isArray(text)) {
                text.forEach((line, index) => {
                    const convertedLine = convertText(line);
                    pdf.text(convertedLine, x, y + (index * 5));
                });
                return y + (text.length * 5);
            } else {
                const convertedText = convertText(text);
                const lines = pdf.splitTextToSize(convertedText, maxWidth);
                lines.forEach((line, index) => {
                    pdf.text(line, x, y + (index * 5), { align });
                });
                return y + (lines.length * 5);
            }
        };

        // Left column background (dark)
        pdf.setFillColor(...darkBlue);
        pdf.rect(0, 0, leftColumnWidth + leftMargin, pageHeight, 'F');

        // Profile section (left column)
        leftY += 20;

        // Name
        addText('İsmail Çakıl', leftMargin, leftY, {
            fontSize: 16,
            fontStyle: 'bold',
            color: white,
            maxWidth: leftColumnWidth
        });
        leftY += 15;

        // Title
        addText('Data Center Technician | IT Operations', leftMargin, leftY, {
            fontSize: 10,
            color: white,
            maxWidth: leftColumnWidth
        });
        leftY += 15;

        // Contact section
        addText('Iletisim Bilgileri', leftMargin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: white
        });
        leftY += 10;

        const contactInfo = [
            'i.ckl53@outlook.com',
            '',
            'www.linkedin.com/in/ismailcakil',
            '(LinkedIn)'
        ];

        contactInfo.forEach(info => {
            leftY = addText(info, leftMargin, leftY, {
                fontSize: 9,
                color: white,
                maxWidth: leftColumnWidth - 5
            });
            leftY += 2;
        });
        leftY += 10;

        // Top Skills section
        addText('En Onemli Yetenekler', leftMargin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: white
        });
        leftY += 10;

        const topSkills = [
            'Communication',
            'Statistics',
            'Sales and Marketing'
        ];

        topSkills.forEach(skill => {
            leftY = addText(skill, leftMargin, leftY, {
                fontSize: 9,
                color: white,
                maxWidth: leftColumnWidth - 5
            });
            leftY += 3;
        });
        leftY += 10;

        // Languages section
        addText('Languages', leftMargin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: white
        });
        leftY += 10;

        const languages = [
            'Ingilizce (Limited Working)',
            'Turkce (Native or Bilingual)'
        ];

        languages.forEach(lang => {
            leftY = addText(lang, leftMargin, leftY, {
                fontSize: 9,
                color: white,
                maxWidth: leftColumnWidth - 5
            });
            leftY += 3;
        });
        leftY += 10;

        // Certifications section
        addText('Certifications', leftMargin, leftY, {
            fontSize: 12,
            fontStyle: 'bold',
            color: white
        });
        leftY += 10;

        const certifications = [
            'Halkla Iliskiler ve Iletisim',
            'C# Egitimi',
            'Icerik Editorlugu'
        ];

        certifications.forEach(cert => {
            leftY = addText(cert, leftMargin, leftY, {
                fontSize: 9,
                color: white,
                maxWidth: leftColumnWidth - 5
            });
            leftY += 3;
        });

        // Right column content
        rightY += 10;

        // Name and title (right column)
        addText('İsmail Çakıl', rightMargin, rightY, {
            fontSize: 20,
            fontStyle: 'bold',
            color: darkBlue
        });
        rightY += 12;

        addText('Data Center Technician | IT Operations', rightMargin, rightY, {
            fontSize: 12,
            color: lightGray
        });
        rightY += 8;

        addText('Bursa, Turkiye', rightMargin, rightY, {
            fontSize: 10,
            color: lightGray
        });
        rightY += 15;

        // Summary section
        addText('Ozet', rightMargin, rightY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: darkBlue
        });
        rightY += 10;

        const summary = `Su anda veri merkezinde Data Center Technician olarak gorev yapiyorum. Calismalarim; sistem kurulumu, donanim bakimi, kablolama, ag baglantilari ve altyapi operasyonlari gibi temel surecleri kapsiyor. Gunluk is rutinim, IT altyapisinin surekliligin saglamak ve ortaya cikan sorunlara hizli cozumler uretmek uzerine kurulu.

Onceki deneyimlerim sayesinde hem donanim hem de yazilim tarafinda pratik bilgi kazandim. Sistem kurulumu, network yonetimi, donanim entegrasyonu ve guvenlik altyapilarinda aktif rol aldim. Farkli sektorlerde edindigim bu deneyimler, teknolojiyi sahada uygulamali olarak ogrenmeme ve altyapi sureclerine genis bir perspektiften bakmama yardimci oldu.

Bugun odaklandigim nokta, IT altyapisi, network yonetimi ve sistem yonetimi. Kendimi surekli gelistirmeye, yeni teknolojileri ogrenmeye ve bulundugum kurumun altyapi sureclerini daha guvenli ve verimli hale getirmeye onem veriyorum.`;

        rightY = addText(summary, rightMargin, rightY, {
            fontSize: 9,
            maxWidth: rightColumnWidth - 10
        });
        rightY += 15;

        // Experience section
        addText('Deneyim', rightMargin, rightY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: darkBlue
        });
        rightY += 10;

        // Current job
        addText('Netweb Datacenter', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('Technical Support Specialist', rightMargin, rightY, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        rightY += 6;

        addText('Eylül 2025 - Present (2 ay)', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 5;

        addText('Bursa, Türkiye', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 10;

        // Previous job 1
        addText('Turkcell Superonline', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('Technical Specialist', rightMargin, rightY, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        rightY += 6;

        addText('Haziran 2025 - Ağustos 2025 (3 ay)', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 5;

        addText('Bursa, Türkiye', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 10;

        // Previous job 2
        addText('Lider OTEL', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('13 yıl 6 ay', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 10;

        // Job 1 in hotel
        addText('Resepsiyon Müdürü', rightMargin, rightY, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        rightY += 6;

        addText('Temmuz 2020 - Şubat 2025 (4 yıl 8 ay)', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 5;

        addText('İstanbul, Türkiye', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 10;

        // Job 2 in hotel
        addText('Front Desk Receptionist', rightMargin, rightY, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        rightY += 6;

        addText('Eylül 2011 - Aralık 2023 (12 yıl 4 ay)', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 5;

        addText('Bayrampaşa, İstanbul, Türkiye', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 10;

        // Previous job 3
        addText('Kurtek Bilgisayar', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('Bilgisayar Teknisyeni', rightMargin, rightY, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        rightY += 6;

        addText('Aralık 2009 - Aralık 2010 (1 yıl 1 ay)', rightMargin, rightY, {
            fontSize: 9,
            color: lightGray
        });
        rightY += 15;

        // Check if we need a new page
        if (rightY > pageHeight - 60) {
            pdf.addPage();

            // Continue left column background on new page
            pdf.setFillColor(...darkBlue);
            pdf.rect(0, 0, leftColumnWidth + leftMargin, pageHeight, 'F');

            rightY = topMargin;
        }

        // Education section
        addText('Eğitim', rightMargin, rightY, {
            fontSize: 14,
            fontStyle: 'bold',
            color: darkBlue
        });
        rightY += 10;

        // Education 1
        addText('Anadolu Üniversitesi', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('Lisans Derecesi, Yönetim Bilgi Sistemleri, Genel · (Eylül 2023 - Ağustos 2025)', rightMargin, rightY, {
            fontSize: 9,
            maxWidth: rightColumnWidth - 10
        });
        rightY += 10;

        // Education 2
        addText('Anadolu Üniversitesi', rightMargin, rightY, {
            fontSize: 12,
            fontStyle: 'bold'
        });
        rightY += 7;

        addText('Ön lisans, Turizm ve Seyahat Hizmetleri Yönetimi · (2017 - 2022)', rightMargin, rightY, {
            fontSize: 9,
            maxWidth: rightColumnWidth - 10
        });

        // Save PDF
        pdf.save('ismail-cakil-cv.pdf');
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            font-family: var(--font-primary);
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    async waitForAnimations() {
        return new Promise(resolve => {
            // Wait for potential animations to complete
            setTimeout(resolve, 1000);
        });
    }

    // Scroll Effects
    setupScrollEffects() {
        let lastScrollTop = 0;
        const nav = document.querySelector('.floating-nav');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Hide/show navigation on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.style.transform = 'translateX(-50%) translateY(-100px)';
                nav.style.opacity = '0.8';
            } else {
                nav.style.transform = 'translateX(-50%) translateY(0)';
                nav.style.opacity = '1';
            }

            lastScrollTop = scrollTop;

            // Parallax effect for hero background
            const hero = document.querySelector('.hero-section');
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernCV();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations if needed
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    } else {
        // Pause animations when page is hidden
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
    }
});

// Service Worker Registration (if needed for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
            if (entry.entryType === 'layout-shift') {
                if (!entry.hadRecentInput) {
                    console.log('CLS:', entry.value);
                }
            }
        }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernCV;
}