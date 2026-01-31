// DOM полностью загружен
document.addEventListener('DOMContentLoaded', function() {
    console.log('Truffle Elixir - сайт загружен');
    
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 1000);
    }
    
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Video Management
    const video = document.getElementById('heroVideo');
    const videoLoading = document.getElementById('videoLoading');
    const videoPlayBtnContainer = document.getElementById('videoPlayBtnContainer');
    
    if (video) {
        // Video loading handler
        video.addEventListener('loadeddata', function() {
            console.log('Видео загружено');
            if (videoLoading) {
                videoLoading.style.display = 'none';
            }
        });
        
        video.addEventListener('canplay', function() {
            console.log('Видео готово к воспроизведению');
            try {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Автовоспроизведение заблокировано:', error);
                        showVideoPlayButton();
                    });
                }
            } catch (e) {
                console.log('Ошибка воспроизведения:', e);
            }
        });
        
        video.addEventListener('error', function() {
            console.error('Ошибка загрузки видео:', video.error);
            if (videoLoading) {
                videoLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка загрузки видео';
                videoLoading.style.color = '#ff6b6b';
            }
        });
        
        // Video controls
        const soundToggle = document.getElementById('soundToggle');
        const zoomToggle = document.getElementById('zoomToggle');
        const qualityToggle = document.getElementById('qualityToggle');
        
        // Sound toggle
        if (soundToggle) {
            soundToggle.addEventListener('click', function() {
                video.muted = !video.muted;
                const icon = this.querySelector('i');
                if (video.muted) {
                    icon.classList.remove('fa-volume-up');
                    icon.classList.add('fa-volume-mute');
                    this.title = 'Включить звук';
                } else {
                    icon.classList.remove('fa-volume-mute');
                    icon.classList.add('fa-volume-up');
                    this.title = 'Выключить звук';
                }
            });
        }
        
        // Zoom toggle
        if (zoomToggle) {
            let zoomLevel = 0;
            zoomToggle.addEventListener('click', function() {
                zoomLevel = (zoomLevel + 1) % 3;
                const icon = this.querySelector('i');
                
                video.style.transition = 'transform 0.5s ease';
                
                switch(zoomLevel) {
                    case 0:
                        video.style.transform = 'scale(1)';
                        icon.classList.remove('fa-search-minus', 'fa-compress-alt');
                        icon.classList.add('fa-expand-alt');
                        this.title = 'Увеличить';
                        break;
                    case 1:
                        video.style.transform = 'scale(1.2)';
                        icon.classList.remove('fa-expand-alt', 'fa-compress-alt');
                        icon.classList.add('fa-search-minus');
                        this.title = 'Уменьшить';
                        break;
                    case 2:
                        video.style.transform = 'scale(1.5)';
                        icon.classList.remove('fa-expand-alt', 'fa-search-minus');
                        icon.classList.add('fa-compress-alt');
                        this.title = 'Сбросить';
                        break;
                }
            });
        }
        
        // Quality toggle simulation
        if (qualityToggle) {
            qualityToggle.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-hd')) {
                    icon.classList.remove('fa-hd');
                    icon.classList.add('fa-sd-card');
                    this.title = 'Стандартное качество';
                    video.style.filter = 'brightness(0.9)';
                } else {
                    icon.classList.remove('fa-sd-card');
                    icon.classList.add('fa-hd');
                    this.title = 'Высокое качество';
                    video.style.filter = 'brightness(0.8)';
                }
            });
        }
        
        // Page visibility handling
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                video.pause();
            } else {
                if (!video.paused) return;
                video.play().catch(e => console.log('Не удалось возобновить видео:', e));
            }
        });
    }
    
    // Show video play button if autoplay is blocked
    function showVideoPlayButton() {
        if (!videoPlayBtnContainer) return;
        
        const playBtn = document.createElement('button');
        playBtn.className = 'btn btn-outline video-play-btn';
        playBtn.innerHTML = '<i class="fas fa-play"></i> Запустить видео';
        
        playBtn.addEventListener('click', function() {
            video.play()
                .then(() => {
                    playBtn.style.display = 'none';
                })
                .catch(error => {
                    console.error('Ошибка ручного запуска:', error);
                    playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка загрузки';
                    playBtn.disabled = true;
                });
        });
        
        videoPlayBtnContainer.appendChild(playBtn);
    }
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const totalPriceElement = document.getElementById('totalPrice');
    const pricePerUnit = 3200;
    const discountPrice = 3000;
    
    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const price = quantity >= 5 ? discountPrice : pricePerUnit;
        const total = price * quantity;
        totalPriceElement.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
                updateTotalPrice();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
                updateTotalPrice();
            }
        });
        
        quantityInput.addEventListener('input', updateTotalPrice);
        updateTotalPrice(); // Initial calculation
    }
    
    // Messenger selection
    document.querySelectorAll('.messenger-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.messenger-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            const radioInput = this.querySelector('input[type="radio"]');
            if (radioInput) radioInput.checked = true;
        });
    });
    
    // Order form submission
    const orderForm = document.getElementById('orderForm');
    const orderModal = document.getElementById('orderModal');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                quantity: document.getElementById('quantity').value,
                message: document.getElementById('message').value.trim(),
                messenger: document.querySelector('input[name="messenger"]:checked').value
            };
            
            // Validation
            if (!formData.name || !formData.phone || !formData.email) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(formData.phone)) {
                alert('Пожалуйста, введите корректный номер телефона');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            // Calculate price
            const quantity = parseInt(formData.quantity);
            const pricePerBottle = quantity >= 5 ? discountPrice : pricePerUnit;
            const totalPrice = pricePerBottle * quantity;
            
            // Create message for messenger
            const messageText = encodeURIComponent(
                `📋 НОВЫЙ ЗАКАЗ ТРЮФЕЛЬНОГО СОКА 📋\n\n` +
                `👤 Имя: ${formData.name}\n` +
                `📞 Телефон: ${formData.phone}\n` +
                `📧 Email: ${formData.email}\n` +
                `🍄 Продукт: Премиум трюфельный сок 10мл\n` +
                `📦 Количество: ${quantity} флаконов\n` +
                `💰 Сумма: ${totalPrice.toLocaleString('ru-RU')} ₽\n` +
                `💬 Пожелания: ${formData.message || 'нет'}\n\n` +
                `_Заказ отправлен с сайта Truffle Elixir_`
            );
            
            // Open messenger
            let messengerUrl = '';
            if (formData.messenger === 'whatsapp') {
                messengerUrl = `https://wa.me/79380112002?text=${messageText}`;
            } else {
                messengerUrl = `https://t.me/truffle_elixir?text=${messageText}`;
            }
            
            // Show order details in modal
            const orderDetails = document.getElementById('orderDetails');
            if (orderDetails) {
                orderDetails.innerHTML = `
                    <p><strong>${formData.name}</strong>, ваш заказ:</p>
                    <p>Премиум трюфельный сок - ${quantity} флаконов</p>
                    <p>Цена за флакон: ${quantity >= 5 ? '3 000' : '3 200'} ₽</p>
                    <p><strong>Итого: ${totalPrice.toLocaleString('ru-RU')} ₽</strong></p>
                    <p><small>Откроется окно ${formData.messenger === 'whatsapp' ? 'WhatsApp' : 'Telegram'}</small></p>
                `;
            }
            
            // Show modal
            if (orderModal) {
                orderModal.style.display = 'flex';
            }
            
            // Open messenger after short delay
            setTimeout(() => {
                window.open(messengerUrl, '_blank');
            }, 500);
        });
    }
    
    // Modal close handlers
    document.querySelectorAll('.close-modal, .btn-close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            if (orderModal) {
                orderModal.style.display = 'none';
                orderForm.reset();
                document.getElementById('quantity').value = 1;
                updateTotalPrice();
                
                // Reset messenger selection
                document.querySelectorAll('.messenger-option').forEach(opt => {
                    opt.classList.remove('selected');
                    const input = opt.querySelector('input[type="radio"]');
                    if (input && input.value === 'whatsapp') {
                        opt.classList.add('selected');
                        input.checked = true;
                    }
                });
            }
        });
    });
    
    // Close modal on outside click
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll animations
    function checkScrollAnimations() {
        const elements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0)';
            }
        });
    }
    
    // Initial check and on scroll
    checkScrollAnimations();
    window.addEventListener('scroll', checkScrollAnimations);
    
    // Form input validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                let formatted = '+7';
                if (value.length > 0) formatted += ' (' + value.substring(0, 3);
                if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
                if (value.length >= 7) formatted += '-' + value.substring(6, 8);
                if (value.length >= 9) formatted += '-' + value.substring(8, 10);
                e.target.value = formatted;
            }
        });
    }
    
    // Initialize all animations
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 1000);
});

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});