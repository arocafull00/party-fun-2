# Design System Document: Party Fun 2

## 1. Overview & Creative North Star

### The Creative North Star: "Tactile Joy"
This design system moves away from the static, flat-web aesthetic of the last decade. Our goal is **Tactile Joy**—a visual language that feels physically present, highly reactive, and unapologetically energetic. We reject the "template" look by utilizing intentional asymmetry, oversized interactive zones, and a physics-based approach to depth.

The system is built for the high-velocity context of social gaming. It breaks the traditional rigid grid by treating the screen as a playground where elements can overlap, "bounce," and breathe. We use high-contrast typography scales and vibrant tonal layering to ensure that even in a room full of people, the UI remains the life of the party.

---

## 2. Colors

Our palette is designed to be "loud" but disciplined. We use Material Design token conventions to manage high-saturation hues without sacrificing legibility.

### Palette Strategy
- **Primary (`#005ab2`)**: Our anchor. Used for the most critical interactive paths.
- **Secondary (`#b31e03`)**: For high-energy, high-stakes actions (e.g., "Team Red" or "End Turn").
- **Tertiary (`#3f6600`)**: Reserved for success states and positive progress.
- **Surface & Background (`#fff5ec`)**: A warm, off-white "fine paper" base that prevents the high-saturation colors from feeling clinical or "techy."

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through background color shifts. For example, a card (`surface-container-lowest`) should sit on a background (`surface`) to define its edge. If a separation is needed, use a transition from `surface-container-low` to `surface-container-high`.

### Signature Textures
To add "soul," never use flat fills for large areas. 
- **The Glow-Up Gradient:** Main action buttons and Hero cards should use a subtle linear gradient from `primary` to `primary-container`. 
- **Geometric Depth:** Backgrounds must feature a low-contrast pattern of geometric shapes (triangles, circles, squiggles) using the `surface-variant` token.

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
- **Base:** `surface`
- **Sub-Section:** `surface-container-low`
- **Active Card:** `surface-container-lowest`
This creates a natural, soft lift.

### Ambient Shadows
When an element must "float" (like a bouncy button), use an **Ambient Shadow**:
- **Color:** A tinted version of `on-surface` (never pure black).
- **Properties:** Large blur (16px+), 6% opacity, and a 4px Y-offset. This mimics a soft light source, making elements feel like they are hovering over a physical board.

### Glassmorphism
For overlays and tooltips, use `surface-container` with a 40% alpha and a `backdrop-blur` of 12px. This ensures the vibrant game colors bleed through, keeping the player immersed in the "energy" of the background even when a menu is open.

---

## 5. Components

### Bouncy Buttons
- **Primary:** `primary` fill with a `primary-dim` 4px bottom-weighted "thick border" (simulating a 3D side-edge).
- **Interaction:** On press, the button should translate 2px down, "squishing" the shadow to provide tactile feedback.
- **Corner Radius:** Use the `xl` (1.5rem) token for a friendly, pill-like feel.

### Hero Cards
- **Construction:** Cards are forbidden from using dividers. Use `surface-container-highest` for the header area and `surface-container-lowest` for the body.
- **Ghost Border Fallback:** If a card sits on a similarly colored background, use the `outline-variant` at 15% opacity. Never 100%.

### Input Fields
- **Style:** Oversized with `md` roundedness. The "active" state should not just change color but should "grow" slightly (1.02x scale) to signal focus.

### Selection Chips
- **States:** Unselected chips use `surface-container-high`. Selected chips "pop" into `tertiary-container` with a bold `on-tertiary-container` label.

---

## 6. Do’s and Don’ts

### Do
- **Use Asymmetry:** Overlap a "floating" icon over the edge of a card to break the "boxed-in" feel.
- **Embrace White Space:** Use the Spacing Scale to create massive gaps between unrelated groups rather than using lines.
- **Color-Code Logic:** Ensure "Team Blue" elements strictly use the `primary` family and "Team Red" use `secondary`.

### Don't
- **Don't use pure black (#000000):** It kills the vibrancy of the party vibe. Use `on-surface` or `on-primary-container`.
- **Don't use 1px dividers:** They feel like a spreadsheet. Use a 8px vertical gap or a tonal shift instead.
- **Don't use sharp corners:** Nothing in this system should be sharper than the `sm` (0.25rem) token. Sharpness equals "danger" or "corporate"; roundness equals "play."