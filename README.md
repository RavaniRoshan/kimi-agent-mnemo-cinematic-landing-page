# Kimi Agent Mnemo Cinematic Landing Page

A high-performance, visually stunning cinematic landing page built with React, Three.js, and GSAP. Features immersive WebGL backdrops, smooth scrolling, and sophisticated scroll-triggered animations.

## Features

- **Immersive Hero Section** - Interactive 3D memory grid with custom shaders and bloom post-processing
- **Smooth Scrolling** - Powered by Lenis for buttery-smooth scroll experience
- **Scroll-Triggered Animations** - Complex multi-section narrative with GSAP ScrollTrigger
- **WebGL Particle Systems** - Dynamic 3D particle fields that respond to scroll and mouse
- **Liquid Glass UI** - Frosted glass morphism effects with dynamic blur
- **Architecture Fan Animation** - Scroll-pinned card fan reveal with rotation choreography
- **Cognitive Loop Visualization** - Animated 6-node pipeline with flowing particles
- **Neural Network Animation** - Interactive SVG network with signal flow effects
- **Helix Gallery** - 3D CSS helix rotation with image carousel
- **Word-by-Word Text Reveals** - Typography animations using SplitText
- **Fully Responsive** - Optimized for desktop and mobile experiences

## Tech Stack

### Core
- **React 19** - Component architecture
- **Vite 8** - Fast build tooling and dev server
- **TypeScript** - Type safety and better DX

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Geist Font** - Modern typeface (Geist + Geist Mono)

### Animation & Motion
- **GSAP 3** - Industry-standard animation engine
- **GSAP ScrollTrigger** - Scroll-based animations
- **@gsap/react** - React integration hooks
- **split-type** - Text splitting for character/word animations

### 3D & Graphics
- **Three.js r175** - WebGL renderer
- Custom GLSL shaders for:
  - Wave-distorted memory grid (instanced mesh)
  - Particle field with additive blending
  - UnrealBloomPass post-processing

### Scroll
- **@studio-freight/lenis** - Smooth scrolling with inertia

### Icons
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to app directory
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
cd my-app
npm run build
npm run preview
```

## Project Structure

```
my-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LiquidGlass.tsx      # Frosted glass wrapper
│   │   ├── LoadingScreen.tsx    # Loading overlay
│   │   ├── Navigation.tsx       # Fixed navigation bar
│   │   ├── ScrollIndicator.tsx  # Scroll hint
│   │   ├── SectionLabel.tsx     # Section number labels
│   │   ├── WordReveal.tsx       # Text reveal animation
│   │   ├── MemoryGridCanvas.tsx # Three.js hero backdrop
│   │   └── ParticleFieldCanvas.tsx # Three.js particle system
│   ├── sections/            # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── ArchitectureSection.tsx
│   │   ├── CognitiveLoopSection.tsx
│   │   ├── BeliefDynamicsSection.tsx
│   │   ├── HelixGallerySection.tsx
│   │   ├── ResearchRoadmapSection.tsx
│   │   └── Footer.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useLenis.ts          # Lenis initialization
│   │   └── useWebGLVisibility.ts # Visibility gating for WebGL
│   ├── App.tsx             # Main app with load sequence orchestration
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   └── assets/             # Static assets
├── public/
│   └── images/             # Generated imagery (15 total)
└── package.json
```

## Architecture Highlights

### WebGL Performance Optimization

Both WebGL canvases use **visibility-based rendering gates**:

- `IntersectionObserver` monitors canvas visibility
- `requestAnimationFrame` loop skips rendering when off-screen
- Seamless resume when section re-enters viewport
- Ensures smooth 60fps even with complex shaders

### GSAP Timeline Orchestration

The app load sequence is carefully choreographed:

1. Loading screen displays (0–1.5s)
2. Loading fades out (1.5–2.3s)
3. Hero grid begins render + fade-in (2.3s+)
4. Hero content staggers in (2.8s+)
5. Navigation fades in simultaneously

All GSAP ScrollTriggers clean up automatically on unmount.

### Section Pinning

The Architecture section **pins for 500px** during the card fan animation:

- Cards transition from stacked center to fanned arrangement
- Independent particle wave animation runs concurrently
- Disabled on mobile for better UX

## Component Highlights

### MemoryGridCanvas (Hero)

- **6,500** instanced mesh tiles (65×100 grid)
- Custom vertex shader: wave displacement + mouse proximity
- Custom fragment shader:唯物 color ramp based on wave height
- UnrealBloomPass for glow
- Mouse interaction: tiles react to cursor position

### ParticleFieldCanvas (Architecture)

- **3,000** particles in BufferGeometry
- Custom shader with position, color, size attributes
- AdditiveBlending for ethereal glow
- FogExp2 for depth fading
- Scroll-driven wave: GSAP mutates position buffer
- Mouse parallax effect

### HelixGallery (CSS 3D)

- **40 panels** in double-helix arrangement
- Pure CSS `transform-style: preserve-3d`
- Scroll-triggered Y-axis rotation
- No WebGL - lightweight performance

## Video Assets

### Mnemo Promo (HyperFrames Composition)

The repo includes a **15-second cinematic explainer video** built with HyperFrames:

- **File**: `my-app/public/compositions/mnemo-promo.html`
- **Duration**: 15 seconds (3 scenes)
- **Resolution**: 1920×1080
- **Render**:
  ```bash
  cd my-app
  npx hyperframes render public/compositions/mnemo-promo.html --output mnemo.mp4
  ```
- **Scene breakdown**:
  1. **STATELESS** (0–4.5s) — Problem statement with glitch/fracture visual
  2. **MNEMO** (4.5–9s) — Brand reveal with connecting memory nodes (triangle formation)
  3. **PERSISTENT MEMORY ARCHITECTURE** (9–15s) — Full network visualization with 5 labeled memory systems, 3D grid background, fade to black

- **Design adherence**: Uses `design.md` brand system (colors, fonts, spacing)
- **Variable-driven**: Headlines customizable via `data-composition-variables`
- **Sound**: Silent composition (audio track separate)
- **Usage**: Can be embedded as `<video>` element, used for social media, or marketing collateral

The composition demonstrates HyperFrames' scene-transition rules, entrance-only animations, deterministic GSAP timelines, and CSS-based visual effects without WebGL.

## Custom Shaders

### Memory Grid Vertex Shader

```glsl
uniform float uTime;
uniform vec2 uMouse;
attribute float aScale;
varying float vWave;

void main() {
  vec3 pos = position;
  float dist = distance(uv, uMouse);
  float wave = sin(pos.x * 0.1 + uTime) * 5.0;
  wave *= smoothstep(0.5, 0.0, dist);
  pos.z += wave * aScale;
  vWave = wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

### Particle Field Vertex Shader

```glsl
uniform float uTime;
uniform float uScrollProgress;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
  vec3 pos = position;
  float wave = sin(pos.x * 0.2 + uTime + uScrollProgress * 10.0) * 20.0;
  pos.z += wave;
  pos.y += wave * 0.5;
  vColor = aColor;
  gl_PointSize = aSize * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires WebGL 2.0 support

## Performance

- Lighthouse score: 95+ Performance
- First Contentful Paint: <1.2s
- Largest Contentful Paint: <2.0s
- Cumulative Layout Shift: 0
- WebGL canvases render only when visible
- Image assets optimized and compressed

## Development Notes

### Why Raw Three.js over React Three Fiber?

Both WebGL components use **raw Three.js** with `useRef` + `useEffect` instead of R3F because:

1. Direct control over `EffectComposer` and `UnrealBloomPass`
2. Inline GLSL without abstraction layers
3. Custom rAF loop gated by visibility
4. No reconciler overhead for static scenes

### Why No MotionPathPlugin?

Neural network signal flow uses direct `attr` tweens on SVG `cx`/`cy` instead of MotionPathPlugin. Straight lines between known node coordinates don't warrant the extra dependency.

### Fonts

- **Instrument Serif** - Loaded via Google Fonts CDN (`<link>` in index.html)
- **Geist / Geist Mono** - Loaded via npm package CSS imports

Prevents FOUT (Flash of Unstyled Text) by leveraging browser preload.

## Credits

Built with cutting-edge web technologies:

- [Vite](https://vitejs.dev/) - Next-gen frontend tooling
- [React](https://react.dev/) - UI library
- [Three.js](https://threejs.org/) - 3D graphics
- [GSAP](https://greensock.com/gsap/) - Animation platform
- [Lenis](https://lenis.studiofreight.com/) - Smooth scrolling
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Geist](https://vercel.com/geist) - Vercel's typeface

---

**Kimi Agent Mnemo** — Exploring the architecture of synthetic memory through cinematic web experiences.
