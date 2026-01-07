// Performance Optimization Utilities
// This module provides utilities to improve application performance

// Debounce function to reduce API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
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
};

// Image lazy loading utility
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// API request caching
const cache = new Map();

export const cachedFetch = async (url, options = {}, cacheTime = 5 * 60 * 1000) => {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data;
    }
    throw error;
  }
};

// Clear cache utility
export const clearCache = () => {
  cache.clear();
};

// Preload critical resources
export const preloadCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as || 'fetch';
    if (resource.crossorigin) {
      link.crossOrigin = resource.crossorigin;
    }
    document.head.appendChild(link);
  });
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      fetch(script.src, { method: 'HEAD' })
        .then(response => {
          const size = response.headers.get('content-length');
          if (size) {
            totalSize += parseInt(size);
            console.log(`Script: ${script.src}, Size: ${(size / 1024).toFixed(2)} KB`);
          }
        })
        .catch(() => {}); // Ignore CORS errors
    });
    
    setTimeout(() => {
      console.log(`Total estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    }, 2000);
  }
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const end = performance.now();
      console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`);
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`${name} failed after ${(end - start).toFixed(2)} milliseconds:`, error);
      throw error;
    }
  };
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  // Add resource hints
  addResourceHints();
  
  // Initialize lazy loading
  if ('IntersectionObserver' in window) {
    lazyLoadImages();
  }
  
  // Analyze bundle size in development
  analyzeBundleSize();
  
  // Preload critical API endpoints
  const criticalResources = [
    { href: '/api/warehouse/dashboard', as: 'fetch', crossorigin: 'anonymous' },
    { href: '/api/user/profile', as: 'fetch', crossorigin: 'anonymous' }
  ];
  preloadCriticalResources(criticalResources);
};