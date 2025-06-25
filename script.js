// Utility Functions
const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  const throttle = (func, limit) => {
    let inThrottle
    return function () {
      const args = arguments
      
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }
  
  // Mobile Menu Functions
  function toggleMobileMenu() {
    const mobileNav = document.getElementById("mobileNav")
    const menuBtn = document.querySelector(".mobile-menu-btn")
    const body = document.body
  
    mobileNav.classList.toggle("active")
    menuBtn.classList.toggle("active")
  
    if (mobileNav.classList.contains("active")) {
      body.style.overflow = "hidden"
    } else {
      body.style.overflow = ""
    }
  }
  
  function closeMobileMenu() {
    const mobileNav = document.getElementById("mobileNav")
    const menuBtn = document.querySelector(".mobile-menu-btn")
    const body = document.body
  
    mobileNav.classList.remove("active")
    menuBtn.classList.remove("active")
    body.style.overflow = ""
  }
  
  // Smooth Scrolling with Offset
  function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target)
    if (element) {
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }
  
  // Enhanced Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = this.getAttribute("href")
      smoothScrollTo(target)
      closeMobileMenu()
    })
  })
  
  // Header Scroll Effect
  const handleHeaderScroll = throttle(() => {
    const header = document.getElementById("header")
    const scrollY = window.scrollY
  
    if (scrollY > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  }, 10)
  
  // Back to Top Button
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  
  const handleBackToTopVisibility = throttle(() => {
    const backToTopBtn = document.getElementById("backToTop")
    const scrollY = window.scrollY
  
    if (scrollY > 500) {
      backToTopBtn.classList.add("visible")
    } else {
      backToTopBtn.classList.remove("visible")
    }
  }, 10)
  
  // Form Submission with Enhanced Validation
  function submitForm(event) {
    event.preventDefault()
  
    const form = event.target
    const formData = new FormData(form)
    const name = formData.get("name").trim()
    const email = formData.get("email").trim()
    const phone = formData.get("phone").trim()
    const message = formData.get("message").trim()
  
    // Enhanced Validation
    const errors = []
  
    if (!name || name.length < 2) {
      errors.push("يرجى إدخال اسم صحيح (حرفين على الأقل)")
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      errors.push("يرجى إدخال بريد إلكتروني صحيح")
    }
  
    if (phone && phone.length > 0) {
      const phoneRegex = /^[+]?\d{8,}$/
      if (!phoneRegex.test(phone)) {
        errors.push("يرجى إدخال رقم هاتف صحيح")
      }
    }
  
    if (!message || message.length < 10) {
      errors.push("يرجى إدخال رسالة تحتوي على 10 أحرف على الأقل")
    }
  
    if (errors.length > 0) {
      showNotification(errors.join("\n"), "error")
      return
    }
  
    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalContent = submitBtn.innerHTML
  
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>'
    submitBtn.disabled = true
  
    // Add loading class to form
    form.classList.add("loading")
  
    // إرسال عبر emailjs
    emailjs.send('service_xxx', 'template_xxx', {
      from_name: name,
      from_email: email,
      phone: phone,
      message: message,
      to_email: 'sso.oran2007@gmail.com'
    })
    .then(function(response) {
      showNotification("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.", "success")
      form.reset()
      submitBtn.innerHTML = originalContent
      submitBtn.disabled = false
      form.classList.remove("loading")
    }, function(error) {
      showNotification("حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.", "error")
      submitBtn.innerHTML = originalContent
      submitBtn.disabled = false
      form.classList.remove("loading")
    });
  }
  
  // Notification System
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())
  
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
  
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === "success" ? "#48bb78" : type === "error" ? "#f56565" : "#4299e1"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 400px;
      animation: slideInRight 0.3s ease-out;
      font-family: 'Cairo', sans-serif;
    `
  
    notification.querySelector(".notification-content").style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `
  
    notification.querySelector(".notification-close").style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.25rem;
      margin-right: -0.5rem;
    `
  
    document.body.appendChild(notification)
  
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "slideOutRight 0.3s ease-out"
        setTimeout(() => notification.remove(), 300)
      }
    }, 5000)
  }
  
  // Add notification animations to CSS
  const notificationStyles = document.createElement("style")
  notificationStyles.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(notificationStyles)
  
  // Simple AOS (Animate On Scroll) Implementation
  function initAOS() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate")
        }
      })
    }, observerOptions)
  
    // Observe all elements with data-aos attribute
    document.querySelectorAll("[data-aos]").forEach((element) => {
      observer.observe(element)
    })
  }
  
  // Active Navigation Link Highlighting
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link, .nav-link-mobile")
  
    let currentSection = ""
    const scrollY = window.scrollY + 100
  
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
  
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id")
      }
    })
  
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }
  
  // Add active link styles
  const activeNavStyles = document.createElement("style")
  activeNavStyles.textContent = `
    .nav-link.active {
      color: #3182ce !important;
    }
    
    .nav-link.active::after {
      width: 100% !important;
    }
    
    .nav-link-mobile.active {
      background: rgba(49, 130, 206, 0.1) !important;
      border-right-color: #3182ce !important;
      color: #3182ce !important;
    }
  `
  document.head.appendChild(activeNavStyles)
  
  // Social Media Link Handlers
  function openSocialLink(platform, handle = "") {
    const urls = {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      instagram: "https://instagram.com/",
      youtube: "https://youtube.com/",
      whatsapp: "https://wa.me/213123456789",
    }
  
    if (urls[platform]) {
      window.open(urls[platform] + handle, "_blank", "noopener,noreferrer")
    }
  }
  
  // Keyboard Navigation Support
  function handleKeyboardNavigation(event) {
    // Close mobile menu with Escape key
    if (event.key === "Escape") {
      closeMobileMenu()
    }
  
    // Navigate with arrow keys when mobile menu is open
    if (document.getElementById("mobileNav").classList.contains("active")) {
      const navLinks = document.querySelectorAll(".nav-link-mobile")
      const currentFocus = document.activeElement
      const currentIndex = Array.from(navLinks).indexOf(currentFocus)
  
      if (event.key === "ArrowDown" && currentIndex < navLinks.length - 1) {
        event.preventDefault()
        navLinks[currentIndex + 1].focus()
      } else if (event.key === "ArrowUp" && currentIndex > 0) {
        event.preventDefault()
        navLinks[currentIndex - 1].focus()
      }
    }
  }
  
  // Click Outside Handler
  function handleClickOutside(event) {
    const mobileNav = document.getElementById("mobileNav")
    const menuBtn = document.querySelector(".mobile-menu-btn")
    const header = document.querySelector(".header")
  
    if (!header.contains(event.target) && mobileNav.classList.contains("active")) {
      closeMobileMenu()
    }
  }
  
  // Window Resize Handler
  const handleResize = debounce(() => {
    const mobileNav = document.getElementById("mobileNav")
  
    if (window.innerWidth > 768 && mobileNav.classList.contains("active")) {
      closeMobileMenu()
    }
  }, 250)
  
  // Page Loading Animation
  function initPageLoading() {
    document.body.style.opacity = "0"
    document.body.style.transition = "opacity 0.5s ease"
  
    window.addEventListener("load", () => {
      setTimeout(() => {
        document.body.style.opacity = "1"
      }, 100)
    })
  }
  
  // Performance Optimization - Lazy Loading for Images
  function initLazyLoading() {
    const images = document.querySelectorAll("img[src]")
  
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.classList.add("loaded")
            imageObserver.unobserve(img)
          }
        })
      })
  
      images.forEach((img) => {
        img.classList.add("lazy")
        imageObserver.observe(img)
      })
    }
  }
  
  // Add lazy loading styles
  const lazyStyles = document.createElement("style")
  lazyStyles.textContent = `
    img.lazy {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    img.lazy.loaded {
      opacity: 1;
    }
  `
  document.head.appendChild(lazyStyles)
  
  // Initialize Everything
  document.addEventListener("DOMContentLoaded", () => {
    if (window.emailjs) {
      emailjs.init('YOUR_USER_ID'); // ضع هنا userID الخاص بك من emailjs
    }
    // Initialize all features
    initPageLoading()
    initAOS()
    initLazyLoading()
  
    // Add event listeners
    window.addEventListener("scroll", handleHeaderScroll)
    window.addEventListener("scroll", handleBackToTopVisibility)
    window.addEventListener("scroll", throttle(updateActiveNavLink, 100))
    window.addEventListener("resize", handleResize)
    document.addEventListener("keydown", handleKeyboardNavigation)
    document.addEventListener("click", handleClickOutside)
  
    // Initial calls
    handleHeaderScroll()
    handleBackToTopVisibility()
    updateActiveNavLink()
  
    // Dark mode initial state
    const darkPref = localStorage.getItem('darkMode');
    setDarkMode(darkPref === '1');
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-mode');
        setDarkMode(!isDark);
      });
    }
  
    console.log("🎉 المدرسة التعليمية وهران - تم تحميل الموقع بنجاح!")
  })
  
  // Service Worker Registration (for PWA capabilities)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    })
  }
  
  // Error Handling
  window.addEventListener("error", (event) => {
    console.error("خطأ في الصفحة:", event.error)
  })
  
  window.addEventListener("unhandledrejection", (event) => {
    console.error("خطأ في Promise:", event.reason)
  })
  
  // Dark Mode Toggle
  function setDarkMode(enabled) {
    const body = document.body;
    const toggleBtn = document.getElementById('darkModeToggle');
    if (enabled) {
      body.classList.add('dark-mode');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      body.classList.remove('dark-mode');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('darkMode', enabled ? '1' : '0');
  }
  
  // --- كود المودال لتسجيل الدخول والتسجيل ---
  function showModal(id) {
    document.getElementById(id).style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function hideModal(id) {
    document.getElementById(id).style.display = 'none';
    document.body.style.overflow = '';
  }
  // فتح المودال من الهيدر أو الموبايل
  const openLoginModalBtn = document.getElementById('openLoginModal');
  if (openLoginModalBtn) openLoginModalBtn.onclick = () => showModal('loginModal');
  const openLoginModalMobileBtn = document.getElementById('openLoginModalMobile');
  if (openLoginModalMobileBtn) openLoginModalMobileBtn.onclick = () => { closeMobileMenu(); showModal('loginModal'); };
  // إغلاق المودال
  const closeLoginModalBtn = document.getElementById('closeLoginModal');
  if (closeLoginModalBtn) closeLoginModalBtn.onclick = () => hideModal('loginModal');
  const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
  if (closeRegisterModalBtn) closeRegisterModalBtn.onclick = () => hideModal('registerModal');
  // التحويل بين المودالين
  const showRegisterModalLink = document.getElementById('showRegisterModal');
  if (showRegisterModalLink) showRegisterModalLink.onclick = (e) => { e.preventDefault(); hideModal('loginModal'); showModal('registerModal'); };
  const showLoginModalLink = document.getElementById('showLoginModal');
  if (showLoginModalLink) showLoginModalLink.onclick = (e) => { e.preventDefault(); hideModal('registerModal'); showModal('loginModal'); };
  // إغلاق عند الضغط خارج الصندوق
  ['loginModal','registerModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) hideModal(id);
      });
    }
  });
  // إرسال نموذج التسجيل
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.onsubmit = async function(e) {
      e.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
          showNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.', 'success');
          hideModal('registerModal');
          showModal('loginModal');
        } else {
          showNotification(data.message || 'حدث خطأ أثناء التسجيل', 'error');
        }
      } catch (err) {
        showNotification('فشل الاتصال بالخادم', 'error');
      }
    }
  }
  // إرسال نموذج الدخول
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.onsubmit = async function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          showNotification('تم تسجيل الدخول بنجاح!', 'success');
          hideModal('loginModal');
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          updateUserInfoBox();
        } else {
          showNotification(data.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
        }
      } catch (err) {
        showNotification('فشل الاتصال بالخادم', 'error');
      }
    }
  }
  
  // تحسينات للجوال
  function handleMobileView() {
    const isMobile = window.innerWidth <= 768;
    
    // إيقاف بعض التأثيرات على الجوال لتجنب مشاكل الأداء
    if (isMobile) {
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.removeAttribute('data-aos');
      });
      
      // إيقاف تأثيرات الخلفية المتحركة على الجوال
      const heroBackground = document.querySelector('.hero-background');
      if (heroBackground) {
        heroBackground.style.animation = 'none';
      }
    }
  }
  
  // استدعاء الدالة عند التحميل وعند تغيير حجم النافذة
  handleMobileView();
  window.addEventListener('resize', debounce(handleMobileView, 200));
  
  // --- عرض اسم المستخدم في الهيدر بعد تسجيل الدخول ---
  function updateUserInfoBox() {
    const userInfoBox = document.getElementById('userInfoBox');
    const openLoginModalBtn = document.getElementById('openLoginModal');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userInfoBox.innerHTML = `<span style="font-weight:700;color:#3182ce"><i class='fas fa-user'></i> ${user.name}</span> <button id='logoutBtn' class='btn btn-secondary' style='margin-right:8px;font-size:0.95rem;padding:0.4rem 1.1rem;'>تسجيل خروج</button>`;
      userInfoBox.style.display = 'inline-block';
      if (openLoginModalBtn) openLoginModalBtn.style.display = 'none';
      // زر تسجيل الخروج
      setTimeout(() => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.onclick = function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showNotification('تم تسجيل الخروج بنجاح', 'success');
            updateUserInfoBox();
          }
        }
      }, 100);
    } else {
      userInfoBox.innerHTML = '';
      userInfoBox.style.display = 'none';
      if (openLoginModalBtn) openLoginModalBtn.style.display = '';
    }
  }
  // استدعاء عند تحميل الصفحة وبعد تسجيل الدخول/الخروج
  window.addEventListener('DOMContentLoaded', updateUserInfoBox);