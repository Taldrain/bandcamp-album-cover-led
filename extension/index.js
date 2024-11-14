const API_URL = 'http://192.168.1.26:8080';

(() => {
  if (window.albumCoverHasRun === true) {
    return;
  }

  window.albumCoverHasRun = true;

  // check for the play button to change state by watching the class
  function watchPlay() {
    const el = document.querySelector('div.playbutton');
    const observer = new MutationObserver(async (mutations) => {
      const lastMutation = mutations.at(-1);
      // we have two events fired on play/pause
      // we'll use the last one
      //
      // the button is also updated when switching to a new track
      if (lastMutation.target.classList.contains('playing')) {
        const trackUrl = getTrackURL();
        const coverUrl = await getCoverURL(trackUrl);
        await fetch(`${API_URL}/cover?url=${coverUrl}`);
      } else if (!lastMutation.target.classList.contains('busy')){
        // we don't want to clear the cover when the button is busy
        // eg: switching tracks
        await fetch(`${API_URL}/clear`);
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['class']});
  }

  // return the url of the current track
  function getTrackURL() {
    const el = document.querySelector('a.title_link');
    const url = el.href;
    return url;
  }

  async function getCoverURL(trackUrl) {
    const response = await fetch(trackUrl);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const el = doc.querySelector('div#tralbumArt img');
    return el.src;
  }

  watchPlay();
})();
