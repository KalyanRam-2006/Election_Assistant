---
name: CivicPulse AI
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#fbabff'
  on-secondary: '#580065'
  secondary-container: '#ae05c6'
  on-secondary-container: '#ffd8fd'
  tertiary: '#4fdbc8'
  on-tertiary: '#003731'
  tertiary-container: '#00a392'
  on-tertiary-container: '#00302a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffd6fd'
  secondary-fixed-dim: '#fbabff'
  on-secondary-fixed: '#36003e'
  on-secondary-fixed-variant: '#7c008e'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is centered on the concept of "Clarity through Depth." Designed for CivicPulse AI, the aesthetic balances the gravity of democratic participation with the cutting-edge intelligence of AI. The brand personality is authoritative yet accessible, sophisticated yet transparent. 

The design system utilizes **Glassmorphism 2.0**, moving beyond simple transparency into a refined multi-layered experience. By using frosted surfaces, vibrant background "auras," and precise light-refracting borders, the interface feels like a physical object made of light and crystalline materials. This evokes a sense of modernism and "clean data," helping users navigate complex civic information without feeling overwhelmed.

## Colors
The color palette is optimized for a dark-mode-first experience to maximize the "glow" effect of glass layers. The primary engine of the visual language is a series of vibrant mesh gradients using Electric Blue and Deep Purple. 

Teal is utilized for "positive" actions, progress, and verified data, while Orange serves as a high-contrast accent for deadlines, alerts, and critical calls to action. Surfaces are not flat; they are tinted translucent layers that inherit color from "blobs" of light floating in the background, ensuring the UI feels alive and dynamic.

## Typography
This design system utilizes **Inter** for its systematic precision and high readability in data-dense environments. The typographic hierarchy relies on significant weight contrast—heavy bold headers paired with airy regular body text. 

To maintain the high-tech aesthetic, labels and metadata use all-caps with increased letter spacing. Large display type should be treated as a graphic element, occasionally utilizing a subtle text-clipping gradient to mirror the primary brand colors.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop and a single column for mobile. Spacing is strictly based on an 8px rhythmic scale to maintain mathematical harmony.

Because glass elements require "breathing room" to showcase their blur effects, margins are intentionally generous. Content is grouped in logical clusters within glassy containers, using large padding (stack-lg) to separate major sections like "Candidate Profile" from "Voting Timeline."

## Elevation & Depth
Depth is not achieved through traditional shadows, but through **Backdrop Blur** and **Inner Glows**. 

1.  **Base Layer:** Dark, neutral background with soft, colorful mesh "auras" that move slowly.
2.  **Surface Layer:** 60% opacity with a 20px backdrop blur. Borders are 1px solid, using a top-down linear gradient (White at 20% to White at 5%) to simulate a "light-catching" edge.
3.  **Raised Layer:** Used for active cards or modals. 40% opacity, 40px backdrop blur, and a subtle outer glow that matches the primary brand color (15% opacity).
4.  **Interaction:** When hovered, elements should increase in saturation and decrease in blur, appearing to "clear up" as the user focuses on them.

## Shapes
The shape language is "Soft-Modern." All primary containers and cards use a 1rem (16px) corner radius. This prevents the interface from feeling too clinical or sharp, making the AI assistant feel approachable.

Buttons and high-interaction chips use a "Full Pill" (rounded-xl) radius to distinguish them as actionable touchpoints. Progress bar tracks are also fully rounded to maintain a sleek, streamlined appearance.

## Components
-   **Glassy Cards:** The foundation of the UI. Feature a semi-transparent background, 20px blur, and a 1px "glass-edge" border. Background noise/grain at 3% opacity is added to prevent color banding in the blurs.
-   **Vibrant Buttons:** These do not use glass effects; instead, they are solid gradients (Primary or Accent) to ensure high visibility and affordance. They feature a subtle "inner-shine" highlight on the top half.
-   **Sleek Progress Bars:** Used for election countdowns and ballot status. The "track" is a dark, recessed glass pipe; the "fill" is a glowing gradient (Teal or Purple) with a trailing light effect.
-   **Clean Chat Interface:** User messages are simple dark outlines; Assistant messages are glass-morphic bubbles with a subtle purple tint to indicate "AI" presence.
-   **Smart Chips:** Used for filtering topics (e.g., "Economy," "Climate"). These use a low-opacity glass style with a bright colored dot for the active state.
-   **Micro-animations:** Elements should use "Spring" transitions (stiffness: 120, damping: 14) for scaling. Hovering over a card should trigger a subtle shift in the background gradient position.