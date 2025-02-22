let timeoutId;

function debounceAPICall(endpoint, timeout) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    const { apiUrl } = await browser.storage.sync.get("apiUrl");
    if (apiUrl === undefined) {
      return;
    }

    return fetch(`${apiUrl}${endpoint}`);
  }, timeout);
}

function draw(coverUrl) {
  debounceAPICall(`/cover?url=${coverUrl}`, 1000)
}

function clear() {
  debounceAPICall('/clear', 2000);
}

export { draw, clear };
