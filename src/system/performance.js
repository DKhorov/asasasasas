
export const preloadCriticalResources = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = '/image/1.webp';
  link.type = 'image/webp';
  link.fetchPriority = 'high';
  document.head.appendChild(link);

  const testImgLink = document.createElement('link');
  testImgLink.rel = 'preload';
  testImgLink.as = 'image';
  testImgLink.href = '/image/test.webp';
  testImgLink.type = 'image/webp';
  testImgLink.fetchPriority = 'high';
  document.head.appendChild(testImgLink);
};

export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (index < 10) {
      if (index < 3) {
        img.fetchPriority = 'high';
        img.loading = 'eager';
      } else {
        img.loading = 'eager';
        img.fetchPriority = 'auto';
      }
    } else {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    
    if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.style.width = '100%';
      img.style.height = 'auto';
    }

    img.onerror = function() {
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = `
        width: 100%;
        height: 300px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 14px;
        border-radius: 8px;
      `;
      fallback.textContent = 'Изображение недоступно';
      this.parentNode.insertBefore(fallback, this);
    };
  });
};

export const optimizeDataLoading = () => {
  const preloadData = async () => {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 3000); 
      
      const response = await fetch('/api/posts?limit=10', {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('posts_cache', JSON.stringify(data));
      }
    } catch (error) {
    }
  };

  if (document.readyState === 'complete') {
    preloadData();
  } else {
    window.addEventListener('load', preloadData);
  }
};

export const optimizeCriticalRendering = () => {
  const criticalElements = document.querySelectorAll('[data-critical="true"]');
  criticalElements.forEach(el => {
    el.style.contentVisibility = 'auto';
    el.style.containIntrinsicSize = '0 300px';
  });

  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
};

export const initPerformanceOptimizations = () => {
  preloadCriticalResources();
  optimizeImages();
  optimizeDataLoading();
  optimizeCriticalRendering();
};

export default initPerformanceOptimizations; 