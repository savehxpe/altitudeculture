# Altitude Culture — Design System & Narrative Architecture

## Brand Essence
Altitude Culture repositions Lesotho — the Kingdom in the Sky — as the world's most elevated event tourism destination. The brand bridges technical precision (service design) with raw emotional resonance (Moments of Joy).

## BETTER Model
- **Brand Personality**: Technical, Elite, Immersive, Grounded in place
- **Emotional Connection**: Awe, presence, transformation through altitude
- **Two-Way Interaction**: Guests co-create moments through sharing, bookmarking, and return advocacy

## Design Tokens

### Color System
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0b0c` | Deep background |
| `--surface` | `#121416` | Card surface |
| `--primary` | `#adc7ff` | Ice blue, interactive elements |
| `--secondary` | `#d4a373` | Warm amber, journey highlights |
| `--tertiary` | `#a1d494` | Sage green, growth indicators |
| `--accent` | `#4fc3f7` | Cyan, velocity/tech moments |

### Typography
- **Display**: Sora (headings, hero) — clean geometric, wide range
- **Body**: Hanken Grotesk — neutral, readable at all sizes
- **Technical**: JetBrains Mono — telemetry chips, labels, code

### Elevation & Glassmorphism
- No drop shadows. Depth created via:
  - `backdrop-filter: blur(16-24px)`
  - `border: 1px solid rgba(255,255,255,0.06)`
  - Parallax layer separation (bg / mid / fg)
  - Opacity: 0.6-0.85 overlay gradients

## Narrative Architecture

### Moment of Joy Structure (4-part story)
Each Moment follows the **IDEA narrative arc**:
1. **Context** — Where and when. The physical and cultural setting.
2. **Desire** — What the guest seeks. The emotional pull.
3. **Experience** — What actually happens. Sensory, visceral.
4. **Opportunity** — The commercial takeaway. How this becomes product.

### Story Chapters (4 Moments)
| Story | Location | Tag | Altitude |
|-------|----------|-----|----------|
| Last Descent — Afriski | Mahlasela Pass | Velocity | 3,222m |
| Sani Pass — The Threshold | Mokhotlong / KZN | Culture | 2,876m |
| Sky Without Borders | Sehlabathebe | Tech | 2,400m |
| Maluti — Pony Dream | Senqu Valley | Culture | 2,600m |

### Voice & Language
- **Soft language**: "Roof of Africa" not "high-altitude topography"
- **Personal touch**: Nods to Basotho herders, community-run treks
- **Evocative**: "Photons older than Homo sapiens" not "30-second exposure"
- **Direct**: "Book your slot. Elevate your event." — clear CTA

## Site Architecture (Immersive Scroll)

### Section Flow
1. **Hero** — Brand statement, full-viewport mountain
2. **The Kingdom** — Lesotho context + key statistics
3. **Moments of Joy** — Chapter header
4. **4 Story Sections** — One per Moment (full-viewport each)
5. **Event Journey** — 7-phase timeline (Arrival → Advocacy)
6. **Opportunity** — Market data + growth headroom
7. **IDEA Deck** — 4 investor slides
8. **CTA** — Join the ascent

### Interaction Design
- **Scroll-snapping**: `scroll-snap-type: y mandatory` — one section per scroll
- **Parallax**: 3 layers (bg image, mid gradient, fg gradient) moving at different speeds (0.15x scroll)
- **Reveals**: IntersectionObserver triggers slide+fade on journey steps, idea cards
- **Progress bar**: Top-of-page fills linearly with scroll depth
- **Section dots**: Fixed right navigation, highlights active section
- **Floating stats**: Animated counters appear after hero

### PWA Support
- Service worker caches HTML, CSS, JS, manifest
- Manifest sets standalone display, dark theme colors
- Offline-capable after initial load

## Investor Content (IDEA Deck Format)

### Slide 1: Inspiration & Illustration
A new category: destination experience platform for Africa's highest terrain.

### Slide 2: Details — Timeline of Interaction
8-step journey from Discovery to Advocacy.

### Slide 3: Evaluation — Key Success Factors
OTS (1.42M visitors), addressable market ($464B), WOM reach (×17), avg guest value ($1,200-$3,500).

### Slide 4: Budget — Top-line
Total seed: $1.8M - $3.4M across platform, infrastructure, marketing, operations, partnerships.

## Technical Stack
- **Frontend**: Vanilla HTML/CSS/JS (no framework)
- **Fonts**: Google Fonts (Sora, Hanken Grotesk, JetBrains Mono)
- **Icons**: Material Symbols
- **PWA**: Service Worker + Web Manifest
- **Storage**: localStorage (bookmarks)
- **Deployment**: Vercel (static), auto-deploy on git push
