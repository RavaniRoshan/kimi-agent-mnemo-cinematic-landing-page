# HyperFrames Quick Start

**Note**: This repo uses HyperFrames for video composition generation. The `mnemo-promo.html` composition demonstrates the pattern.

## Run the composition

```bash
cd my-app
npx hyperframes preview               # local preview
npx hyperframes validate              # check for errors
npx hyperframes render --output mnemo.mp4
```

## Key Files

- `design.md` — Brand colors, fonts, spacing (source of truth)
- `my-app/public/compositions/mnemo-promo.html` — 15s promotional video
- `references/` — HyperFrames workflow guides (optional reading)

## Variables

The `mnemo-promo` composition supports custom text via variables:

```bash
npx hyperframes render --output custom.mp4 \
  --variables '{"headline1":"STATELESS","headline2":"MNEMO","headline3":"INTELLIGENT"}'
```

## Gotchas

- All timelines must start `{ paused: true }`
- Every scene needs entrance animations (`gsap.from()`)
- Only final scene may exit (`gsap.to(... opacity 0)`)
- Transitions between scenes required (no jump cuts)
- `window.__timelines["mnemo-promo"]` must be registered
- Use `data-track-index` integers, never overlapping on same track
- Fonts declared in CSS are auto-embedded by compiler
