document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle");
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle");

  // Function to set the theme
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  // Function to toggle the theme
  const toggleTheme = () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Add event listeners to theme toggle buttons
  themeToggle.addEventListener("click", toggleTheme);
  mobileThemeToggle.addEventListener("click", toggleTheme);

  // Set initial theme based on user preference
  const preferredTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  setTheme(preferredTheme);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        // Only auto-switch if user hasn't manually set a preference
        setTheme(e.matches ? "dark" : "light");
      }
    });
  // Mobile menu functionality with improved accessibility
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  // Toggle menu with proper ARIA attributes
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target) &&
      mobileMenu.classList.contains("open")
    ) {
      mobileMenu.classList.remove("open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  });

  // Close menu when links are clicked
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  // Scroll-to-top button with throttled scroll handler
  const toTopButton = document.getElementById("to-top-button");

  // Throttle function to limit execution of scroll handler
  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  // Check scroll position and toggle button visibility
  const toggleScrollButton = () => {
    if (window.scrollY > 300) {
      toTopButton.classList.add("visible");
    } else {
      toTopButton.classList.remove("visible");
    }
  };

  // Add throttled scroll event listener
  window.addEventListener("scroll", throttle(toggleScrollButton, 100));

  // Initial check on page load
  toggleScrollButton();

  // Scroll to top when button is clicked
  toTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Enhance fade-in animations with Intersection Observer
  const sections = document.querySelectorAll(".fade-in-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Once the animation is triggered, we don't need to observe it anymore
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Start animation slightly before element is in view
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Add lazy loading for images
  const lazyLoadImages = () => {
    // Check if browser supports native lazy loading
    if ("loading" in HTMLImageElement.prototype) {
      // Use native lazy loading
      document.querySelectorAll("img").forEach((img) => {
        img.setAttribute("loading", "lazy");
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const lazyImages = document.querySelectorAll("img[data-src]");
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  };

  lazyLoadImages();
});
