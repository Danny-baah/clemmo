# Clemmo HP - B2B Hero Experience

High-performance, cinematic scroll storytelling hero section for **Clemmo HP**, built with React, Vite, HTML5 Canvas, and Vanilla CSS.

---

## 🏗 Architecture Overview

The hero section delivers an Apple-style scroll-driven presentation where the user's scroll smoothly controls the progression of an architectural building-block assembly story:

1. **Build-Time Frame Extraction**:
   - The supplied hero video (`Building_block_model_film_creation_20261006195849.mp4`, 8.00s @ 24fps) was processed into 144 optimized WebP frames (~20 KB/frame, 2.82 MB total).
   - Stored in `public/hero/frames/frame_000.webp` to `frame_143.webp`.
   - Bypasses HTML5 video decoder seek jitter and delivers seamless forward/backward scroll playback.

2. **Canvas Rendering (`HeroCanvas.jsx`)**:
   - Uses aspect-fill / object-fit-cover mathematics with high-DPI `devicePixelRatio` scaling.
   - **Immediate Frame 0 Delivery**: Frame 0 is preloaded and displayed instantly with zero flash or blank state.
   - **Progressive Preloading**: Loads early frames and progressive batches in idle intervals, falling back to the nearest loaded frame if the user scrubs rapidly.

3. **Pinned Scroll Storytelling (`useHeroScroll.js` & `Hero.jsx`)**:
   - Pinned 450vh container with `position: sticky` 100vh viewport.
   - Decoupled from React render cycles: calculates scroll progress using `requestAnimationFrame` with interpolation:
     `currentProgress += (targetProgress - currentProgress) * 0.12`
   - Smoothly settles on the final architectural model before the hero releases into subsequent page content.

4. **Continuous Text Transitions (`HeroText.jsx`)**:
   - Initial state:
     - Eyebrow: `INDIVIDUELLE KLEMMBAUSTEIN-SETS`
     - Headline: `Deine Marke.` / `Deine Idee.`
     - Subtext: `Maßgeschneiderte Klemmbaustein-Sets von A bis Z.`
     - Indicator: `SCROLL TO EXPLORE`
   - Final state:
     - Headline: `MAẞGESCHNEIDERTE KLEMMBAUSTEIN-SETS`
     - Subtext: `Von der ersten Idee bis zur fertigen Lieferung.`
     - CTA: `PROJEKT ANFRAGEN →` (target `#kontakt`) + `IDEEN IN ECHTE PRODUKTE VERWANDELN`
   - Continuous opacity, translation, and subtle blur without unmounting or component re-renders.

5. **Responsive Navbar (`HeroNavbar.jsx`)**:
   - Transparent over the pinned hero, matching the European B2B aesthetic from the reference image.
   - Smoothly transitions to a dark surface (`#0d1715`) when scrolled past the hero boundary.
   - Supports mobile drawer menu.

6. **Static FTP Deployment**:
   - Completely static: no backend, no SSR, no database.
   - Configured with relative base (`./`) for direct upload of `/dist` to any FTP hosting path.

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```
Development server runs locally at: `http://localhost:5174/` (or `http://localhost:5173/`).

### Production Build
```bash
npm run build
```
Outputs completely static, self-contained assets to `/dist`.

### Frame Extraction (Optional / Maintenance)
To re-extract frames from the source video:
```bash
npm run extract-frames
```
*Requires either Python with `opencv-python` or FFmpeg on the system path.*
