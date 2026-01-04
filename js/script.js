/**
 * 导航菜单切换功能
 * 功能：移动端汉堡菜单按钮的点击切换和动画效果
 */
function toggleNavMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navContainer = document.querySelector('.nav-container');
    
    if (!menuBtn || !navContainer) return;
    
    menuBtn.addEventListener('click', function() {
        navContainer.classList.toggle('active');
        
        const spans = this.querySelectorAll('span');
        spans[0].style.transform = navContainer.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navContainer.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navContainer.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });
}

/**
 * 关闭菜单功能
 * 功能：用户点击导航链接后自动关闭移动端菜单
 */
function closeNavMenuOnLinkClick() {
    const navContainer = document.querySelector('.nav-container');
    const menuBtn = document.getElementById('menuBtn');
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            navContainer.classList.remove('active');
            
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * 下载按钮提示功能
 * 功能：处理产品参数手册下载按钮的点击事件
 */
function handleDownloadBtnClick() {
    const downloadBtn = document.querySelector('.param-download-btn');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function() {
        alert('参数手册下载中，请稍候...');
    });
}

/**
 * 轮播图功能
 * 功能：图片预加载、自动轮播、手动控制、响应式适配
 */
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.banner-control.prev');
    const nextBtn = document.querySelector('.banner-control.next');
    
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    function preloadImages() {
        slides.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            if (bgImage) {
                const imageUrl = bgImage.match(/url\(['"]?([^'"]*)['"]?\)/);
                if (imageUrl && imageUrl[1]) {
                    const img = new Image();
                    img.src = imageUrl[1];
                }
            }
        });
    }

    preloadImages();

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (slides[index]) slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(prevIndex);
    }

    function startInterval() {
        const intervalTime = window.innerWidth <= 768 ? 4000 : 6000;
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index !== currentSlide) {
                goToSlide(index);
                resetInterval();
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
    }

    const banner = document.querySelector('.banner');
    if (banner) {
        banner.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        banner.addEventListener('mouseleave', () => {
            startInterval();
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startInterval();
        }
    });

    startInterval();
}

/**
 * 导航栏滚动显示效果
 * 功能：第一屏隐藏导航栏，滚动时显示导航栏
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let isHeaderVisible = false;

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const handleScroll = debounce(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100 && !isHeaderVisible) {
            header.classList.add('header-visible');
            isHeaderVisible = true;
        }
        else if (currentScrollY <= 100 && isHeaderVisible) {
            header.classList.remove('header-visible');
            isHeaderVisible = false;
        }
        
        lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll);
}

/**
 * 网站初始化函数
 * 功能：统一管理所有功能模块
 */
function init() {
    toggleNavMenu();
    closeNavMenuOnLinkClick();
    handleDownloadBtnClick();
    initBannerSlider();
    initHeaderScrollEffect();
    initTrafficAnalytics();
}

/**
 * 流量分析功能
 * 功能：动态更新统计数据，提供实时访问信息展示
 */
function initTrafficAnalytics() {
    const trafficData = {
        todayVisitors: 2847,
        totalVisitors: 125630,
        onlineUsers: 142,
        trendPercentage: 15.2,
        chartData: [60, 80, 45, 90, 70, 85, 100],
        sources: [
            { name: '直接访问', percentage: 45.2 },
            { name: '搜索引擎', percentage: 32.8 },
            { name: '社交媒体', percentage: 12.5 },
            { name: '其他来源', percentage: 9.5 }
        ]
    };

    animateNumbers(trafficData);
    
    setInterval(() => {
        updateOnlineUsers();
    }, 30000);
}

/**
 * 数字动画效果
 * 功能：为统计数据添加数字滚动动画效果
 */
function animateNumbers(data) {
    const todayElement = document.getElementById('today-visitors');
    const totalElement = document.getElementById('total-visitors');
    const onlineElement = document.getElementById('online-users');
    const trendElement = document.getElementById('trend-percentage');

    if (todayElement) {
        animateNumber(todayElement, 0, data.todayVisitors, 2000);
    }

    if (totalElement) {
        animateNumber(totalElement, 0, data.totalVisitors, 2500);
    }

    if (onlineElement) {
        animateNumber(onlineElement, 0, data.onlineUsers, 1500);
    }

    if (trendElement) {
        animateNumber(trendElement, 0, data.trendPercentage, 1800, true);
    }
}

/**
 * 单个数字动画
 * 功能：实现数字的平滑滚动动画
 */
function animateNumber(element, start, end, duration, isPercentage = false) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(start + (end - start) * easedProgress);
        
        if (isPercentage) {
            element.textContent = '+' + current.toFixed(1) + '%';
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            if (isPercentage) {
                element.textContent = '+' + end.toFixed(1) + '%';
            } else {
                element.textContent = end.toLocaleString();
            }
        }
    }

    requestAnimationFrame(updateNumber);
}

/**
 * 缓动函数
 * 功能：使用四阶贝塞尔缓动函数
 */
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}



/**
 * 更新在线用户数
 * 功能：模拟实时更新在线用户数据
 */
function updateOnlineUsers() {
    const onlineElement = document.getElementById('online-users');
    
    if (onlineElement) {
        const randomUsers = Math.floor(Math.random() * 21) + 135;
        
        animateNumber(onlineElement, 
            parseInt(onlineElement.textContent.replace(/,/g, '')), 
            randomUsers, 
            1000);
    }
}

// 页面加载完成后执行初始化
window.addEventListener('DOMContentLoaded', init);