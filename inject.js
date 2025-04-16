function injectScript(file, onload) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(file);
  script.onload = () => {
    script.remove();
    if (onload) onload();
  };
  (document.head || document.documentElement).appendChild(script);
}

// First inject SweetAlert2, then inject the override logic
injectScript('sweetalert2.min.js', () => {
  injectScript('override.js');
});