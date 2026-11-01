<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Project: StudioSpace

StudioSpace is a peer-to-peer creative workspace and production studio sharing
platform. Users list creative spaces (photography cyc walls, cinema sound stages,
podcast lounges, music recording suites, art workshops) and others discover,
filter, inspect availability, and reserve studio slots with transparent pricing
and real-time booking management.

### Tech Stack
- **Framework**: Next.js 16.4 (App Router, React 19, Turbopack)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **UI Library**: shadcn/ui (base-nova style) with @base-ui/react primitives
- **Icons**: Lucide React
- **Animations**: tw-animate-css
- **Fonts**: DM Sans (headings) / Public Sans (body)
- **Language**: TypeScript (strict mode)

---

## Environment & API Configuration

- All API base URLs MUST be read from `process.env.NEXT_PUBLIC_API_URL`.
- Never hardcode API URLs in components or utilities.
- Example usage:
  ```ts
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/studios`);
  ```
- The `.env` file defines: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- For production, this will be swapped to a production URL — no code changes needed.

---

## Data Architecture — No Hardcoded API Data

### Golden Rule
**NEVER hardcode, embed, or store any data in the frontend that is meant to be
fetched from the backend API.** This includes but is not limited to:

- User profiles, authentication state, user preferences
- Studio listings, studio details, studio availability
- Booking records, booking status, booking history
- Pricing data, plan details, feature lists tied to studios
- Reviews, ratings, testimonials
- Categories, tags, or filters that are database-driven
- Any dynamic counts (e.g., "2,400+ creators booked")

### What IS allowed on the frontend
The following MAY be hardcoded because they are **UI concerns**, not database records:
- Static marketing copy (hero tagline, section labels like "HOW IT WORKS")
- Navigation link labels and routes
- UI placeholder text and empty-state messages
- Form field labels, validation messages
- Step-by-step instructional content (e.g., "Browse & Choose → Pick Your Time → …")
- Icon choices, illustration references
- Design tokens, spacing, colors (already in globals.css)
- Feature comparison matrices for static pricing tiers (only if explicitly
  confirmed as static; otherwise assume API-driven)

### Component Design Pattern
Components that display API data MUST:
1. Accept data via **props** or fetch it via a **custom hook / server action**.
2. Render **loading skeletons** while data is being fetched.
3. Render **error states** when the fetch fails.
4. Render **empty states** when no data is returned.
5. Never assume data shape — always handle `undefined`/`null` gracefully.

```tsx
// ✅ CORRECT — component receives data via props
interface StudioCardProps {
  studio: Studio;
}
function StudioCard({ studio }: StudioCardProps) {
  return <div>{studio.name}</div>;
}

// ❌ WRONG — hardcoded studio data
function StudioCard() {
  const studio = { name: "Photography Studio", price: 89 }; // NEVER DO THIS
  return <div>{studio.name}</div>;
}
```

### No Mock Data — API-First Workflow
- **Do NOT create mock data files.** No `src/data/`, no `mock-*.ts` files,
  no placeholder arrays of studios, users, bookings, or any other
  API-sourced entities.
- The backend API will be ready with real data loaded BEFORE UI components
  are built. Components will be wired to live endpoints from the start.
- If a component needs data, **wait for the user to provide the API endpoint
  info** (URL path, method, request/response shape). Do NOT guess or invent
  API contracts.
- Until endpoint info is provided, build the component's **layout, styling,
  and static UI shell only** — leave data-dependent rendering as a clearly
  marked TODO or accept data via props with a typed interface.

### API Integration Guidelines
- API base URL always from `process.env.NEXT_PUBLIC_API_URL`.
- Do NOT invent or guess API endpoint paths. Wait for explicit endpoint info.
- When endpoint info is provided, create a dedicated fetch utility or hook in
  `src/lib/api/` or `src/hooks/` respectively.
- Use TypeScript interfaces in `src/types/` to type all API responses.

---

## Design System — Typography

### Fonts
- **Headings**: `font-heading` → DM Sans (variable: `--font-heading`)
- **Body/UI**: `font-sans` → Public Sans (variable: `--font-sans`)

### Heading Hierarchy
| Level | Tailwind Class | Use |
|-------|---------------|-----|
| H1 (Hero) | `text-5xl md:text-6xl lg:text-7xl font-heading font-bold` | Hero headlines only |
| H2 (Section) | `text-3xl md:text-4xl lg:text-5xl font-heading font-bold` | Section titles |
| H3 (Card/Sub) | `text-xl md:text-2xl font-heading font-semibold` | Card titles, subsection heads |
| H4 | `text-lg font-heading font-semibold` | Minor headings |
| Body | `text-base font-sans` | Default body text |
| Small | `text-sm font-sans` | Captions, meta info |

### Heading Accent Pattern
Many headings use a two-tone style:
- Regular words in `text-foreground` (dark)
- Key phrase in `text-accent italic` (warm brown)
- Example: "Premium **_Creative Studios_** Built For Creators Who Value Quality."

### Section Labels
Uppercase, tracked, small, with a dot prefix:
```html
<span class="text-xs uppercase tracking-[0.2em] text-muted-foreground">• OUR SPACES</span>
```

---

## Design System — Colors & Theming

All colors are defined as CSS custom properties in `globals.css` under `:root`
(light) and `.dark` (dark mode). Components MUST use these variables via
Tailwind classes — never hardcode hex values.

### Light Mode Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FFFFFF` | Page background |
| `--background-alt` | `#F5F2EE` | Alternate section background (cream) |
| `--foreground` | `#1A1A1A` | Primary text |
| `--muted-foreground` | `#6B6B6B` | Secondary/body text |
| `--accent` | `#8B6914` | Italic heading accent, highlights |
| `--accent-foreground` | `#FFFFFF` | Text on accent backgrounds |
| `--primary` | `#3D2E1C` | Buttons, icons, interactive elements |
| `--primary-foreground` | `#FFFFFF` | Text on primary backgrounds |
| `--secondary` | `#F5F2EE` | Secondary button fills, tags |
| `--secondary-foreground` | `#3D2E1C` | Text on secondary |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `#1A1A1A` | Card text |
| `--card-highlight` | `#1C1410` | Highlighted/featured card bg |
| `--card-highlight-foreground` | `#F5F2EE` | Text on highlighted cards |
| `--border` | `#E5E0DA` | Borders, dividers |
| `--ring` | `#8B6914` | Focus rings |
| `--destructive` | `#DC2626` | Delete/error actions |
| `--success` | `#4A7C4F` | Checkmarks, confirmations |
| `--dark-section` | `#1C1410` | Dark section backgrounds |
| `--dark-section-foreground` | `#F5F2EE` | Text in dark sections |

### Dark Mode Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#121010` | Page background |
| `--background-alt` | `#1C1410` | Alternate section background |
| `--foreground` | `#F5F2EE` | Primary text |
| `--muted-foreground` | `#A89F94` | Secondary text |
| `--accent` | `#C9A44C` | Brighter warm gold for visibility |
| `--accent-foreground` | `#1A1A1A` | Text on accent |
| `--primary` | `#C9A44C` | Warm gold buttons |
| `--primary-foreground` | `#1A1A1A` | Text on primary |
| `--secondary` | `#2A2220` | Secondary fills |
| `--secondary-foreground` | `#F5F2EE` | Text on secondary |
| `--card` | `#1E1A17` | Card backgrounds |
| `--card-foreground` | `#F5F2EE` | Card text |
| `--card-highlight` | `#2A2220` | Featured cards |
| `--card-highlight-foreground` | `#F5F2EE` | Text on featured cards |
| `--border` | `#3D3530` | Borders |
| `--ring` | `#C9A44C` | Focus rings |
| `--destructive` | `#EF4444` | Brighter red for dark bg |
| `--success` | `#6ABF6E` | Brighter green for dark bg |
| `--dark-section` | `#0D0B09` | Deeper dark sections |
| `--dark-section-foreground` | `#F5F2EE` | Text in dark sections |

### Theme Toggle
- Theme switching is done via a toggle button in the navbar.
- The toggle adds/removes the `.dark` class on `<html>`.
- Every UI component MUST work in both light and dark modes.
- Use semantic color classes (e.g., `bg-background`, `text-foreground`), never raw hex.

---

## Design System — Component Patterns

### Buttons
| Type | Style | Usage |
|------|-------|-------|
| **CTA (Primary)** | Pill-shaped (`rounded-full`), `bg-primary text-primary-foreground`, with trailing arrow icon | Hero CTA, main actions |
| **Form Submit** | Same as CTA but standard radius (`rounded-lg`) | Login, register, booking forms |
| **Secondary/Outline** | `border-border bg-background text-foreground rounded-full` | Secondary actions, "Explore Packages" |
| **Ghost** | No border, subtle hover bg | Navbar links, minor actions |
| **Destructive** | `bg-destructive/10 text-destructive` | Delete, cancel, remove |
| **Edit/Update** | Secondary style with edit icon | Inline edit actions |

### Cards
- ALL cards in a grid MUST be equal height and width (use `grid` with `h-full` on cards).
- Border radius: `rounded-2xl` (16px).
- Light mode: white bg, subtle shadow (`shadow-sm`), warm-toned border on hover.
- Dark mode: `bg-card` with slightly lighter border.
- Highlighted/featured card: dark bg with cream text.
- Consistent internal padding: `p-6`.

### Images
- Uniform aspect ratios within each section (use `aspect-video` or `aspect-[4/3]`).
- `object-cover` to prevent distortion.
- Rounded top corners when inside cards: `rounded-t-2xl`.
- All images use `next/image` with proper `width`, `height`, and `alt`.

### Spacing
- Section vertical padding: `py-16 md:py-24`.
- Container max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Card grid gap: `gap-6 md:gap-8`.
- Between heading and content: `mb-8 md:mb-12`.

### Social Icons
- Use the new **X logo** (not the old Twitter bird).
- Lucide React provides the X icon as needed, or use a custom SVG.

---

## Design System — Layout & Responsiveness

### Breakpoints (Tailwind defaults)
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Default | < 640px | Single column, stacked |
| `sm` | ≥ 640px | Minor adjustments |
| `md` | ≥ 768px | 2-column grids, side-by-side |
| `lg` | ≥ 1024px | 3-column grids, full layout |
| `xl` | ≥ 1280px | Max-width container, refined spacing |

### Responsive Rules
1. **Mobile-first**: Write base styles for mobile, add breakpoint overrides.
2. **Cards**: 1 column on mobile → 2 on `md` → 3 on `lg`.
3. **Hero text**: Scale down heading sizes on mobile.
4. **Navigation**: Hamburger menu on mobile, full nav on `lg`.
5. **Images**: Full-width on mobile, contained in grids on larger screens.
6. **Footer**: Stack columns vertically on mobile.

---

## Code Standards

### File Organization
```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── globals.css         # Global styles & CSS custom properties
│   ├── layout.tsx          # Root layout (fonts, theme provider)
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Input…)
│   ├── shared/             # Reusable composed components (Navbar, Footer…)
│   └── sections/           # Page sections (HeroSection, CategoriesSection…)
├── lib/
│   ├── utils.ts            # Utility functions (cn, etc.)
│   └── constants.ts        # Shared constants, mock data references
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript interfaces & types
```

### Naming Conventions
- **Components**: PascalCase (`HeroSection.tsx`, `StudioCard.tsx`)
- **Utilities/hooks**: camelCase (`useTheme.ts`, `formatPrice.ts`)
- **CSS variables**: kebab-case with `--` prefix (`--background-alt`)
- **Files**: kebab-case for non-component files (`studio-types.ts`)

### Component Rules
1. Every component must be a **functional component** using TypeScript.
2. Props must be typed with a dedicated `interface` or `type`.
3. Use `cn()` from `@/lib/utils` for conditional class merging.
4. Use semantic HTML elements (`<section>`, `<nav>`, `<article>`, `<footer>`).
5. All interactive elements must have proper `aria-*` attributes.
6. All `<img>` must use `next/image` with `alt` text.
7. Avoid inline styles — use Tailwind utility classes or CSS custom properties.
8. Never hardcode colors — always reference design tokens via Tailwind classes.
9. Every component must render correctly in both light and dark modes.
10. Keep components small and composable — extract sub-components when complexity grows.

### CSS Custom Properties in globals.css
- ALL theme-related colors, shadows, radii, and spacing values MUST be
  defined as CSS custom properties in `globals.css`.
- Components consume these via Tailwind's `var()` integration or direct `var()` references.
- This ensures future theme modifications require changing only `globals.css`.

---

## Accessibility & Performance

- Minimum color contrast ratio: 4.5:1 for body text, 3:1 for large text.
- All interactive elements must be keyboard-accessible.
- Use `focus-visible` for focus indicators (already configured in shadcn Button).
- Images must have descriptive `alt` text.
- Use semantic headings in order (h1 → h2 → h3, no skipping).
- Lazy-load below-the-fold images with `loading="lazy"`.
- Prefer Server Components where possible (default in Next.js App Router).
- Use `"use client"` only when client-side interactivity is required.