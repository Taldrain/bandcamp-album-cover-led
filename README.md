# Bandcamp Album Cover LED

Display the album cover of the currently playing track on Bandcamp on a LED matrix.

Use a browser extension to watch for any currently playing track on Bandcamp
and send the album cover to the LED matrix via the exposed API.

## Setup

Clone the repository on:
  - the PC running the browser, where the extension will be installed
  - the host running the LED matrix (eg: Raspberry Pi) which will expose the endpoint

### Host with LED matrix

Clone the https://github.com/hzeller/rpi-rgb-led-matrix repository and build
the `utils/` folder. The `led-image-viewer` binary will be used to display the
album cover.

In the `api/` folder of this project, update the `.env` file with:
  - the path to the `led-image-viewer` binary
  - other configurations needed (https://github.com/hzeller/rpi-rgb-led-matrix)

Then run the API with `sudo npm run dev`. [^1]

[^1]: The `rpi-rgb-led-matrix` library requires root access: https://github.com/hzeller/rpi-rgb-led-matrix?tab=readme-ov-file#running-as-root

You can test the API via `curl "http:<host>:<port>/cover?url=https://f4.bcbits.com/img/a0616110245_10.jpg"`

### Browser extension

Access the `extension/` folder and:
  - update the `extension/manifest.json` file with the IP of the host, in the
  `permissions` section.
  - update the `extensions/index.js` file and update the `API_URL` with the
  same IP, with the port

To load the extension on Firefox, open `about:debugging`, then `This Firefox`
and `Load Temporary Add-on...` and select the `extension/manifest.json` file.

When playing a track on Bandcamp, the extension will send the album cover to
the `API_URL`.

## Architecture

The extensions setup and observer on the Bandcamp artist page, ie: not on the
collection page. Each time the class of the play button is updated it:
    - check if the track is playing (presence of the `playing` class)
    - fetch the track page (the album cover and track cover can be different)
    - extract the album cover URL
    - send it to the API_ENDPOINT `<host>:<port>/cover?url=<album_cover_url>`

The API listen for the `/cover` endpoint and will:
    - check if the cover has not already been downloaded, via the image filename
    - if not, it will download it and store it on the `$XDG_DATA_HOME/bandcamp-album-cover-led` folder (note: the project runs as root, the cache folder will be in `root/.cache/`)
    - send the image filepath to the `led-image-viewer` binary


## Todo

- Clear the LED matrix when the track is paused/stopped/tab is closed
- Send the track url to the API, which could cache it instead of the image to reduce one fetch. The html will need to be parsed (eg: via `jsdom`)
- Cleaner API endpoint definition in the extension, we should not have to update the `manifest.json` and `index.js` files
