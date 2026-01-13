// ===== 헤더와 푸터 동적 로드 =====
async function loadHeaderFooter() {
    try {
        // 헤더 로드
        const headerResponse = await fetch('header.html');
        const headerContent = await headerResponse.text();
        document.getElementById('header-container').innerHTML = headerContent;
        setFavicon();
        
        // 푸터 로드
        const footerResponse = await fetch('footer.html');
        const footerContent = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerContent;
        
        // 헤더 로드 후 모바일 메뉴 초기화
        initializeMobileMenu();
        initializeHeaderScroll();
    } catch (error) {
        console.error('헤더/푸터 로드 실패:', error);
    }
}

// 페이지 로드 시 헤더와 푸터 로드
document.addEventListener('DOMContentLoaded', loadHeaderFooter);

// ===== 파비콘 설정 =====
function setFavicon() {
    const href = '../img/ngn_favicons/LabLogo_favicon.png';
    ['icon', 'shortcut icon', 'apple-touch-icon'].forEach(rel => {
        let link = document.querySelector(`link[rel="${rel}"]`);
        if (!link) {
            link = document.createElement('link');
            link.rel = rel;
            document.head.appendChild(link);
        }
        link.href = href;
        link.type = 'image/png';
    });
}

// ===== 모바일 메뉴 토글 =====
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 메뉴 아이템 클릭시 메뉴 닫기
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== 헤더 스크롤 효과 =====
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== Intersection Observer를 이용한 애니메이션 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// fade-in 클래스가 있는 모든 요소 관찰
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// ===== 통계 카운터 애니메이션 =====
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = parseInt(element.textContent);
        const duration = 1500;
        const increment = finalValue / (duration / 16);
        let currentValue = 0;

        const counterInterval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                element.textContent = finalValue + '+';
                clearInterval(counterInterval);
            } else {
                element.textContent = Math.floor(currentValue) + '+';
            }
        }, 16);
    });
}

// 페이지 로드 시 카운터 실행
window.addEventListener('load', () => {
    // 약간의 딜레이 후 카운터 시작
    setTimeout(animateCounters, 500);
});

// ===== 연락처 폼 처리 =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 검증
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }

            // 이메일 검증
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                }
            }
        });

        if (isValid) {
            // 폼 제출 시뮬레이션 (실제로는 서버로 전송)
            showAlert('메시지가 전송되었습니다!', 'success');
            contactForm.reset();
        } else {
            showAlert('모든 필드를 올바르게 작성해주세요.', 'error');
        }
    });
}

// ===== 알림 메시지 표시 =====
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert-popup');
    if (type === 'success') alertDiv.classList.add('success');
    if (type === 'error') alertDiv.classList.add('error');
    
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    // 3초 후 제거
    setTimeout(() => {
        alertDiv.classList.add('closing');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ===== 필터 기능 (논문, 뉴스) =====
const filterButtons = document.querySelectorAll('.filter-btn');
const filterableItems = document.querySelectorAll('[data-type], [data-category]');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // 활성 버튼 변경
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.dataset.filter;

        // 필터링
        filterableItems.forEach(item => {
            const itemType = item.dataset.type;
            const itemCategory = item.dataset.category;
            const itemFilter = itemType || itemCategory;

            if (filterValue === 'all' || itemFilter === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ===== 부드러운 스크롤 링크 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

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

// ===== 히어로 배경 슬라이더 =====
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    let currentIndex = 0;
    slides[currentIndex].classList.add('active');

    setInterval(() => {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initializeHeroSlider);

// ===== Member photo hover swap =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.member-photo[data-hover]').forEach(img => {
        const original = img.getAttribute('src');
        const hoverSrc = img.dataset.hover;

        img.addEventListener('mouseenter', () => {
            if (hoverSrc) img.src = hoverSrc;
        });
        img.addEventListener('mouseleave', () => {
            img.src = original;
        });
    });
});

// ===== News Board Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.board-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const targetId = row.getAttribute('data-target');
            const detail = document.getElementById(targetId);
            if (!detail) return;
            const isOpen = detail.classList.contains('open');
            document.querySelectorAll('.board-detail.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) detail.classList.add('open');
        });
    });
});

// ===== 페이지 로드 완료 표시 =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});