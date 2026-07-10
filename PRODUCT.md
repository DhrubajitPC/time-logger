# Product

## Register

product

## Platform

web

## Users

The owner plus a small circle of family and friends, each signed in with their own Google account. Primary device is a phone with the PWA installed; sessions are seconds long and often one-handed — tap a category to start a timer, tap to stop, occasionally add or edit an entry, glance at the Stats tab. Nobody is "operating a tool"; they're capturing moments between doing the actual activity.

## Product Purpose

Time Pop answers "where does my time actually go?" for personal life, not billable work. Category timers, manual entries with optional notes, and day/week/month stats, synced across devices through Firebase. Success looks like logging that is effortless enough to become a habit — if starting a timer takes more than one tap or the stats feel like homework, the product has failed its job.

## Brand Personality

Calm, warm, unfussy. The product is mid-rework: migrating away from its original candy-pop identity (Fredoka display type, loud coral, bubble-round cards) toward warm-minimal calm — Things 3's sense of focus with a warmer undertone. Friendly but never cute; quiet but never sterile. The warmth lives in tone, type, and small moments of feedback, not in loud surfaces.

## Anti-references

- **Corporate SaaS dashboard** — navy/gray, dense KPI cards, hero metrics, the Jira/analytics look.
- **Childish kids app** — mascots, bouncing animations, primary-crayon palettes. Playful must never tip into toy-like.
- **Dark techy tracker** — terminal-dark, monospace, hacker-productivity aesthetic.
- **Cluttered data-dense UI** — walls of numbers, tiny text, chart overload on Stats.

## Design Principles

1. **One thing at a time.** Each screen has a single hero — the running timer, today's log, one stat view. Everything else recedes.
2. **Logging beats features.** Any change is judged by whether it makes capturing time faster or slower. Habit formation is the product.
3. **Warmth without whimsy.** Warmth is carried by tone of voice, type, and feedback moments — not by loud color, display fonts, or decoration.
4. **Color is data.** Category colors identify categories; the accent marks the primary action and the live timer. Color never decorates.
5. **Familiar affordances, warm execution.** Standard patterns (tabs, sheets, lists) rendered with care — a fluent user of Things or Apple Reminders should feel at home immediately.

## Accessibility & Inclusion

Best-effort basics rather than formal WCAG conformance: body text holds ≥4.5:1 contrast, every animation has a `prefers-reduced-motion` alternative, and touch targets stay comfortable (≥44px) since the primary device is a phone.
