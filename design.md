# Design System — Mnemo Cinematic Brand

## Colors

- bg-primary: `#050505`
- bg-secondary: `#0a0a0a`
- text-primary: `#ffffff`
- text-secondary: `#a0a0a0`
- accent: `#3b82f6`
- accent-glow: `#60a5fa`
- tint-1: `#f43f5e`   # pink/rose for wave peaks
- tint-2: `#3b82f6`   # blue for mid-wave
- tint-3: `#10b981`   # emerald for valleys

## Typography

- display: "Instrument Serif", Georgia, serif
- body: "Geist", -apple-system, BlinkMacSystemFont, sans-serif
- mono: "Geist Mono", "SF Mono", monospace

## Spacing

- xs: 8px
- sm: 16px
- md: 24px
- lg: 40px
- xl: 80px

## Corner Radius

- sm: 8px
- md: 16px
- lg: 24px
- pill: 9999px

## Shadows / Depth

- flat: none
- subtle: 0 4px 20px rgba(0, 0, 0, 0.3)
- layered: 0 8px 40px rgba(59, 130, 246, 0.15)
- glow: 0 0 40px rgba(59, 130, 246, 0.4)

## Motion

- default-ease: "power2.out"
- dramatic: "expo.out"
- snappy: "back.out(1.7)"

## Constraints

- Dark-only theme (optimized for cinematic dark backgrounds)
- Avoid full-screen linear gradients (H.264 banding risk)
- Maintain 60px+ headline minimums
- Keep contrast ratios above 4.5:1 for body text
