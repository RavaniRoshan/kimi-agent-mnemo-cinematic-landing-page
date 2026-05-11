# AGENTS.md — OpenCode Guide for Kimi Agent Mnemo Landing Page

## Quick Facts
- Single React app in `my-app/`; root only has `tech-spec.md` (docs)
- Git repo already initialized; default branch: `master`
- No test framework configured (only lint, build, preview)
- Framework: React 19 + Vite 8 + TypeScript + Tailwind CSS 4

## Exact Commands
```bash
cd my-app                 # Always work inside my-app/
npm install               # Install deps (Vite, Three, GSAP, Lenis)
npm run dev               # Start dev server (port 5173)
npm run build             # Build production bundle
npm run lint              # ESLint check (React + TypeScript rules)
npm run preview           # Preview production build locally
```

## Critical Architecture
- **Raw Three.js** (not React Three Fiber) — MemoryGridCanvas & ParticleFieldCanvas use `useRef` + `useEffect` with custom shaders and EffectComposer
- **Lenis ↔ GSAP sync** — `useLenis` hook creates singleton Lenis instance; must call `lenis.on('scroll', ScrollTrigger.update)` for ScrollTrigger to work
- **Visibility-gated rAF loops** — WebGL canvases use `useWebGLVisibility` hook with IntersectionObserver; rendering pauses when off-screen
- **Master timeline orchestration** — App-level GSAP timeline choreographs load: LoadingScreen → Hero grid fade-in → Content stagger → Nav fade in
- **Section pinning** — ArchitectureSection pins 500px during card fan; disabled on mobile

## Shader & Three.js Setup
- **MemoryGridCanvas**: instanced mesh (6,500 tiles), custom vertex+fragment shaders, UnrealBloomPass; mouse NDC→world conversion; scroll position drives wave
- **ParticleFieldCanvas**: 3,000 BufferGeometry particles, custom shader with attribute buffers, additive blending, scroll-scrubbed wave via GSAP mutating position buffer
- Both canvases manage their own rAF loop; never use React state for animation per-frame updates

## Build & Style Conventions
- Tailwind v4: use `@tailwindcss/vite` plugin; no `tailwind.config.js`
- Fonts: Geist/Geist Mono from `geist` npm package; Instrument Serif via Google Fonts CDN in index.html
- Import paths: relative within `src/`; prefer `@/components/...` style if alias configured in `vite.config.ts` (check config)
- TypeScript: `tsconfig.json` at root of my-app; strict mode enabled

## Gotchas
- **LF/CRLF warnings**: Windows line endings; don't commit normalized line endings to this repo as-is
- **SplitText**: GSAP's SplitText plugin used, not `split-type` package (package remains but superseded)
- **Image assets**: Required 15 images live in `public/images/`; helix gallery cycles through 10 helix images, 5 architecture card images
- **Mobile**: Pin disabled for ArchitectureSection; cards stack vertically; WebGL may be reduced on low-end devices
- **No tests**: No Jest/Vitest configured; verify visually or add `npm run lint` checks

## Pre-Commit Checklist
- Run `npm run lint` in `my-app/`
- Verify WebGL canvases don't leak (check that rAF pauses when scrolled out of view)
- Check GSAP ScrollTriggers: all use `start: "top X%"` conventions; verify triggers aren't overlapping incorrectly
- Don't remove `useWebGLVisibility` from WebGL components — it's critical for performance

## Entry Points
- App entry: `my-app/src/main.tsx` → `my-app/src/App.tsx`
- Sections: `my-app/src/sections/` (HeroSection, ArchitectureSection, etc.)
- WebGL: `my-app/src/components/MemoryGridCanvas.tsx`, `my-app/src/components/ParticleFieldCanvas.tsx`
- Hooks: `my-app/src/hooks/useLenis.ts`, `my-app/src/hooks/useWebGLVisibility.ts`
