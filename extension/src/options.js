function saveSettings(e) {
  e.preventDefault();
  browser.storage.sync.set({
    apiUrl: document.querySelector("#api-url").value,
  });
}

async function restore() {
  const { apiUrl } = await browser.storage.sync.get("apiUrl");
  if (apiUrl !== undefined) {
    document.querySelector("#api-url").value = apiUrl;
  }
}

document.addEventListener("DOMContentLoaded", restore);
document.querySelector("form").addEventListener("submit", saveSettings);
