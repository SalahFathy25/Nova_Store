# NOVA Commerce — Master Development Roadmap

> **Total Phases: 9** | **Estimated Duration: 4-6 months** | **Current Phase: 3**

---

## Design System — Hallmark

Every phase that involves UI/UX design **must** use the **Hallmark** skill to ensure anti-slop, production-grade design across all apps (Customer, Driver, Vendor, Admin).

### Hallmark Integration Rules

1. **Every new screen/page** — Run `hallmark redesign <target>` or the default Design flow before building any new UI.
2. **Every phase with UI work** — Include a "Hallmark Design Review" step in the phase checklist.
3. **Consistent brand identity** — Lock the design system into a `design.md` at project root after Phase 1 (Customer App MVP), then reference it in all subsequent phases.
4. **No AI slop** — All UI must pass the Hallmark 58-gate slop test before marking design tasks complete.
5. **Component reuse** — Hallmark-designed components go into `nova_core/` shared package so all apps share the same design DNA.

### Hallmark Workflow Per Phase

```
1. Pre-flight scan (existing tokens, fonts, framework)
2. Genre detection (editorial / modern-minimal / atmospheric / playful)
3. Macrostructure pick (from 21 named structures)
4. Theme selection (catalog or custom palette)
5. Build UI with Hallmark tokens
6. Run slop test (58 gates)
7. Lock design.md if first design phase
```

### Design File Location

- `design.md` — Locked design system (created in Phase 0, updated in Phase 1/4/6)
- `design.lock` — Lock rules and violation log (created in Phase 0)
- `nova_core/lib/src/core/theme/` — Flutter theme tokens
- `nova_core/lib/src/core/constants/` — Brand colors, typography

---

## Phase Overview

```
Phase 0: Foundation (Weeks 1-3)        ← Hallmark: Design system created & locked
    │
    ▼
Phase 1: Core Product (Weeks 4-7)        ← Hallmark: First design pass, apply tokens
    │
    ▼
Phase 2: Delivery & Logistics (Weeks 8-10) ← Hallmark: Driver app design
    │
    ▼
Phase 3: Production Features (Weeks 11-13) ← Hallmark: Polish & micro-interactions
    │
    ▼
Phase 4: Admin Dashboard (Weeks 14-16)    ← Hallmark: Dashboard redesign, new macrostructure
    │
    ▼
Phase 5: Advanced Features (Weeks 17-20)  ← Hallmark: Feature-specific UI
    │
    ▼
Phase 6: White-Label Platform (Weeks 21-23) ← Hallmark: Brand customization system
    │
    ▼
Phase 7: Production Hardening (Weeks 24-26) ← Hallmark: Final polish & accessibility
    │
    ▼
Phase 8: Demo & Launch (Weeks 27-28)       ← Hallmark: Showcase & marketing assets
```

---

## Dependency Matrix

| Phase | Depends On | Enables |
| :--- | :--- | :--- |
| **Phase 0** | None | Phase 1, 2, 3 |
| **Phase 1** | Phase 0 | Phase 2, 3, 4 |
| **Phase 2** | Phase 0, 1 | Phase 3, 4 |
| **Phase 3** | Phase 1 | Phase 4, 5 |
| **Phase 4** | Phase 1, 3 | Phase 5, 6 |
| **Phase 5** | Phase 1, 3 | Phase 6, 7 |
| **Phase 6** | Phase 5 | Phase 7, 8 |
| **Phase 7** | Phase 1-6 | Phase 8 |
| **Phase 8** | All | Launch |

---

## Current Status

| Phase | Status | Progress |
| :--- | :--- | :--- |
| Phase 0 | ✅ Complete | 100% |
| Phase 1 | ✅ Complete | 100% |
| Phase 2 | ✅ Complete | 100% |
| Phase 3 | ⏳ Pending | 0% |
| Phase 4 | ⏳ Pending | 0% |
| Phase 5 | ⏳ Pending | 0% |
| Phase 6 | ⏳ Pending | 0% |
| Phase 7 | ⏳ Pending | 0% |
| Phase 8 | ⏳ Pending | 0% |

---

## Quick Links

| Phase | File | Description | Hallmark |
| :--- | :--- | :--- | :--- |
| 0 | [PHASE_0.md](./PHASE_0.md) | Foundation — Database, Auth, Multi-Tenant | **Design system locked** |
| 1 | [PHASE_1.md](./PHASE_1.md) | Core Product — Customer App MVP | Apply tokens, first design pass |
| 2 | [PHASE_2.md](./PHASE_2.md) | Delivery & Logistics | Driver app design |
| 3 | [PHASE_3.md](./PHASE_3.md) | Production Features | Polish & animations |
| 4 | [PHASE_4.md](./PHASE_4.md) | Admin Dashboard Enhancement | Dashboard redesign |
| 5 | [PHASE_5.md](./PHASE_5.md) | Advanced Features | Feature UI |
| 6 | [PHASE_6.md](./PHASE_6.md) | White-Label Platform | Brand system |
| 7 | [PHASE_7.md](./PHASE_7.md) | Production Hardening | Final QA |
| 8 | [PHASE_8.md](./PHASE_8.md) | Demo & Launch | Marketing assets |
