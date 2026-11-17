// images already asked for, kept alive so the browser keeps them decoded.
const loaded = new Map();

// downloads and decodes images ahead of their first display, each one only once.
export function preloadImages(urls) {
  for (const url of urls) {
    if (!url || loaded.has(url)) continue;

    const image = new Image();
    image.decoding = 'async';
    image.src = url;
    image.decode().catch(() => {});
    loaded.set(url, image);
  }
}
