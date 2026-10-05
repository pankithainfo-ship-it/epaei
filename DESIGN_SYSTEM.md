# Epaeins UI Design System

## Purpose

This document describes the visual language used by the Epaeins application and
provides practical conventions for keeping new screens consistent. It is based
on the current styles in `src/index.css`, `src/App.css`, and the student
dashboard component. Some areas of the application have their own visual
variations; those are called out below rather than presented as a fully unified
system.

## Design principles

- **Clear and practical:** prioritize legible data, obvious actions, and familiar
  form controls.
- **Calm surfaces:** use light neutral page backgrounds, white cards, and
  restrained borders and shadows.
- **Consistent status meaning:** use blue for primary information and navigation,
  green for success/current states, amber for partial or upcoming states, and
  red for errors.
- **Responsive by default:** let action groups wrap, stack multi-column layouts
  on smaller screens, and keep wide data tables inside their own scroll
  container.

## Color palette

The application currently has a warm neutral base for the enquiry/admissions
screens and a cool blue base for dashboards, batches, and faculty. Use the
palette appropriate to the screen being extended; avoid introducing additional
accent colors without a specific meaning.

| Role | Color | Current use |
|---|---|---|
| Warm page background | `#f4efe9` / `#f5f1ed` | Main enquiry surface and global background |
| Warm header surface | `#f8efe3` to `#f3ece5` | Enquiry header gradient |
| Cool page background | `#f4f6fb` | Dashboards, batches, and faculty workspace |
| Card / input surface | `#ffffff` | Cards, forms, menus, and table backgrounds |
| Main text | `#18242d` / `#1b2638` | Body text on warm and cool surfaces |
| Cool heading | `#263751` | Dashboard and faculty headings |
| Primary blue | `#2457d6` | Chart accent, selected tabs, links, and badges |
| Deep blue | `#1e3767` | Strong dashboard emphasis and metric values |
| Muted blue | `#5470a6` | Dashboard kicker labels |
| Success green | `#2c9c72` / `#1e8d61` | Current/available/success states |
| Warning amber | `#f28f3b` / `#c27724` | Chart accent and partial-payment state |
| Error red | `#b42318` | Validation and loading errors |
| Cool border | `#e2e7f0` | Dashboard cards, panels, and dividers |
| Warm border | `#d8d2c9` | Admission form controls and warm panels |
| Muted text | `#66758b` / `#78869b` | Descriptions, metadata, and supporting labels |

### Color use

- Keep body text dark enough to be readable on its background.
- Use a semantic status class or label as well as color; color alone should not
  communicate status.
- Reserve red for an actionable error or destructive state.
- Preserve contrast when using the deep-blue metric card with light text.

## Typography

| Context | Current style |
|---|---|
| Global default | Georgia, Times New Roman, serif; `1.5` line-height |
| Student workspace and action pills | Segoe UI, Arial, sans-serif |
| Dashboard descriptions, controls, and data rows | Arial, sans-serif |
| Large dashboard headings | Responsive sizing, tight line-height, negative tracking |
| Kicker labels | Uppercase, bold, small size, expanded letter spacing |
| Table headings | Small uppercase labels with expanded letter spacing |

Use existing screen typography when extending a screen. For dense data,
controls, and metadata, prefer the existing sans-serif treatment. Keep headings
short and establish hierarchy through size and weight rather than multiple
decorative styles.

## Layout and spacing

- Main content generally uses a centered maximum width of approximately
  `1280px`.
- Use flexible page gutters, such as `clamp(18px, 4vw, 54px)`, in analytics and
  operational workspaces.
- Dashboard cards and grids commonly use a `16px` gap.
- Form grids commonly use a `15px` gap.
- Panel padding is usually between `17px` and `26px`, depending on density.
- Keep page-level overflow under control. For wide tables, apply horizontal
  scrolling to the table wrapper, not the entire page.
- The enquiry workspace uses an outer white panel with a rounded `20px` corner
  and a soft shadow. Dashboard panels use smaller, mostly square corners.

## Components

### Buttons

- The main enquiry/dashboard action buttons use a white background, thin gray
  outline, dark text, and pill radius (`999px`).
- Standard action pills are about `38px` high with `8px 15px` padding and
  `0.82rem` text. On narrow screens they reduce to about `34px` high with
  smaller padding and text.
- Primary form actions use a dark filled background with white text.
- Secondary form actions use a white background and neutral outline.
- Disabled buttons should remain visibly disabled and should not appear
  clickable.
- Maintain a visible keyboard-focus style when changing button appearance.

### Cards and statistic panels

- Dashboard cards use a light surface, thin cool border, and a soft shadow.
- Metric cards pair a small uppercase label with a prominent numeric value and
  optional supporting text.
- The emphasized metric card uses a deep-blue surface with light text.
- Keep content aligned to the top of cards so headings line up in a grid.

### Forms and inputs

- Place a concise label above each input; labels use small, bold uppercase text
  in operational forms.
- Use white input surfaces, neutral outlines, and consistent internal padding.
- Group related fields in a grid and let wide notes or action areas span the
  available columns.
- Display validation and submission feedback adjacent to the relevant form
  actions and use the semantic error/success color.

### Tables and lists

- Use a light neutral background for table headings and a subtle row divider.
- Keep table headers left-aligned and concise.
- Put wide tables in a dedicated horizontal scroll wrapper.
- Lists should expose the primary identifier first, followed by secondary
  metadata such as course, date, and status.

### Charts

- Existing analytics use CSS conic-gradient pie charts with a central white
  value label and a matching color legend.
- Use the same chart colors for each category in both the pie and legend.
- Include an accessible text label for the chart and show category names and
  counts in the legend.
- Provide an explicit empty state when the dataset has no records.

### Modals

- Use a dimmed full-screen backdrop and a white toolbar with a bottom divider.
- Keep the modal panel within the viewport; long modal content may scroll inside
  the overlay.
- Give every dialog an accessible title and a clearly visible close action.

## Responsive behavior

Existing styles use several breakpoints depending on the feature:

| Breakpoint | Current behavior |
|---|---|
| `max-width: 1050px` | Admission form grid reduces to two columns |
| `max-width: 1000px` | Faculty schedule grid reduces from three columns |
| `max-width: 850px` | Batch form grid reduces to two columns |
| `max-width: 800px` | Dashboard grids and student lists become single-column |
| `max-width: 650px` | Student, faculty, and admission views use compact gutters and stacked layouts |
| `max-width: 600px` | Batch form becomes a single column |

When adding responsive behavior:

1. Let pill/action groups wrap instead of adding a horizontal page scroller.
2. Collapse multi-column cards/forms before content becomes cramped.
3. Make search and select controls fill the available width on narrow screens.
4. Preserve a scroll wrapper for tables that cannot fit on small screens.
5. Verify at a 320px viewport as well as desktop widths.

## Accessibility conventions

- Use semantic headings, buttons, labels, and form controls.
- Associate each form label with its input.
- Keep keyboard focus visible and ensure controls can be operated without a
  pointer.
- Use `role="alert"` for important errors where appropriate.
- Give charts accessible names and provide text legends with the data.
- Do not rely on color alone for status or validation.

## Implementation guidance

The styles currently live mainly in `src/App.css` and `src/index.css`, with
some student-dashboard styles defined inline in `src/studentdetails.jsx`. When
adding a feature:

1. Reuse existing palette, spacing, and component patterns before adding new
   styles.
2. Scope styles to feature-specific class names to avoid affecting unrelated
   screens.
3. Prefer CSS classes for responsive or interactive styling; inline styles
   cannot express the existing media-query behavior.
4. If a design token or shared component is introduced, update this document
   and use it consistently on the relevant screens.

## Current consistency gaps

- The global font is Georgia while data-heavy screens often use Arial or Segoe
  UI.
- Warm neutral styling is used for enquiry/admission screens while dashboards
  and faculty/batch screens use cool blue styling.
- Corner radii vary by surface, including pill buttons, rounded enquiry panels,
  and square dashboard cards.
- A number of student dashboard styles are inline, while most responsive
  behavior is in CSS.

Treat these as existing screen-specific variations. New work should stay
consistent within its feature and avoid expanding these differences
unnecessarily.
