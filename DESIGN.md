---
name: Lustre & Lineage
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#e2e2e2'
  on-primary-container: '#636465'
  inverse-primary: '#c6c6c6'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#556251'
  on-tertiary: '#ffffff'
  tertiary-container: '#d8e6d1'
  on-tertiary-container: '#5a6857'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#d8e7d2'
  tertiary-fixed-dim: '#bccbb7'
  on-tertiary-fixed: '#131e12'
  on-tertiary-fixed-variant: '#3d4a3b'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-gap: 120px
---

## Brand & Style

This design system is built for a high-end 925 silver jewelry brand, emphasizing craftsmanship, purity, and timeless elegance. The brand personality is **sophisticated, serene, and curated**, targeting a discerning audience that values understated luxury over ostentation.

The visual style follows **Minimalism with a Luxury Editorial influence**. It prioritizes high-quality product photography, using generous whitespace to allow every piece of jewelry to breathe, much like a physical gallery space. The interface acts as a silent stage—refined and unobtrusive—ensuring that the shimmering textures of silver remain the focal point. Emotional responses should range from a sense of "calm aspiration" to "tactile precision."

## Colors

The palette is rooted in the materials of the craft. **Shimmering Silver** (#E2E2E2) serves as the primary thematic color, often used in backgrounds and subtle dividers to mimic the cool luster of 925 silver. **Charcoal Gray** (#333333) provides the necessary weight and "ink-like" contrast for typography and primary actions.

**Crisp White** (#FFFFFF) is the foundation of the layout, driving the minimalist aesthetic. **Soft Sage Green** (#98A693) is introduced sparingly as an organic accent, evoking a sense of nature and softness that balances the coldness of metal. 

- Use **Charcoal Gray** for all primary text and core CTAs to ensure legibility.
- Use **Sage Green** for secondary highlights, success states, or "New Collection" badges.
- Backgrounds should oscillate between **White** and the very lightest tints of **Silver** to create subtle sectional depth.

## Typography

The typography strategy pairs a high-contrast serif with a modern, low-contrast geometric sans-serif to achieve an "Editorial-meets-Digital" balance.

**Playfair Display** is used for all headlines and display text. Its delicate hairlines and elegant curves mirror the artisanal nature of jewelry design. Use it with slightly tighter letter-spacing for large display sizes to maintain a "bespoke" feel.

**DM Sans** handles all functional and body text. It was chosen for its clean, unobtrusive character and excellent legibility at smaller sizes. 

- **Labels and Captions:** Always use `label-sm` in uppercase with generous letter-spacing to denote categories, prices, or materials.
- **Hierarchy:** Maintain a clear distinction between the "Storytelling" (Serif) and "Information" (Sans-serif) layers of the UI.

## Layout & Spacing

The layout philosophy centers on **Extravagant Whitespace**. The goal is to make the user feel unhurried. 

- **Grid:** A 12-column fixed grid is used for desktop (max-width 1280px), centered in the viewport. 
- **The "Breathe" Rule:** Sections are separated by significant vertical gaps (120px on desktop) to ensure the eye focuses on one collection or story at a time.
- **Mobile Adaption:** On mobile, margins reduce to 16px, and the 12-column grid collapses to a 2-column or 1-column layout. Images should maintain an aspect ratio that favors vertical scrolling.
- **Asymmetry:** Occasionally break the grid with offset images or text blocks to create a more "editorial" and less "templated" appearance.

## Elevation & Depth

This design system avoids heavy shadows and traditional skeuomorphism in favor of **Tonal Layering and Hairline Borders**.

- **Depth through Tone:** Layers are created by placing White cards against a Light Silver (#F5F5F5) background. 
- **Low-Contrast Outlines:** Instead of shadows, use 0.5pt or 1pt borders in Shimmering Silver (#E2E2E2) to define component boundaries.
- **Glassmorphism:** For overlays like navigation bars or quick-view modals, use a high-blur backdrop filter (20px+) with a 90% opacity white fill. This maintains the "airy" feel while providing functional separation.
- **Product Depth:** Depth should primarily come from the professional photography of the jewelry itself (shadows within the photos) rather than UI-generated shadows.

## Shapes

The shape language is **Soft and Precise**. We use a `Soft` (Level 1) roundedness (4px - 12px) to take the edge off the minimalism without making the brand feel "bubbly" or juvenile. 

- **Small elements (Buttons, Chips):** Use a 4px radius (`rounded`).
- **Large elements (Cards, Modals):** Use an 8px radius (`rounded-lg`).
- **Product Containers:** Images should typically remain sharp (0px) to emphasize the precision-cut nature of the silver, while their containers or background washes may use the soft rounding.

## Components

### Buttons
- **Primary:** Solid Charcoal Gray (#333333) with White text. Rectangular with a subtle 4px corner radius. No shadow.
- **Secondary/Ghost:** A 1px Charcoal Gray border with transparent background. High-contrast hover state (background fills with Silver).
- **Text Link:** DM Sans, 12px Uppercase, with a 1px underline that sits 4px below the text baseline.

### Jewelry Cards
- **Structure:** Borderless by default. High-resolution product image on a light gray background wash. 
- **Details:** Product name in Playfair Display (18px) followed by price in DM Sans (14px).
- **Interactive:** On hover, the image subtly scales (1.05x) and a "Quick Add" button appears via a soft fade.

### Delicate Dividers
- Use 0.5px horizontal lines in Silver (#E2E2E2).
- Dividers should never span the full width of the container; leave 10% padding on either side to maintain the "lightness" of the layout.

### Input Fields
- Underline-style inputs instead of boxed fields. A 1px Charcoal bottom border that darkens or thickens slightly on focus. 
- Placeholder text in a muted Silver-Gray.

### Chips & Badges
- Used for "925 Sterling," "Limited Edition," or "Restocked."
- Small, pill-shaped with a Soft Sage Green background and Charcoal text. Use high letter-spacing for the font.