import { clear, draw } from './utils.js';

(() => {
  if (window.collectionCoverHasRun === true) {
    return;
  }
  window.collectionCoverHasRun = true;

  let previousPlayObserver = null;

  function watchPlay() {
    const el = document.querySelector('div.carousel-player-inner div.playpause .pause');
    if (previousPlayObserver !== null) {
      previousPlayObserver.disconnect();
    }

    previousPlayObserver = new MutationObserver(async (mutations) => {
      const lastMutation = mutations.at(-1);

      if (lastMutation.target.style.display != 'none') {
        // we don't have an easy access to the track URL, we have to use the
        // album cover and not the track cover
        const coverUrl = getCoverURL();

        draw(coverUrl);
      } else if (lastMutation.target.style.display == 'none') {
        clear();
      }
    });

    previousPlayObserver.observe(el, { attributes: true, attributeFilter: ['style'] });
  }

  function getCoverURL() {
    const el = document.querySelector('div.carousel-player-inner div.now-playing img');
    return el.src;
  }

  function watchCarouselPlayer() {
    const el = document.querySelector('div#collection-player');
    const observer = new MutationObserver(async (mutations) => {
      const lastMutation = mutations.at(-1);

      if (lastMutation.target.classList.contains('show-player')) {
        watchPlay();
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  }

  watchCarouselPlayer();
})();
