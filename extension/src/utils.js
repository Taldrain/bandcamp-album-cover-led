const API_URL = 'http://192.168.1.26:8080';

let timeoutId;
function debounceAPICall(url, timeout) {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => fetch(url), timeout);
}

function draw(coverUrl) {
  debounceAPICall(`${API_URL}/cover?url=${coverUrl}`, 1000)
}

function clear() {
  debounceAPICall(`${API_URL}/clear`, 2000);
}

export { draw, clear };
