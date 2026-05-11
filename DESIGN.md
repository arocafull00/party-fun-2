# Design System Document: Party Fun 2

## 1. Overview & Creative North Star

### The Creative North Star: "Tactile Joy"
This design system moves away from the static, flat-web aesthetic of the last decade. Our goal is **Tactile Joy**—a visual language that feels physically present, highly reactive, and unapologetically energetic. We reject the "template" look by utilizing intentional asymmetry, oversized interactive zones, and a physics-based approach to depth.

The system is built for the high-velocity context of social gaming. It breaks the traditional rigid grid by treating the screen as a playground where elements can overlap, "bounce," and breathe. We use high-contrast typography scales and vibrant tonal layering to ensure that even in a room full of people, the UI remains the life of the party.

---

## 2. Colors

Our palette is intentionally minimal but semantically clear. We use a small set of high-saturation hues combined with warm neutrals to maintain legibility and energy.

### Core Palette
| Token | Value | Usage |
|---|---|---|
| `primary` | `#005ab2` | Team Blue, main actions, brand identity |
| `secondary` | `#b31e03` | Team Red, high-risk actions, errors |
| `tertiary` | `#3f6600` | Success states, positive progress, correct answers |
| `background` | `#fff5ec` | General background, warm off-white |
| `surface` | `#ffffff` | Cards, modals, input backgrounds |
| `surfaceVariant` | `#f2e6d8` | Secondary backgrounds, decorative shapes |
| `text` | `#005ab2` | Primary text for headings and interactive elements |
| `onSurface` | `#2a1e12` | Body text over light surfaces (warm dark brown) |
| `textLight` | `#fff5ec` | Text over primary/secondary backgrounds |
| `textSecondary` | `#6f5f50` | Subtitles, metadata, hints |
| `error` | `#b31e03` | Errors (same as secondary) |
| `accent` | `#b31e03` | Accent highlights |
| `outline` | `#e6d4be` | Subtle borders when strictly necessary |
| `outlineVariant` | `#f2e0c9` | Lighter borders, separators |
| `surfaceContainerLowest` | `#ffffff` | Elevated card backgrounds |
| `surfaceContainerLow` | `#fff8f0` | Slightly elevated surfaces |
| `surfaceContainerHigh` | `#f2e6d8` | Higher elevation surfaces |
| `primaryLight` | `#2196f3` | Light blue accents |

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through background color shifts. If a separation is needed, use a transition from `surface` to `surfaceVariant` or an 8px vertical gap.

### Signature Textures
To add "soul," never use flat fills for large areas. 
- **The Glow-Up Gradient:** Main action buttons and Hero cards should use a subtle linear gradient from `primary` to `primaryLight`. 
- **Geometric Depth:** Backgrounds must feature a low-contrast pattern of geometric shapes (triangles, circles, squiggles) using the `surfaceVariant` token.

---

## 3. Typography

The typography is the voice of the game: loud, friendly, and impossible to ignore.

- **Display & Headlines (Plus Jakarta Sans):** Chosen for its geometric precision and friendly, open apertures. Use `display-lg` for game titles and `headline-lg` for victory screens. These should always be set to **Extra Bold**.
- **Body & Titles (Be Vietnam Pro):** A slightly more functional but still rounded sans-serif. It maintains readability during fast-paced gameplay.
- **Intentional Scale:** We utilize a high-contrast scale. If a headline is 32pt, the sub-label should be 12pt. This "Big/Small" relationship creates an editorial feel that guides the eye instantly to the most important data point.

---

## 4. Elevation & Depth

We reject the standard "Box Shadow" approach in favor of **Tonal Layering** and **Ambient Physics.**

### The Layering Principle
Depth is achieved by stacking surface tiers.
- **Base:** `background`
- **Sub-Section:** `surfaceVariant`
- **Active Card:** `surface`
This creates a natural, soft lift.

### Ambient Shadows
When an element must "float" (like a bouncy button), use an **Ambient Shadow**:
- **Color:** A tinted version of `onSurface` (never pure black).
- **Properties:** Large blur (16px+), 6% opacity, and a 4px Y-offset. This mimics a soft light source, making elements feel like they are hovering over a physical board.

### Glassmorphism
For overlays and tooltips, use `surface` with a 40% alpha and a `backdrop-blur` of 12px. This ensures the vibrant game colors bleed through, keeping the player immersed in the "energy" of the background even when a menu is open.

---

## 5. Components

### Bouncy Buttons
- **Primary:** `primary` fill with a `primaryLight` 4px bottom-weighted "thick border" (simulating a 3D side-edge).
- **Interaction:** On press, the button should translate 2px down, "squishing" the shadow to provide tactile feedback.
- **Corner Radius:** Use the `xl` (1.5rem) token for a friendly, pill-like feel.

### Hero Cards
- **Construction:** Cards are forbidden from using dividers. Use `surfaceContainerHigh` for the header area and `surface` for the body.
- **Ghost Border Fallback:** If a card sits on a similarly colored background, use the `outline` at 15% opacity. Never 100%.

### Input Fields
- **Style:** Oversized with `md` roundedness. The "active" state should not just change color but should "grow" slightly (1.02x scale) to signal focus.

### Selection Chips
- **States:** Unselected chips use `surfaceVariant`. Selected chips "pop" into `tertiary` with a bold `textLight` label.

### Bottom Navigation
- **Container:** `surfaceContainerLow` with `outlineVariant` border, floating 14px from bottom with `xl` radius.
- **Active Item:** `primary` background with `textLight` icon and label.
- **Inactive Item:** Transparent background with `primary` icon and label.

---

## 6. Do's and Don'ts

### Do
- **Use Asymmetry:** Overlap a "floating" icon over the edge of a card to break the "boxed-in" feel.
- **Embrace White Space:** Use the Spacing Scale to create massive gaps between unrelated groups rather than using lines.
- **Color-Code Logic:** Ensure "Team Blue" elements strictly use the `primary` family and "Team Red" use `secondary`.
- **Use Tokens:** Always import colors from `theme.ts`. No hardcoded hex values in components.

### Don't
- **Don't use pure black (#000000):** It kills the vibrancy of the party vibe. Use `onSurface` or `text`.
- **Don't use 1px dividers:** They feel like a spreadsheet. Use a 8px vertical gap or a tonal shift instead.
- **Don't use sharp corners:** Nothing in this system should be sharper than the `sm` (0.25rem) token. Sharpness equals "danger" or "corporate"; roundness equals "play."
- **Don't duplicate components:** Use the shared `BottomNavigation` and `BouncyButton` components instead of copying tabs/buttons across screens.
