# Brandon Haley — Portfolio

Static portfolio site. Plain HTML/CSS/JS, no build step, ready for Vercel.

## Structure

```
/
├── index.html            Home: category panels, About, featured gallery, booking
├── art/index.html        Art & Design
├── photo-video/index.html Photo & Video
├── music/index.html      Music Production & Recording
├── web-mobile/index.html Web & Mobile Code
├── assets/
│   ├── css/style.css     All styles (colors/fonts at the top in :root)
│   ├── js/main.js        Nav, splash panels, gallery filters/lightbox, Calendly
│   └── img/              Images (suggest one subfolder per category)
└── vercel.json
```

## Adding the Calendly link

Open `assets/js/main.js` and set the one line at the top:

```js
const SITE = {
  calendlyUrl: "https://calendly.com/your-link",
};
```

Every booking section and "Book a call" button on every page picks it up automatically. Until it's set, the booking area shows a "Scheduling opens soon" placeholder. Category pages pass their category name to Calendly as the first question answer (`a1`), so if your first booking question is "What's the project?" it's prefilled.

## Adding work to a gallery

Each gallery item is a `<figure>`. Swap the placeholder `<div class="ph">` for a real image:

```html
<figure class="gallery__item" data-cat="murals" data-title="Downtown Wall" data-desc="Client, 2025">
  <img src="../assets/img/art/downtown-wall.jpg" alt="Downtown Wall mural" loading="lazy">
  <figcaption><b>Downtown Wall</b><span class="mono">Client, 2025</span></figcaption>
</figure>
```

- `data-cat` must match one of the filter buttons on that page.
- Add `wide` or `tall` to the class for bigger tiles.
- Video file: add `data-type="video" data-src="path/to/clip.mp4"` (keep an `<img>` as the thumbnail).
- YouTube/Vimeo: add `data-type="embed" data-src="https://www.youtube.com/embed/VIDEO_ID"`.

Images show in grayscale and go full color on hover, keeping the black-and-white look.

## Category colors

Set in `:root` in `style.css`: `--c-art`, `--c-photo`, `--c-music`, `--c-web`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import `BHALEYART/BHaleyArt`.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy, then add your custom domain under **Settings → Domains**.
