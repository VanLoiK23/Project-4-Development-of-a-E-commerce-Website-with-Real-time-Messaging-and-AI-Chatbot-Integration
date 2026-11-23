<!-- BEGIN:nextjs-agent-rules -->
<!-- Next.js internal agent rules maintained by next dev -->
<!-- END:nextjs-agent-rules -->

# AI Agent Guidelines – Phone E-Commerce Frontend (`Web/`)

## 1. Project Overview
Specialized smartphone e-commerce platform built for Vietnamese consumers. Two core pillars:
1. **Browsing-history recommendation:** infers customer aspect priorities (battery, camera, performance...) from actions, then ranks phones.
2. **Aspect-Based Sentiment Analysis (ABSA):** evaluates real user reviews by aspect; ABSA scores feed the recommendation engine.
Frontend is standalone in `Web/`, replacing legacy JSP. Target users: analytical buyers, everyday upgraders, store admins.
Respond to the user in Vietnamese. Code, identifiers and comments in English; UI copy in Vietnamese.

## 2. Stack & Commands
- **Tech stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, ESLint.
- **Node.js:** v20.9+.
- **Commands (run inside `Web/`):**
  - `npm run dev` — development server (http://localhost:3000)
  - `npm run build` — production build
  - `npm run start` — run production build
  - `npm run lint` — ESLint (must exist in `package.json`; if missing, ask before adding the script)
  - `npx tsc --noEmit` — type check

## 3. Directory Conventions
**No `src/` directory.** Everything lives directly in `Web/`. Import alias `@/*` maps to the `Web/` root (verify in `tsconfig.json`).
```
app/                        # Next.js App Router: routes and layouts only
├─ layout.tsx · globals.css · not-found.tsx · error.tsx
├─ (shop)/                  # Storefront (Header + Footer + Bottom Nav)
├─ (auth)/                  # Login, register (+ /register/verify OTP), forgot/reset password (compact layout)
├─ (account)/account/       # Customer account
└─ admin/                   # Admin console
components/
├─ ui/                      # Primitives: Button, TextField, Chip, Skeleton, Alert, Tabs...
├─ layout/                  # AppShell, Header, Footer, BottomNav, Container, ConsentBanner
└─ {domain}/                # home/, product/, recommendation/, absa/, auth/, admin/
api/                      # Typed data-access functions (never inside app/: app/api = Route Handlers)
mocks/                      # Mock fixtures, imported ONLY by api/
hooks/                      # Client hooks (use-cart.ts, use-preferences.ts)
lib/                        # formatters.ts, absa.ts, validation.ts, safe-redirect.ts, consent.ts, cn.ts
styles/tokens.css           # Verbatim :root block from design-tokens.md; imported by app/globals.css
types/                      # product.ts, absa.ts, order.ts, auth.ts
public/images/              # Local placeholders; real images later as WebP
```
- **Naming:** components `PascalCase.tsx` (`ProductCard.tsx`); utilities, hooks, types `kebab-case.ts` (`use-cart.ts`). Routes use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.

## 4. Documentation Map
All design docs are in `docs/design/moodboard/`.
| When you need to... | Consult |
| :--- | :--- |
| Colors, CSS variables, typography, shadows, breakpoints, Tailwind mapping | `design-tokens.md` |
| Build or style a reusable component, variant or state | `component-guidelines.md` |
| Implement a page's layout, sections or flows | `page-design-guidelines.md` (§S1–S24, §A1–A13) |
| Route URL, priority (P0/P1/P2), render mode (ISR/SSR/CSR) | `frontend-pages.md` |
| Architectural reasons and resolved ambiguities | `design-decisions.md` |
| Brand identity, 60-30-10 rule, accessibility | `design-system.md` |
| Task prompts per page (home, auth...) | `docs/agent-prompts/` |

## 5. Source-of-Truth Hierarchy
When docs conflict, apply this order:
`design-decisions.md` > `design-tokens.md` > `design-system.md` > `component-guidelines.md` > `page-design-guidelines.md` > `frontend-pages.md`
A task prompt may add flows the docs lack (for example OTP); report every conflict. **If ambiguity remains: STOP and ask the user. Never guess.**

## 6. Non-Negotiable Design Rules
- **No raw HEX/rgb in components or pages.** Use semantic utilities (`bg-canvas`, `bg-surface`, `border-line`, `text-ink`, `text-ink-2`, `bg-ai-soft`, `text-ai-ink`, `text-pos`, `bg-danger-soft`...) or `var(--token)`. Raw values live only in `styles/tokens.css`. Do not use default Tailwind palette classes (`bg-amber-500`, `text-red-600`...).
- **Three isolated color layers:**
  1. Amber (`brand-accent*` / `ai*`): AI personalization only (Match Score, recommendation badges, preference chips, slider thumbs, AI buttons).
  2. ABSA (`absa-*` / `pos`, `neu`, `neg`): sentiment data only.
  3. UI feedback (`ui-*` / `success`, `danger`, `warn`, `info`, `sale`): all transactional states (form errors, low stock, coupons, discounts).
- **Amber restrictions:** never for text under 18px (use `text-ai-ink`), warnings, focus rings, nav active state. Amber-filled buttons use charcoal text (`text-ink`). Auth pages use no amber.
- **ABSA display:** always numeric score plus text label ("Tích cực", "Trung lập", "Tiêu cực"), never color alone. Aggregate thresholds: >= 4.0 positive, 3.0–3.9 neutral, < 3.0 negative (use `getSentimentLevel` in `lib/absa.ts`).
- **Configurable aspects:** aspect keys and labels come from data (`aspectKey`, `displayName`, `score`, `sentiment`). Never hardcode an aspect list in UI components.
- **Match Score honesty:** "Độ phù hợp %" appears ONLY with tracking consent and enough history. Otherwise show non-personalized lists without %.
- **No auto-popups.** Modals/drawers are user-initiated. The consent banner never blocks interaction. Terms acceptance at registration is separate from tracking consent and never pre-checked.
- **Icons:** Lucide line icons, 2px stroke, never emojis. Decorative icons `aria-hidden="true"`; icon-only buttons need a Vietnamese `aria-label`.
- **Focus ring:** `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;`, inverse token on dark surfaces. Never remove it.
- **Touch and mobile-first:** touch targets >= 44x44px; design from 375px; below 1024px (`lg`) use bottom nav and compact header (auth pages use a compact layout without bottom nav unless the docs say otherwise).
- **Three data states:** every data container handles Loading (warm skeleton token), Empty, Error (with "Thử lại"). Pages without lists (auth) must still cover loading and error.
- **Warm shadows and motion:** warm charcoal elevation tokens, never pure black. Honor `prefers-reduced-motion`.
- **Admin stock is read-only:** variant stock changes only via documents (phiếu nhập, phiếu xuất, điều chỉnh kho).
- **No seeding/credibility detection** (out of scope); render no seeding warnings.
- **Vietnamese UI copy:** factual, direct, no marketing hype. Prices `24.990.000 ₫`.

## 7. Next.js Rules
- Default to Server Components. Add `"use client"` only to the smallest leaf needing state, effects, handlers or browser APIs (tabs, drawer, rail scroll, forms, consent banner).
- `page.tsx` and `layout.tsx` stay Server Components. `params` and `searchParams` are Promises: `await` them.
- Never read `window`, `localStorage` or `sessionStorage` during render; use `useEffect` or handlers, wrapped in try/catch.
- Use `next/link`, `next/image`, `next/font`. No `<a href>` for internal routes; no bare `<img>` for content images; never nest `<a>` in `<a>`.
- Props from server to client components must be serializable (dates as ISO strings).
- Every page exports Vietnamese `metadata`; auth and token pages set `robots: { index: false }`.
- `?state=` preview params work only when `process.env.NODE_ENV !== "production"`.
- Components never import `mocks/`. `api/` functions return `{ ok: true, data }` or `{ ok: false, error }`.
- Do not create `app/api/` for the data layer. Never store tokens in `localStorage`.

## 8. Coding & Accessibility Conventions
- **Components:** explicit TypeScript prop interfaces; split files over ~250 lines; separate presentational UI from data containers; no business logic in JSX.
- **Data access:** Server Components call `api/` directly; Client Components receive data via props or call `api/` inside event handlers. Switching to Spring REST must require editing only `api/` (add mappers there), never components.
- **Formatting:** `formatVND(24990000)` -> `24.990.000 ₫` and `formatDate(d)` -> `dd/MM/yyyy`, centralized in `lib/formatters.ts`.
- **Accessibility baseline:** semantic landmarks, exactly one `<h1>` per page, sequential headings, descriptive `alt`, full keyboard navigation, form labels always visible, errors via `aria-describedby`/`role="alert"`.

## 9. Page Implementation Workflow
1. **Read specs:** the page section in `page-design-guidelines.md` plus related component guidelines.
2. **Draft plan:** target files, component tree (mark Server/Client), mock data shapes, edge cases, doc conflicts.
3. **Approval checkpoint:** for the first page or major layout changes, wait for user confirmation.
4. **Implement:** modular TypeScript components with Tailwind token classes; reuse existing components.
5. **Verify and report:** run checks, submit the report.

## 10. Definition of Done
- `npm run lint`, `npm run build` and `npx tsc --noEmit` pass.
- No raw HEX/rgb or default Tailwind palette classes: `grep -rnE "#[0-9A-Fa-f]{6}|rgba?\(" components app` is empty (outside `styles/tokens.css`).
- No `"use client"` in `page.tsx`/`layout.tsx`; no hydration warnings in the console.
- Layouts verified at 375, 768, 1024, 1280, 1536px without horizontal scroll.
- Loading, Empty (where applicable) and Error states implemented and verified.
- A11y baseline met (landmarks, headings, alt, focus rings, keyboard).
- Report lists every place amber is used.

## 11. Installed Skills & Precedence
Skills in `.agents/`:
- `vercel-react-best-practices`: use when writing Server Components, Suspense boundaries, data loading.
- `web-design-guidelines`: use to audit accessibility, keyboard support, interface quality.
- `ui-ux-pro-max`: use only for accessibility and UX heuristics, never to pick colors, fonts or style.
- `frontend-design`: layout inspiration only; skip bold or distinctive styling that conflicts with the design system.
**Precedence:** if a skill contradicts this project's design system, `docs/design/moodboard/` always wins. Skills must not add dependencies or change tokens.

## 12. Do-Not List
- Do not install dependencies outside the approved list. **Approved:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss` (+ `@tailwindcss/postcss`), `lucide-react`, `clsx`, `eslint`, `eslint-config-next`, `@types/*`. Anything else (form or state libraries, UI kits, tailwind-merge) -> ask first.
- Do not modify `Backend/` or `docs/`.
- Do not commit or push unless explicitly told.
- Do not create pages outside the prompt's scope.
- Do not use external image URLs (local SVG/WebP placeholders only).
- Do not modify approved design tokens.

## 13. Task Completion Report Template
```markdown
### Task Summary
- **Completed:** [what was implemented]
- **File Tree:** [created and modified files]
- **Decisions & Assumptions:** [key choices, doc conflicts found]
- **Amber usage:** [every place amber is used]
- **Pending / Next Up:** [next steps]
- **Verification Commands:** [commands run and results]
- **Awaiting User Confirmation:** [questions needing approval]
```