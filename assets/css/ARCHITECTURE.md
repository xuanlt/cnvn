# CSS Architecture

`styles.css` remains a single stylesheet so the current static HTML pages keep a simple loading model and existing cascade behavior.

The adapted design-system source of truth is `design.md`. The original visual
reference is `/Users/xuanlt/Works/Freelancer/connectvietnam_html/design.md`.

## Layer order

1. **Foundations**
   - Design tokens in `:root`
   - Reset and element defaults
   - Typography and small utilities
2. **Site shell and shared components**
   - Fixed header/footer
   - Navigation, links, cards, shared interactions
3. **Home**
   - Desktop horizontal stage
   - Mobile home flow
4. **Subpages**
   - Shared subpage shell
   - Page-specific blocks such as About and Contact
5. **Responsive**
   - Tablet: `max-width: 1023px`
   - Mobile: `max-width: 767px`
   - Small mobile: `max-width: 480px`

## Shared grid contract

The grid follows the reference project:

| Viewport | Columns | Gap | Horizontal padding |
| --- | ---: | ---: | ---: |
| Desktop | 12 | 24px | 36px |
| Tablet | 8 | 20px | 32px |
| Mobile | 4 | 16px | 20px |

Use these tokens instead of page-specific grid values:

```css
--grid-columns
--grid-gap
--grid-padding
```

Standard section layout must keep layout wrappers separate from component classes:

```html
<section class="content-section">
  <div class="container">
    <div class="row">
      <div class="col col-6 col-md-4 col-sm-4">
        <div class="content-block">...</div>
      </div>
      <div class="col col-6 col-md-4 col-sm-4">
        <div class="content-block">...</div>
      </div>
    </div>
  </div>
</section>
```

- Use `section > .container or .container-fluid > .row > .col` for standard page sections.
- Use `.row` and `.col-*`, `.col-md-*`, `.col-sm-*` for grid placement.
- Do not assign `display: grid`, `grid-template-columns`, or `grid-column` directly to component classes.
- The Home horizontal stage keeps its dedicated grid system.

## Design token contract

- Use `--font-display` for headings, nav labels, kickers, and CTAs.
- Use `--font-sans` for body copy, descriptions, metadata, and UI.
- Use only `.text-sm`, `.text-body`, `.text-leading`, heading elements
  `h1`–`h6`, and heading utilities `.h1`–`.h6` for typography sizing.
- Avoid arbitrary `font-size` declarations in component styles. Route text size
  through existing typography tokens, semantic text classes, heading utilities,
  or component classes already mapped to tokens; add a new token only for a
  repeated, intentional type level.
- Prefer semantic colors: `--color-text`, `--color-text-muted`,
  `--color-text-meta`, `--color-primary`, and `--color-primary-bright`.
- `.container` is centered and capped by `--grid-max`.
- Standard section spacing uses `--section-space` with responsive overrides.

## Page block rules

- Scope page-specific styles under a page block such as `.about-*`, `.contact-*`, or `.home-*`.
- Keep component visual styles in the page section and breakpoint overrides in the responsive section.
- Prefer shared tokens for color, typography, spacing, and grid behavior.
- Avoid page-specific fixed widths when a column span or `clamp()` expresses the design.
- Add new breakpoint values only when the existing desktop/tablet/mobile contract cannot represent the design.

## Reference project

Use `/Users/xuanlt/Works/Freelancer/connectvietnam_html/src/style.css` as the reference for grid strategy, responsive behavior, component organization, and visual intent. Adapt its patterns to this repository rather than copying its architecture or dependencies directly.
