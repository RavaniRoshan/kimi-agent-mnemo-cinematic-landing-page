# Mnemo — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1.0 | UI framework |
| react-dom | ^19.1.0 | React DOM renderer |
| vite | ^6.3.0 | Build tool / dev server |
| @vitejs/plugin-react | ^4.4.0 | Vite React integration |
| tailwindcss | ^4.1.0 | Utility-first CSS |
| @tailwindcss/vite | ^4.1.0 | Tailwind Vite plugin |
| geist | ^1.4.0 | Font package (Geist + Geist Mono) |
| three | ^0.175.0 | WebGL renderer for hero grid + particle field |
| @types/three | ^0.175.0 | Three.js type definitions |
| gsap | ^3.13.0 | Animation engine (ScrollTrigger, SplitText, timelines) |
| @gsap/react | ^2.1.0 | GSAP React integration (useGSAP hook) |
| @studio-freight/lenis | ^1.1.0 | Smooth scroll |
| split-type | ^0.3.0 | Text splitting for word-by-word reveals |
| lucide-react | ^0.468.0 | Icon library |

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| Navigation | Custom | Fixed liquid-glass pill bar. Scrolls to sections via Lenis. Intensifies blur on scroll past hero. |
| Footer | Custom | Minimal flex-row layout. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full-viewport. Hosts MemoryGridCanvas + liquid-glass content overlay. |
| ProblemSection | Custom | 3-col grid (3+2 cards). Solid black bg. |
| ArchitectureSection | Custom | Full-viewport. Hosts ParticleFieldCanvas + fanned card overlay. Section pins during card fan animation. |
| CognitiveLoopSection | Custom | CSS-animated 6-node horizontal pipeline. Subtle navy gradient bg. |
| BeliefDynamicsSection | Custom | 2-col layout (text left, SVG neural network right). |
| HelixGallerySection | Custom | Full-viewport. Hosts CSS 3D helix + liquid-glass content overlay. |
| ResearchRoadmapSection | Custom | Research statement + vertical timeline. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| LiquidGlass | Custom | HeroSection, HelixGallerySection, Navigation | Shared liquid-glass treatment wrapper. CSS-based, no JS. Accepts `children`, `className`, `intense` prop for nav scroll state. |
| WordReveal | Custom | All sections with headlines | Scroll-triggered word-by-word text reveal. Uses SplitText + GSAP ScrollTrigger. Wraps GSAP SplitText to handle cleanup. |
| SectionLabel | Custom | All sections | "01 / THE PROBLEM" pattern. Geist Mono 14px, grey. |
| ScrollIndicator | Custom | HeroSection only | Animated dot-on-line + "Scroll" text. Fades out after 200px scroll. |
| LoadingScreen | Custom | App-level | Black overlay with brand text, fades out before hero reveals. |

### WebGL / Canvas Components

| Component | Source | Notes |
|-----------|--------|-------|
| MemoryGridCanvas | Custom (Three.js) | Hero backdrop. Instanced mesh grid with custom vertex/fragment shaders, UnrealBloomPass, mouse interaction. Uses its own rAF loop gated by IntersectionObserver. |
| ParticleFieldCanvas | Custom (Three.js) | Architecture backdrop. 3000 particles with ShaderMaterial, AdditiveBlending, scroll-driven wave displacement, mouse interaction. Own rAF loop gated by IntersectionObserver. |

### SVG / Animation Components

| Component | Source | Notes |
|-----------|--------|-------|
| CognitiveLoop | Custom | 6 SVG nodes + animated connector lines with traveling particles. CSS animations for pulse, GSAP for scroll-triggered entrance. |
| NeuralNetwork | Custom | SVG with ~25 nodes across 3 layers. GSAP-driven signal flow dots + periodic contradiction flash. |
| HelixGallery | Custom | CSS 3D transforms only. 40 panels with scroll-driven Y rotation. No WebGL. |

### Hooks

| Hook | Purpose |
|------|---------|
| useLenis | Initializes Lenis, syncs with GSAP ScrollTrigger. Single instance at App level. |
| useWebGLVisibility | IntersectionObserver that returns `isVisible` flag. Used by MemoryGridCanvas and ParticleFieldCanvas to gate rAF loops. |

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Loading screen fade-out | GSAP | Timeline: brand text visible → fade overlay opacity 1→0 over 0.8s | Low |
| Hero grid fade-in | GSAP | Opacity tween on canvas container, 2s, power2.out | Low |
| Hero content stagger | GSAP | Single timeline: panel fade + translateY(40→0), then word-by-word headline, stagger 0.12s between elements | Medium |
| Headline word-by-word reveal | GSAP + SplitText | SplitText splits into words, each wrapped in overflow-hidden clip container, translateY(100%→0), stagger 0.08s. Reusable via WordReveal component. | Medium |
| **🔒 Hero WebGL wave grid** | Three.js (raw) | Full custom implementation: InstancedMesh with 6500 instances, custom ShaderMaterial vertex+fragment shaders, UnrealBloomPass, mouse NDC→world conversion. Dedicated rAF loop. | **High** |
| Nav liquid-glass intensify | GSAP ScrollTrigger | Toggle `intense` class/prop on Navigation when scroll > 100vh. CSS handles blur value change. | Low |
| Problem cards stagger entrance | GSAP ScrollTrigger | Batch: translateY(60→0) + opacity(0→1), stagger 0.1s, 1s expo.out. start: "top 75%" | Low |
| Problem card hover | CSS | translateY(-4px) + box-shadow transition, 0.4s | Low |
| **🔒 Architecture particle field** | Three.js (raw) | 3000 BufferGeometry particles, custom ShaderMaterial (position/color/size attributes), AdditiveBlending, FogExp2. Scroll-driven wave displacement via GSAP scrub timeline mutating position buffer. Dedicated rAF loop. | **High** |
| Architecture cards fan-out | GSAP ScrollTrigger + ScrollTrigger pin | Section pins for 500px. Timeline: cards from stacked center (scale 0.8, opacity 0) to fanned positions with rotation, stagger 0.15s. scrub: 1. | **High** |
| Cognitive loop node spring-in | GSAP ScrollTrigger | scale(0→1) with back.out(1.7), stagger 0.2s, 0.8s. start: "top 70%" | Medium |
| Cognitive loop connector draw | GSAP | scaleX(0→1) left-to-right, stagger 0.2s after preceding node, 0.6s power2.out | Medium |
| Cognitive loop pulse | CSS | `@keyframes pulse` scale(1→1.03→1), 4s ease-in-out infinite, 0.5s stagger per node | Low |
| Cognitive flow particles | CSS | `@keyframes flow` translateX/Y along connector, 3s linear infinite, offset start times | Low |
| Belief dynamics text entrance | GSAP ScrollTrigger | WordReveal headline + paragraph fade/translateY stagger 0.15s | Low |
| **🔒 Neural network entrance** | GSAP | Network fades in (1s), then nodes scale(0→1) + back.out(1.7), stagger 0.03s, then connections opacity(0→0.06). | **High** |
| **🔒 Neural signal flow** | GSAP | Dots animate along SVG connection paths using attr tweens (cx/cy) or MotionPathPlugin if available. Multiple concurrent dots, fade in/out. Continuous. | **High** |
| **🔒 Neural contradiction flash** | GSAP | Every 6s: random output node flashes red, connections highlight red, then "heal" back to lime over 2s. Uses GSAP timeline with repeatDelay. | **High** |
| Helix panel entrance | CSS | Panels scale(0→1) with `cubic-bezier(0.34, 1.56, 0.64, 1)`, stagger 0.05s per panel. Triggered by adding class on scroll into view. | Medium |
| Helix scroll rotation | GSAP ScrollTrigger | scrub timeline: rotateY on inner wrapper proportional to scroll progress. scrollSensitivity: 0.0005. | Medium |
| Helix content overlay entrance | GSAP ScrollTrigger | LiquidGlass panel fade + translateY(30→0), 1s expo.out. start: "top 70%" | Low |
| Roadmap line draw | GSAP ScrollTrigger | scaleY(0→1), transform-origin top, 1.5s power2.inOut | Low |
| Roadmap items stagger | GSAP ScrollTrigger | translateX(-20→0) + opacity fade, stagger 0.2s, 0.8s expo.out | Low |
| Section label + headline reveals | GSAP + SplitText | Reusable WordReveal pattern across all sections. ScrollTrigger start: "top 80%" | Medium |
| Scroll indicator | GSAP | Dot translateY(0→40px) + opacity fade, 2s infinite. Fade out entire indicator after 200px scroll. | Low |

## State & Logic

### Lenis ↔ GSAP ScrollTrigger Sync

Lenis must be the single scroll controller. GSAP ScrollTrigger's native scroll listener is replaced by Lenis's `scroll` event. This requires:

1. Lenis instance created once at App level in `useLenis` hook
2. `lenis.on('scroll', ScrollTrigger.update)` called immediately
3. All GSAP ScrollTrigger configs use the Lenis-driven scroll position implicitly
4. Lenis destroyed on unmount

### WebGL Visibility Gating

Both Three.js canvases run independent `requestAnimationFrame` loops. To prevent GPU waste when off-screen:

1. Each canvas component creates an IntersectionObserver on its container element (threshold: 0.1)
2. Observer sets a `isVisibleRef` boolean
3. The rAF loop checks `isVisibleRef` at the top — if false, skips rendering and schedules next frame
4. On re-entry, rendering resumes seamlessly
5. This is abstracted into the `useWebGLVisibility` hook

### Hero Load Sequence Orchestration

The loading sequence is a coordinated multi-phase timeline managed at the App level:

1. **Phase 1 (0–1.5s):** LoadingScreen visible, brand text displayed
2. **Phase 2 (1.5–2.3s):** LoadingScreen fades out (0.8s)
3. **Phase 3 (2.3s+):** Hero WebGL canvas begins render loop + opacity fade-in (2s)
4. **Phase 4 (2.8s+):** Hero content stagger begins (0.5s after grid starts)
5. **Phase 5 (2.8s+):** Navigation fades in simultaneously with hero content

Implementation: a single GSAP master timeline at App level with labeled positions. The LoadingScreen component receives an `onComplete` callback. Hero canvas render loop starts immediately but canvas container opacity is tweened by GSAP.

### Section Pin: Architecture Cards

The ArchitectureSection pins for 500px of scroll distance. During the pin, a GSAP timeline scrubs the cards from stacked to fanned. Key considerations:

1. The pin uses ScrollTrigger with `pin: true`, `scrub: 1`, `end: "+=500"`
2. The particle field canvas continues rendering during the pin (it's part of the pinned section)
3. The card fan animation and the particle scroll-progress wave are independent timelines on the same ScrollTrigger
4. On mobile, pin is disabled — cards stack vertically without animation

### Architecture Card Fanned Positioning

The 5 cards have specific transform values for their fanned arrangement:

| Card | translateX | translateY | rotateZ | z-index |
|------|-----------|-----------|---------|---------|
| 1 (Working) | -360px | 10px | -4deg | 1 |
| 2 (Episodic) | -180px | 5px | -2deg | 2 |
| 3 (Semantic) | 0px | 0px | 0deg | 3 |
| 4 (Procedural) | 180px | 5px | 2deg | 4 |
| 5 (Belief) | 360px | 10px | 4deg | 5 |

On hover, a card resets rotation to 0deg, scales to 1.05, and rises to z-index 10. This is CSS transition-based (not GSAP) for responsiveness.

## Other Key Decisions

### Raw Three.js over React Three Fiber

Both WebGL components (MemoryGridCanvas, ParticleFieldCanvas) use raw Three.js with `useRef` + `useEffect` rather than React Three Fiber. Rationale:

1. Both require custom ShaderMaterial with inline GLSL — RFM's declarative shader API adds indirection without benefit
2. Both need direct control over EffectComposer and UnrealBloomPass — RFM's post-processing abstraction is unnecessary
3. Both manage their own rAF loops gated by IntersectionObserver — RFM's automatic render loop conflicts with visibility gating
4. No need for RFM's reconciler benefits (no complex scene graph, no frequent prop updates)

### No MotionPathPlugin for Signal Flow

The neural network's traveling signal dots use direct GSAP `attr` tweens on `cx`/`cy` SVG attributes rather than MotionPathPlugin. Rationale: the paths are simple straight lines between known node coordinates. Computing start/end positions and tweening attributes directly is simpler than setting up motion paths, and avoids an additional GSAP plugin dependency.

### SplitText Over split-type

GSAP's SplitText plugin is used for word-by-word reveals instead of the split-type npm package. Rationale: SplitText integrates directly with GSAP's timeline API, handles cleanup on revert automatically, and is the standard approach when GSAP is already a dependency. The split-type package was listed in design dependencies but is superseded by SplitText.

### Image Assets: 15 Images, No Video

The design requires 15 generated images (5 architecture card images + 10 helix gallery images). Helix gallery panels cycle through the 10 images across 40 slots. No video assets are needed. Architecture card icons (5 problem section icons) are inline SVGs, not generated images.

### Font Loading Strategy

Instrument Serif loaded via Google Fonts CDN (`<link>` in index.html). Geist and Geist Mono loaded via the `geist` npm package CSS imports in the main entry file. This avoids FOUT by letting the browser preload alongside the HTML parse.
