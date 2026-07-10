# Refactor C Design System

## Source of truth

Phase 2 establishes the foundation in `tailwind.config.ts` and `src/app/globals.css`. Tailwind semantic utilities are the default for components; CSS custom properties support global browser styles that cannot use utilities. Both token sets intentionally use the same values.

Use a semantic role when it exists. Raw brand tokens remain compatibility aliases. The Phase 6 repository-wide usage audit found active consumers across landing, menu, booking, shell, utility pages, and tests, so no alias is currently eligible for removal.

## Color roles

| Role | Value | Use |
|---|---|---|
| `canvas` | `#F7F1E7` | Main page background |
| `surface` / `elevated` | `#FFFDF8` / `#FFFFFF` | Cards and raised layers |
| `inverse` | `#211C18` | Dark surfaces |
| `text-primary` / `text-secondary` / `text-inverse` | `#1F1A17` / `#6F6258` / `#FFFDF8` | Hierarchical foreground text |
| `action-primary` / `action-secondary` / `action-tertiary` | Tomato / olive / charcoal | Primary, alternative, and neutral actions |
| `border` / `focus` | `#D8C8B4` / `#4F6F3E` | Boundaries and visible keyboard focus |
| `status-success`, `status-warning`, `status-error`, `status-disabled` | Existing status palette | State indication; pair with text or icon, never color alone |

The required action foreground is `text-inverse`. The global focus outline is olive on canvas and surface. Status colors are accents, not small body-text colors; use a semantic text role for explanatory text.

## Type and layout scales

| Role | Tailwind token | Guidance |
|---|---|---|
| Display, page title, section title | `text-display`, `text-page-title`, `text-section-title` | `font-display`; fluid scale, used once per hierarchy level |
| Card title, body, label, caption, overline | `text-card-title`, `text-body`, `text-label`, `text-caption`, `text-overline` | Use the smallest role that preserves hierarchy; pair overline with `uppercase` when appropriate |
| Content / reading / narrow | `max-w-content`, `max-w-reading`, `max-w-narrow` | 72rem / 42rem / 32rem maximum readable widths |
| Gutter / section / grid | `px-gutter`, `py-section-y`, `gap-section-gap`, `gap-grid-gap` | Responsive page rhythm; do not invent section spacing first |
| Controls | `min-h-control-sm`, `min-h-control`, `min-h-control-lg` | 40px / 48px / 56px touch targets |
| Icons | `size-icon-xs`, `size-icon-sm`, `size-icon`, `size-icon-lg`, `size-icon-xl` | 14px / 16px / 20px / 24px / 32px; choose the smallest size that remains recognizable, and provide an accessible name when the icon is interactive |
| Radius | `rounded-control`, `rounded-card`, `rounded-panel` | Controls, cards, and grouped panels |
| Elevation | `shadow-small`, `shadow-medium`, `shadow-large` | Resting, raised, and prominent surfaces |

Spacing follows Tailwind's existing 4px base scale. Prefer its standard values for local alignment; reserve named foundation values for page-level rhythm and repeated patterns.

## Motion, responsive, and accessibility rules

- Use `duration-instant`, `duration-fast`, `duration-normal`, or `duration-slow` with `ease-standard` or `ease-emphasized`; motion must not communicate essential state alone.
- Preserve `prefers-reduced-motion`: global CSS reduces animation and transition duration and disables smooth scrolling.
- Preserve `:focus-visible` rather than `:focus` for the 2px focus ring and 3px offset. Do not remove an element's native focusability.
- Keep safe-area padding, native date-control sizing, and anchor scroll margins from `globals.css`.
- Test both EN and VI content at narrow viewports before introducing a one-off width, font size, or spacing value.

## Compatibility migration

| Legacy alias retained | Semantic replacement for new work | Removal criterion |
|---|---|---|
| `cream`, `paper` | `canvas` | No repository consumers remain |
| `porcelain` | `surface` | No repository consumers remain |
| `charcoal` | `inverse` or `text-primary` by intent | Each use classified and migrated |
| `tomato`, `ember` | `action-primary` | No repository consumers remain |
| `olive`, `basil` | `action-secondary` or `focus` by intent | Each use classified and migrated |
| `borderWarm` | `border` | No repository consumers remain |
| `success`, `warning`, `error`, `disabled` | `status-*` | No repository consumers remain |
| `shadow-soft`, `shadow-hover` | Named elevation only when visual intent matches | Usage proof and approved migration plan |

## Extension rules

1. Add a semantic token only when it has a defined role and at least two expected consumers or a global responsibility.
2. Do not encode feature, page, or brand-campaign names in foundation tokens.
3. Do not remove or rename a legacy token before a repository-wide search proves compatibility.
4. Migrate a component only inside an authorized phase; do not perform repository-wide token replacement as incidental cleanup.

## Phase 3 primitive proposal

Phase 2 approves the following exact candidate filenames under `src/components/ui/`: `Container.tsx`, `Section.tsx`, `Stack.tsx`, `Button.tsx`, `IconButton.tsx`, `Badge.tsx`, `Card.tsx`, `Field.tsx`, `StatusMessage.tsx`, `PageHeader.tsx`, `EmptyState.tsx`, `LoadingState.tsx`, and `index.ts`.

This is a candidate list, not permission to create every file. Phase 3 must select only the primitives supported by two named consumers or a shell-wide responsibility, define their semantic variants, and preserve native interaction and focus behavior.

## Phase 3 selected primitives

Phase 3 implements only these primitives:

| Primitive | File | Primary consumers |
|---|---|---|
| Container | `src/components/ui/Container.tsx` | `src/components/landing/Header.tsx`, `src/components/layout/Footer.tsx` |
| Stack | `src/components/ui/Stack.tsx` | `src/components/layout/Footer.tsx`, `src/components/landing/header/HeaderMobileDrawer.tsx` |
| Button | `src/components/ui/Button.tsx` | `src/components/landing/Header.tsx`, `src/components/landing/header/HeaderMobileDrawer.tsx`, `src/components/layout/BackToTopButton.tsx` |

The primitives stay deliberately small: semantic variants, native elements, and shared focus styling only. No page-specific content, card grid system, or broad component library abstraction is introduced in this phase.

## Current extension and rollback guidance

- Import the implemented primitives from `@/components/ui`; do not deep-import them or add a new primitive without two concrete consumers or a shell-wide responsibility.
- Keep native element semantics, visible focus, disabled behavior, accessible names, safe-area handling, and reduced-motion behavior when extending a primitive.
- Prefer semantic tokens for new work. Existing legacy aliases are compatibility contracts until a future authorized migration records every consumer and supplies cross-route screenshot evidence.
- Roll back by reviewed phase boundary: foundations (Phase 2), primitives and shell consumers (Phase 3), landing/booking presentation (Phase 4A), menu/supporting pages (Phase 4B), and responsive/accessibility stabilization (Phase 5). Never use a destructive repository reset as rollback guidance.

