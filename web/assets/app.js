/* Review-AI 原型共享脚本：图标加载 + 轻提示 */
(() => {
  if (window.fixedLucideReady) return;
  window.fixedLucideReady = (async () => {
    const response = await fetch('https://registry.npmmirror.com/@iconify-json/lucide/1.2.147/files/icons.json');
    if (!response.ok) throw new Error('Icon data unavailable');
    const collection = await response.json();
    if (collection.prefix !== 'lucide' || !collection.icons) {
      throw new Error('Invalid icon data');
    }
    if (customElements.get('iconify-icon')) {
      throw new Error('Reuse the existing icon integration');
    }
    window.IconifyPreload = [{ ...collection, provider: 'fixed' }];
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://registry.npmmirror.com/iconify-icon/3.0.4/files/dist/iconify-icon.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Icon component unavailable'));
      document.head.append(script);
    });
    const component = customElements.get('iconify-icon');
    if (!component?.iconLoaded('@fixed:lucide:house')) {
      throw new Error('Icon data was not registered');
    }
    document.documentElement.dataset.icons = 'ready';
    return component;
  })();
  window.fixedLucideReady.catch((error) => {
    document.documentElement.dataset.icons = 'unavailable';
    console.error(error);
  });
})();

window.showToast = (message) => {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('is-show'));
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('is-show'), 1800);
};
