let loaded  = false;
let loading = false;
let pending = [];

export function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (loaded && window.google) return resolve(window.google);

    pending.push({ resolve, reject });
    if (loading) return;

    loading = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      loaded = true;
      pending.forEach(p => p.resolve(window.google));
      pending = [];
    };

    script.onerror = () => {
      loading = false;
      const err = new Error("Failed to load Google Maps. Check your API key.");
      pending.forEach(p => p.reject(err));
      pending = [];
    };

    document.head.appendChild(script);
  });
}