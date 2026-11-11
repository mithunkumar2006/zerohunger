let scriptLoadingPromise = null;

/**
 * Dynamically loads the Google Maps JavaScript API script.
 * @param {string} apiKey - The Google Maps API key.
 * @returns {Promise<any>} - A promise resolving to window.google.maps.
 */
export const loadGoogleMapsScript = (apiKey) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Google Maps script in SSR environment"));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  if (!apiKey || apiKey.trim() === "") {
    return Promise.reject(new Error("GOOGLE_MAPS_API_KEY is empty or not configured"));
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if the script tag is already in the document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      // If it exists but window.google is not ready yet, wait for it
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          resolve(window.google.maps);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      resolve(window.google.maps);
    };

    script.onerror = (err) => {
      scriptLoadingPromise = null;
      reject(new Error("Failed to load Google Maps script. Please check your network and API credentials."));
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};
