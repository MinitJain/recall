---
name: Ritro
description: "Save anything. Find everything." A personal archive that returns things, set as a reading room's lending desk.
colors:
  stamp-violet: "#3E3A9C"
  stamp-violet-deep: "#2F2B80"
  on-stamp: "#FBF8F2"
  stamp-wash: "rgba(62, 58, 156, 0.09)"
  paper: "#F4EFE6"
  paper-raised: "#FBF8F2"
  paper-shade: "#EDE6DA"
  rule: "#E2D9CA"
  rule-strong: "#CFC4B2"
  ink: "#1F1B16"
  ink-muted: "#5E5548"
  ink-dim: "#766B5C"
  error: "#B42318"
  error-wash: "#FBEAE7"
  success: "#2F6B3A"
  stamp-violet-dark: "#ABA6F2"
  stamp-violet-deep-dark: "#C4C0F7"
  on-stamp-dark: "#171511"
  stamp-wash-dark: "rgba(171, 166, 242, 0.12)"
  paper-dark: "#171511"
  paper-raised-dark: "#201D18"
  paper-shade-dark: "#2A2620"
  rule-dark: "rgba(244, 239, 230, 0.09)"
  rule-strong-dark: "rgba(244, 239, 230, 0.17)"
  ink-dark: "#F1EBDF"
  ink-muted-dark: "#B5AB9B"
  ink-dim-dark: "#958B7B"
  error-dark: "#F28B82"
  error-wash-dark: "#2A1513"
  success-dark: "#8CC79A"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  page-title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  item-title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "-0.015em"
  section-label:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "\"ss01\", \"cv11\""
  ui:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
  caption:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "\"tnum\""
  stamp:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontFeature: "\"tnum\""
rounded:
  stamp: "3px"
  md: "6px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "80px"
  section-lg: "112px"
  gutter: "20px"
  gutter-sm: "32px"
components:
  button-primary:
    backgroundColor: "{colors.stamp-violet}"
    textColor: "{colors.on-stamp}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
    typography: "{typography.ui}"
  button-primary-hover:
    backgroundColor: "{colors.stamp-violet-deep}"
    textColor: "{colors.on-stamp}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
    typography: "{typography.caption}"
  button-quiet-hover:
    backgroundColor: "{colors.paper-shade}"
    textColor: "{colors.ink}"
  input-field:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
    typography: "{typography.ui}"
  card-bookmark:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px"
  tag-chip:
    backgroundColor: "{colors.stamp-wash}"
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
    typography: "{typography.caption}"
  filter-chip:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
    typography: "{typography.caption}"
  filter-chip-active:
    backgroundColor: "{colors.stamp-violet}"
    textColor: "{colors.on-stamp}"
    rounded: "{rounded.full}"
  date-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.stamp}"
    padding: "0.2em 0.55em"
    typography: "{typography.stamp}"
  bookmarklet-pill:
    backgroundColor: "transparent"
    textColor: "{colors.stamp-violet}"
    rounded: "{rounded.full}"
    padding: "0.3rem 0.85rem"
---

# Design System: Ritro

## Overview

**Creative North Star: "The Lending Desk"**

Ritro is a personal archive that returns things, and the interface is dressed as the desk of a small reading room: warm paper, dark ink, hairline rules, and a single stamp pad of violet ink that marks when something went out and when it came back. The landing page reads like an editorial page set in a serif, not a SaaS hero; the app is the card catalogue behind the desk, quieter and denser, with the same paper and ink.

Density is calm. The landing breathes on a wide 12 column measure with tall section rhythm and almost no containers; the app narrows to a single reading column of bordered slips. Depth comes from paper tone (three shades of paper) and hairlines, with one soft lift shadow reserved for things you can pick up. Motion is small and physical: items fade up into place, and a date stamp lands with a slight overshoot and settles crooked, the way a real one does.

Light is the default and the reference; dark mode is a full sibling theme (warm near black paper, cream ink, a lighter lavender stamp) toggled by a class on the root and respected from the OS preference on first load.

**Key Characteristics:**
- Warm paper grounds with ink text; no pure white, no pure black.
- One accent only: stamp violet, for the primary action, links, active filters, tags and date stamps.
- Three type voices with fixed jobs: serif for headings and item titles, sans for UI and reading copy, mono only for dates, hostnames and counts.
- The date stamp is the signature: an outlined, uppercase, slightly tilted mono label.
- Square-ish 6px corners on containers; full pills only for chips.
- Hairline rules and paper tone over shadows.

## Colors

Paper and ink with a single stamp pad violet; every text color passes WCAG AA on both paper and raised paper, in both themes.

### Primary
- **Stamp Violet** (light `stamp-violet`, dark `stamp-violet-dark`): the only accent. Primary buttons, inline links, the italic second line of the hero and closing headlines, active filter chips, tag text, the search glyph, the focus ring, text selection, the input caret, and every date stamp.
- **Stamp Violet Deep** (`stamp-violet-deep`): hover state of filled violet buttons only.
- **Stamp Wash** (`stamp-wash`): a 9% (dark 12%) violet tint behind tag chips, the active view toggle, the open collection menu trigger and the bookmarklet pill on hover.
- **On Stamp** (`on-stamp`): text on filled violet; the raised paper color in light, the base paper in dark.

### Neutral
- **Paper** (`paper`): the page ground everywhere, and the background of the Surprise me dialog.
- **Raised Paper** (`paper-raised`): slips and containers: bookmark cards, the save form, search field, auth card, settings sections, the return slip, and the closing band of the landing.
- **Paper Shade** (`paper-shade`): recessed tone for alternating landing bands, thumbnail placeholders, quiet button hovers, skeleton blocks, and auth fields.
- **Rule** (`rule`): default 1px hairline for card borders, section dividers and list dividers.
- **Strong Rule** (`rule-strong`): input borders, the return slip and search demo frames, untouched tag chip outlines on the slip, link underline decoration at rest, and the scrollbar thumb.
- **Ink** (`ink`): headings, item titles, body emphasis.
- **Muted Ink** (`ink-muted`): reading copy, descriptions, nav links, quiet buttons.
- **Dim Ink** (`ink-dim`): captions, placeholders, counts, footer, hostnames on the landing demo.

### Status
- **Error** with **Error Wash**: destructive actions (delete account button, delete bookmark hover), inline error text and alert boxes, the danger section border at 30% opacity.
- **Success**: reserved token; defined in both themes but not yet used on any surface.

### Named Rules
**The One Stamp Pad Rule.** Violet is the only hue in the interface besides error red. If a new element needs emphasis, it gets violet, weight or serif, never a second accent.

**The Paper Not White Rule.** Surfaces are always one of the three paper tones; nothing is `#FFFFFF` or `#000000`. Dark mode is warm paper at night, not grey.

## Typography

**Display Font:** Source Serif 4, variable with italic and optical sizing (fallback Georgia, serif)
**Body Font:** Geist, variable (fallback system-ui, sans-serif), with stylistic sets ss01 and cv11 on
**Label/Mono Font:** Geist Mono, variable, tabular numerals (fallback ui-monospace)

**Character:** A bookish, optically sized serif set at medium weight carries every heading and every saved item's title, so the archive reads like a catalogue of things worth reading. Geist does the quiet work underneath, and Geist Mono appears only where a librarian would use a date stamp or a call number.

### Hierarchy
- **Display** (serif 500, clamp 2.75rem to 5.25rem, 1.02, tracking -0.03em): the landing hero only, with its second line in serif italic at weight 400 in violet.
- **Headline** (serif 500, clamp 2rem to 3rem, tight leading, -0.02em): landing section heads and the closing statement (to 3.5rem), balanced wrapping.
- **Page Title** (serif 500, 2.25rem, -0.02em): legal pages, 404 and error; settings uses the next step down (1.875rem).
- **Title** (serif 500, 1.25 to 1.5rem): landing step titles, empty state heading, auth card heading, settings section heads (1.125rem), the wordmark (semibold).
- **Item Title** (serif 500, 17px, snug): every bookmark title in list and grid, clamped to one or two lines, turning violet on hover. The return slip uses a larger 1.375rem cut.
- **Section Label** (serif italic 400, 15px, muted): small catalogue labels such as "Collections" and "Tags" on the dashboard, and "Ritro archive" on the slip.
- **Lead** (sans 400, 1.125rem, relaxed, max about 36rem): the hero paragraph; section intros sit at 17px.
- **Body** (sans 400, 15 to 16px, relaxed 1.625 to 1.7, max 60ch): landing copy and legal articles in muted ink.
- **UI** (sans 500, 14px): buttons, nav, inputs. Small UI and captions drop to 12px.
- **Data** (mono 400, 11px, tabular): hostnames, slip numbers, keyboard shortcut keys.
- **Stamp** (mono 500, 11px, uppercase, 0.06em tracking): date stamps; 10px on bookmark cards.

### Named Rules
**The Three Voices Rule.** Serif speaks for content (headings, titles, labels in italic). Sans runs the interface. Mono is only for data: dates, hostnames, numbers, keys. Never set a button, a paragraph or a heading in mono.

**The Italic Turn Rule.** When a headline turns toward the promise ("Find everything.", "Ritro gives it back."), the turn is set in serif italic at regular weight in violet. Use it once per view at most.

## Layout

The landing runs on a centered 72rem container with 20px side gutters (32px from small screens up) and a 12 column grid from the medium breakpoint: the hero splits 7 and 5 (copy left, return slip right), feature sections split 5 and 7, and the step list sets its title in 4 columns against body in 8. Sections are separated by hairline rules or a change of paper tone and padded 80px vertically (112px from medium up; the closing band 96 to 128px). Below the medium breakpoint everything collapses to one column; the hero headline scales fluidly with the viewport.

The app is a single reading column of 42rem with 16px side gutters under a sticky 48px header (paper at 80% with a backdrop blur and a hairline bottom rule). Inside, vertical rhythm is 20px between control groups and 12px between cards; cards pad 16px and stack 6px internally. Bookmarks show as a list (thumbnail 64px left) or a two column grid from small screens up (128px thumbnail on top). Auth is a centered 24rem column; settings and legal use the same 42rem column as the app.

Spacing follows Tailwind's 4px step; recurring values are 4, 8, 12, 16, 20, 24, 40 and the section paddings above.

## Elevation & Depth

Ritro is flat by default and conveys depth through paper tone and hairlines: raised paper slips sit on paper with a 1px rule; recessed areas use the shade tone. One shadow, the lift, is reserved for objects you can pick up: the return slip and the search demo on the landing, and bookmark cards on hover (paired with the border darkening to the strong rule). The primary Save button also takes the lift on hover.

### Shadow Vocabulary
- **Lift** (`0 1px 2px rgba(31,27,22,0.05), 0 8px 24px -12px rgba(31,27,22,0.18)`; dark `0 1px 2px rgba(0,0,0,0.3), 0 10px 28px -14px rgba(0,0,0,0.6)`): a held slip; ink tinted, never grey.

### Named Rules
**The Picked Up Rule.** A surface casts a shadow only when it is being presented or touched (a demo slip, a hovered card). Resting containers are borders on paper.

## Shapes

Corners are square-ish and consistent: 6px on every container, input and button (cards, save form, search field, slip, dialog, primary buttons, nav buttons, thumbnails). Full pills are reserved for chips: tags, filter chips, collection chips, the Surprise me trigger, the inline add tag field, and the dashed bookmarklet pill. The date stamp has its own 3px corner and a 1.5px outline in currentColor so it reads as ink, not as a button.

Lines are hairlines (1px) except ink marks: the stamp outline and the bookmarklet's dashed border are 1.5px. Dashed borders mean "add or drag something here" (add tag field, new collection chip, bookmarklet).

Icons are Lucide style outline glyphs at stroke width 2 with round caps and joins, sized 12 to 16px, colored by currentColor.

## Components

### Buttons
Quiet and confident; filled violet only for the one action that matters.
- **Shape:** gently squared corners (6px).
- **Primary:** stamp violet fill, on stamp text, 48px tall with 24px side padding on the landing (44px on 404 and error, 48px for the Save button), weight 500, optional trailing arrow that nudges 2px right on hover.
- **Hover / Focus:** fill deepens to stamp violet deep over 150ms; focus shows the global 2px violet outline at 2px offset.
- **Text link (secondary):** ink text, 4px underline offset in the strong rule color that turns violet on hover ("Add the extension", "Back to Ritro").
- **Quiet:** transparent, muted ink, 32px tall, 12px padding; on hover the paper shade fills in and text goes to ink (header Settings, Log out, theme toggle, landing nav).
- **Outline pill:** raised paper, hairline, muted ink; hover turns border and text violet (Surprise me, Try another).
- **Destructive:** error fill with paper text, only inside the delete account section.

### Chips
- **Tag chip:** stamp wash fill, violet text, full pill, 12px; in the editable card it carries a 12px remove X.
- **Filter chip:** raised paper, hairline, muted ink; hover violet outline and text; active is filled violet with on stamp text. Collections use the same chip with a folder glyph.
- **Slip tag:** outlined in the strong rule with muted text, used only on the landing return slip.
- **Add chip:** dashed rule outline, dim text, turns violet on hover or focus.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** raised paper.
- **Shadow Strategy:** none at rest; lift on hover (see Elevation).
- **Border:** 1px rule, strengthening to the strong rule on hover.
- **Internal Padding:** 16px (list card, save form), 20px (settings sections, dialog), 24px (auth card, slip).
- **Bookmark card:** serif item title, optional two line muted description, then a row pairing the mono hostname with a SAVED date stamp, then tag chips with an inline add tag field. Delete and collection actions sit top right; delete appears on hover or keyboard focus.

### Inputs / Fields
- **Style:** raised paper fill, 1px strong rule border, 6px corners, 44 to 48px tall, 14px text, dim ink placeholder, violet caret.
- **Focus:** border shifts to stamp violet; no glow.
- **Error:** 12px error text below the field, or an error wash box for form level alerts.
- **Search:** same field with a violet search glyph inset left and a text "Clear" action right.

### Navigation
- **Landing header:** 64px tall, logo mark plus serif semibold wordmark left; muted 14px links, theme toggle and an ink "Log in" quiet button right. Secondary links hide below the small breakpoint.
- **App header:** sticky 48px, translucent paper with blur and a bottom hairline; wordmark left; email (hidden on mobile), theme toggle, Settings and Log out as quiet buttons right.
- **Footer:** hairline top, dim 14px text, wordmark in serif, links brighten to ink on hover.

### Date Stamp (signature)
An outlined mono label in violet ink: uppercase, 0.06em tracked, 1.5px currentColor border, 3px corners, never filled. It is rotated a few degrees (about -3deg at rest) so it reads as hand stamped. It marks:
- **SAVED dd MMM** on every bookmark card (year added when not the current year).
- **SAVED** and **BACK** on the landing return slip.
- **BACK dd MMM** in the Surprise me dialog when a save comes back.
- One word state labels: "Archive opened" (empty dashboard), "Not on file" (404), "Misfiled" (error).

When a stamp marks an event happening now (BACK), it animates in: from 135% scale and 2px blur to a slight undershoot, settling at its tilt (`--stamp-tilt`) over 500ms on an ease out expo curve.

### Bookmarklet Pill
A draggable violet text pill with a 1.5px dashed violet border and full radius, grab cursor, stamp wash on hover. It is the one place a dashed accent border appears.

### Dialog (Surprise me)
A paper colored panel, 32rem wide, 6px corners and hairline border, over a dimmed scrim, headed by a serif "Rediscovered" title with the animated BACK stamp beside it, holding a full bookmark card and an outline "Try another" button.

## Do's and Don'ts

### Do:
- **Do** use stamp violet for exactly one filled action per view and for links, active filters, tags and stamps.
- **Do** set every heading and every saved item's title in Source Serif 4 at weight 500; use serif italic for small catalogue labels.
- **Do** keep mono to dates, hostnames, counts and keys, with tabular numerals.
- **Do** mark time with the date stamp: outlined, uppercase, slightly tilted; animate it only when the event is happening now.
- **Do** use 6px corners on containers, fields and buttons, and full pills only for chips and the bookmarklet.
- **Do** separate landing sections with hairline rules or a paper tone change rather than boxing them in cards.
- **Do** keep shadows to the single lift token, and only on presented or hovered objects.
- **Do** keep both themes in step: every new color is a token defined for light and dark.
- **Do** write UI copy without em dashes, without hyphens as punctuation, and without emojis.
- **Do** respect reduced motion; all animation collapses to near zero duration.

### Don't:
- **Don't** add a second accent hue, gradients, or glow; violet and error red are the only colors beside paper and ink.
- **Don't** use pure white or pure black surfaces.
- **Don't** fill a date stamp or use it as a button; it is an ink mark.
- **Don't** set body copy, buttons or headings in mono.
- **Don't** build the landing from feature card grids or a mocked dashboard screenshot; show the mechanism with real looking slips labelled as examples.
- **Don't** introduce larger radii (8px and up) on containers or buttons, or pill shaped primary buttons.
- **Don't** use icons at mixed stroke weights; outline glyphs at stroke 2 only.
