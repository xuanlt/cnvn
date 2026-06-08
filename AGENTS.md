@/Users/xuanlt/.codex/RTK.md

## Reference project

- Treat `/Users/xuanlt/Works/Freelancer/connectvietnam_html` as the primary reference project for this repository.
- Read `/Users/xuanlt/Works/Freelancer/connectvietnam_html/design.md` before making visual, typography, layout, component, or animation decisions.
- Treat this repository's `design.md` as the adapted design-system source of truth.
- Consult it when implementing or refining page content, visual direction, layout, grid behavior, responsive breakpoints, interactions, and animations.
- Adapt reference patterns to the current repository's existing HTML, CSS, JavaScript, naming conventions, and design system. Do not copy its architecture or dependencies unless explicitly requested.
- Preserve the current repository as the implementation target and source of truth for existing behavior.

## Design system

- Use `--font-display` for headings, nav labels, kickers, and CTAs; use `--font-sans` for body copy, descriptions, metadata, and UI text.
- Keep typography within `.text-sm`, `.text-body`, `.text-leading`, heading elements `h1`–`h6`, and heading utilities `.h1`–`.h6`.
- Use semantic color tokens `--color-primary`, `--color-primary-bright`, `--color-text`, `--color-text-muted`, `--color-text-meta`, and `--color-nav-bg`.
- Use shared typography, grid, and section-spacing tokens before adding component-specific values.
- Do not set arbitrary `font-size` values in new or refined component styles. First use an existing typography token, semantic text class, heading utility, or component class already mapped to the typography system. Add a new token only when the size is a repeated, intentional type level.
- Store structured static content in `data/*.json`.

## Layout structure

- For standard page sections, always separate layout from component styling with the hierarchy `section > .container or .container-fluid > .row > .col`.
- Use `.row` and responsive `.col-*`, `.col-md-*`, `.col-sm-*` classes for column placement. Do not assign grid placement directly to content/component classes.
- Place component classes inside a `.col` wrapper so component CSS remains responsible for visual styling and content behavior only.
- The Home horizontal stage is the exception and keeps its dedicated `.home-grid`, `.grid-item`, `screen-*`, `col-*`, `row-*`, and `span-*` system.
