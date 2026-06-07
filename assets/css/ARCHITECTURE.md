# CSS Architecture

`styles.css` remains a single stylesheet so the current static HTML pages keep a simple loading model and existing cascade behavior.

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

Example:

```css
.section-layout {
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  padding-inline: var(--grid-padding);
}
```

## Page block rules

- Scope page-specific styles under a page block such as `.about-*`, `.contact-*`, or `.home-*`.
- Keep content/layout styles in the page section and breakpoint overrides in the responsive section.
- Prefer shared tokens for color, typography, spacing, and grid behavior.
- Avoid page-specific fixed widths when a column span or `clamp()` expresses the design.
- Add new breakpoint values only when the existing desktop/tablet/mobile contract cannot represent the design.

## Reference project

Use `/Users/xuanlt/Works/Freelancer/connectvietnam_html/src/style.css` as the reference for grid strategy, responsive behavior, component organization, and visual intent. Adapt its patterns to this repository rather than copying its architecture or dependencies directly.
