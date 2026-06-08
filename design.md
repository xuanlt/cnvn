# Connect Vietnam Design System

This file is the adapted design source of truth for `cnvn`. It follows
`/Users/xuanlt/Works/Freelancer/connectvietnam_html/design.md` while preserving
the current repository's static HTML architecture, local assets, and existing
working interactions.

## Core Direction

- Brand expression is clean, editorial, spacious, and grid-led.
- Brand red is reserved for emphasis, dots, active states, CTAs, and hover.
- White is the default background. About Vision uses warm beige; About Team
  transitions from warm beige to white.
- Use restrained borders, muted metadata, and generous whitespace.

## Typography

- Use `--font-display` for headings, hero copy, kickers, navigation labels, and
  CTAs.
- Use `--font-sans` for body copy, descriptions, metadata, and form/UI text.
- The reference documentation names Space Grotesk and DM Sans, while its
  current implementation uses Plus Jakarta Sans for both roles. This repo keeps
  the roles separate and uses compatible fallback stacks without adding remote
  font dependencies.
- Use only the semantic type roles `.text-sm`, `.text-body`, `.text-leading`,
  heading elements `h1`–`h6`, and heading utilities `.h1`–`.h6`.
- Prefer existing typography tokens over component-specific pixel values.
- Do not set arbitrary `font-size` values in component CSS. Use an existing
  type token, semantic text class, heading utility, or component class already
  mapped to the typography system. Add a new type token only when the size is a
  repeated, intentional level in the design system.
- The desktop `.home-grid` may amplify `.h1`–`.h4` through one shared,
  viewport-constrained scale defined on `.home-grid`; individual grid items
  must not define their own font sizes.

## Color Tokens

- `--color-primary`: brand red.
- `--color-primary-bright`: hover/gradient red.
- `--color-text`: primary text.
- `--color-text-muted`: decorative labels and quiet text.
- `--color-text-meta`: descriptions, roles, captions, and secondary text.
- `--color-nav-bg`: translucent navigation background when blur is needed.

## Layout

- Standard sections use `section > .container or .container-fluid > .row > .col`.
- The responsive grid is 12 columns desktop, 8 tablet, and 4 mobile.
- Grid gap/padding is `24/36`, `20/32`, and `16/20` pixels respectively.
- `.container` is centered with `max-width: 1920px`.
- Use `col-4 | col-1 spacer | col-6` as the preferred editorial split when it
  suits the content. Hide the spacer at tablet and stack on mobile.
- Component classes style content; `.row` and `.col-*` own placement.
- Home horizontal stage keeps its dedicated 60-column layout contract.

## Spacing

- Standard section block spacing is 100px desktop, 80px tablet, and 60px mobile.
- Use spacing tokens or shared section classes before adding local values.

## Components

- Section labels use display font, uppercase, muted color, and `0.08em`
  letter-spacing.
- Section headings use display font, bold weight, and tight line-height.
- Body descriptions use sans font, relaxed line-height, and meta color.
- Team cards use a `3/4` media ratio, role metadata, and modal details.
- Mission circles overlap with white fills, subtle borders, red icons, and
  staggered reveal animation.
- About office photo uses a cropped grayscale image and scrubbed vertical
  parallax.

## Motion

- Respect `prefers-reduced-motion`.
- Use restrained fade-up reveals and staggered component entrances.
- Preserve the current repository's transition and GSAP architecture.
- Do not add Barba.js, Vanta.js, CDN dependencies, or another application
  architecture unless explicitly requested.

## Data

- Store static structured content in `data/*.json`.
- Team data lives in `data/team.json` and is rendered by page JavaScript.
