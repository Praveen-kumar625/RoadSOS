# ADR 07: UI/UX Guidelines

## Status
Accepted

## Context
Emergency dispatchers require a high-contrast, data-dense interface that minimizes cognitive load during critical events.

## Decision: Real-Time Kinetic UI
1. **Color Palette:**
   - **Background:** Ultra-dark (#050505) to reduce eye strain.
   - **Primary Accents:** Cyan-400 (Telemetry), Emerald-500 (Nominal), Red-500 (Emergency).
2. **Kinetic Feedback:**
   - Use `Framer Motion` and `Lucide React` icons for smooth transitions and status alerts.
   - Live waveform visualization using `Recharts` to show kinetic energy dissipation.
3. **Architecture:**
   - **Feature-Sliced Design (FSD):** Ensures modularity, making it easy to add new dispatcher widgets (e.g., historical analytics, fleet tracking).

## Consequences
- **Positive:** Intuitive, modern aesthetic that builds user confidence.
- **Negative:** Tailwind CSS overhead for custom glassmorphism effects.
