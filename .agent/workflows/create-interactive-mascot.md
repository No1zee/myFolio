---
description: How to create a Rigged Interactive Mascot (2D Cutout)
---

# Creating a "Digital Puppet" (Interactive Mascot)

This workflow explains how we built the `Kaiju` mascot in `src/components/Mascot.tsx`.

## 1. The Concept: "Rigging" in CSS
Instead of a single GIF or Video (which can't be interactive), we split the character into layers:
-   **Layer 1 (Back)**: Left Arm (moves independently).
-   **Layer 2 (Middle)**: Body/Torso (the anchor).
-   **Layer 3 (Front)**: Right Arm (foreground).
-   **Layer 4 (Head)**: The "Sensor" (tracks mouse).

## 2. Asset Preparation
We generated 4 separate PNGs using AI with a "Black Background" style.
-   **Why Black?**: Using `mix-blend-mode: screen` in CSS makes pure black transparent. This avoids messy "Magic Wand" cutout edges.

## 3. The Code (`framer-motion`)
We use `framer-motion` to breathe life into the static images.

### A. Mouse Tracking (The Head)
We track the mouse position (`-1` to `+1`) and map it to rotation.
```typescript
const headRotateX = useSpring(mousePosition.y * 20); // Look Up/Down
const headRotateY = useSpring(mousePosition.x * 25); // Look Left/Right
```

### B. The "Idle" Loop (Floating)
We use infinite repeating animations to simulate breathing/flying.
```typescript
animate={{ y: [0, -50, 0] }} // Float Up and Down
transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
```

## 4. Usage
Simply import `<Mascot />` and place it in your Hero section. It handles its own positioning.
