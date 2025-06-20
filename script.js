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
      const phoneRegex = /^[+]?[0-9\s\-$$$$]{8,}$/
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
  
    setTimeout(() => {
      showNotification("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.", "success")
      form.reset()
      submitBtn.innerHTML = originalContent
      submitBtn.disabled = false
      form.classList.remove("loading")
    }, 2000)
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
