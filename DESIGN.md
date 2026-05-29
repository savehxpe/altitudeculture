# Altitude Culture — Design System & Movement Architecture

## Brand Essence
Altitude Culture is building Lesotho's first Culture-Sports Festival in African snow. A movement that brings together snow, sport, Basotho culture, music, tourism, youth jobs, and local business. Not a pitch — a movement.

## The Core Message
Lesotho's High Mountain Kingdom. The Maluti Mountains at 3,000 meters. Snow in winter. Culture all year. A festival that puts community first and brings the world up.

## BETTER Model
- **Brand Personality**: Bold, community-driven, action-oriented, rooted in place
- **Emotional Connection**: Pride, belonging, awe, the energy of snow and music at altitude
- **Two-Way Interaction**: Guests become ambassadors. Share. Return. Bring more people.

## Design Tokens

### Color System
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0b0c` | Deep background |
| `--surface` | `#121416` | Card surface |
| `--primary` | `#adc7ff` | Ice blue, interactive elements |
| `--secondary` | `#d4a373` | Warm amber, arrival & heritage |
| `--tertiary` | `#a1d494` | Sage green, impact indicators |
| `--accent` | `#4fc3f7` | Cyan, snow & speed moments |

### Typography
- **Display**: Sora (headings, hero) — clean geometric
- **Body**: Hanken Grotesk — neutral, readable at all sizes
- **Technical**: JetBrains Mono — tags, labels, data points

### Elevation & Glassmorphism
- No drop shadows. Depth via:
  - `backdrop-filter: blur(16-24px)`
  - `border: 1px solid rgba(255,255,255,0.06)`
  - Parallax layer separation (bg / mid / fg)
  - Opacity gradients (0.6-0.85)

## Narrative Architecture

### Four Experiences (The "Why to Come")
| Experience | Location | Tag | Altitude |
|------------|----------|-----|----------|
| Afriski — Snow Playground | Mahlasela Pass | Snow & Speed | 3,222m |
| Sani Pass — The Gateway | Mokhotlong Border | Arrival & Threshold | 2,876m |
| Sehlabathebe — The Quiet | National Park | Night & Sky | 2,400m |
| Basotho Pony — The Original Way | Senqu Valley | Heritage & Journey | 2,600m |

Each experience follows a simple structure:
1. **THE SCENE** — Where you are, what's around you
2. **THE FEELING** — What it does to you
3. **THE FESTIVAL** — How it becomes part of the event
4. **THE IMPACT** — Why it matters for the community

### Voice & Language Principles
- **Simple**: "Snow in winter. Culture all year." — short, clear sentences
- **Active**: "We are building." Not "We plan to build."
- **Community-first**: "Money in the hands of the people." Not "market penetration"
- **No borrowed terms**: "High Mountain Kingdom" not "Roof of Africa"
- **Action over education**: We fill gaps by deploying, not by explaining them

## Five Solutions (The "What We Fix")

| # | Solution | Core Idea |
|---|----------|-----------|
| 1 | Making New Experiences | Scenery becomes activity. Visitors stay longer. |
| 2 | Putting Lesotho on the Map | Digital + festival media. World discovers the Kingdom. |
| 3 | World-Class Service | Youth trained as Basotho Hospitality ambassadors. |
| 4 | Protecting Our Roots | Culture is the foundation, not an extra. |
| 5 | Supporting Local Winners | 90% of impact stays in the community. |

## Site Architecture (Immersive Scroll)

### Section Flow (11 sections)
1. **Hero** — Brand statement, full-viewport mountain
2. **The Movement** — What we are building
3. **The Experience** — Section header for 4 ways to move
4. **Afriski** — Snow & speed
5. **Sani Pass** — Arrival & threshold
6. **Sehlabathebe** — Night & sky
7. **Basotho Pony** — Heritage & journey
8. **The Festival Journey** — 7-phase timeline
9. **Problem + Solutions** — 5 solutions cards
10. **Action Plan** — Why, plan, numbers, ask
11. **CTA** — Join the movement

### Interaction Design
- **Scroll-snapping**: One section per scroll
- **Parallax**: 3 layers moving at different speeds (0.15x scroll)
- **Reveals**: IntersectionObserver triggers slide+fade
- **Progress bar**: Top-of-page fill with scroll depth
- **Section dots**: Fixed right navigation, active highlight
- **Share + bookmark**: On each experience card

### PWA Support
- Service worker caches all static assets
- Manifest sets standalone display, dark theme
- Offline-capable after initial load

## Technical Stack
- **Frontend**: Vanilla HTML/CSS/JS (no framework)
- **Fonts**: Google Fonts (Sora, Hanken Grotesk, JetBrains Mono)
- **Icons**: Material Symbols
- **PWA**: Service Worker + Web Manifest
- **Storage**: localStorage (bookmarks)
- **Deployment**: Vercel (static, auto-deploy on git push)
