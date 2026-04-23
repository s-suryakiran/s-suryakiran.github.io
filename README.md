# Suryakiran — Galactic Portfolio

An interactive, space-themed portfolio. You pilot a small rocket through the
solar system; each planet opens a different chapter of my work — projects,
experience, skills, writing, contact. No scrolling, no nav bar — just flight.

**Live:** https://s-suryakiran.github.io

---

## The map

| Body         | What it opens                                                 |
|--------------|---------------------------------------------------------------|
| **Sun**      | About me / identity                                           |
| **Mercury**  | Career geography — interactive 3D Earth globe with pins for every city I've worked from (Madurai → Singapore → Chennai → New York → Raleigh → Salt Lake City) |
| **Venus**    | Skills & stack                                                |
| **Earth**    | Work experience timeline                                      |
| **Mars**     | Featured projects — and a transmission from the surface       |
| **Jupiter**  | Open source / research / writing                              |
| **Saturn**   | Origin story & long-form bio                                  |
| **Neptune**  | Contact                                                       |
| **Pluto**    | A little something for anyone who flies far enough            |
| **`/NOW`**   | A moving comet — what I'm working on *right now*              |

---

## Controls

### Desktop
| Key                | Action                                |
|--------------------|---------------------------------------|
| `W` `A` `S` `D` / arrows | Fly                              |
| `Shift`            | Boost                                 |
| `E` / `Space`      | Land on the nearest planet            |
| `F`                | Autopilot to nearest landable body    |
| `` ` `` (backtick) | Open/close the retro terminal         |
| `Esc`              | Close panel / terminal                |

### Mobile
- On-screen joystick (bottom-left) to steer.
- `LAND` button (bottom-right) to enter a planet.
- **Rocket-up camera:** on touch devices the rocket stays centred and always
  points up — the world rotates around you to match your heading, so the
  joystick stays intuitive regardless of which way you're flying.

### Terminal
Type `help` at the `surya@galactic:~$` prompt to see every command
(`whoami`, `projects`, `contact`, and a few things that aren't listed).

---

## Tech

- Plain HTML / CSS / vanilla JavaScript — no build step.
- Main canvas renderer (`assets/js/space.js`): a single 2D canvas doing the
  starfield, orbits, planets, particles, rocket physics, parallax, and the
  retro CRT terminal overlay.
- 3D Earth globe (inside the Mercury panel): [three.js](https://threejs.org)
  loaded as an ES module directly from a CDN — no bundler. Earth texture is
  procedurally generated in a canvas at runtime (copyright-clean, no asset
  bloat), with labelled city pins and animated arcs connecting them.
- Hosted on GitHub Pages.

---

## Running locally

It's a static site, so anything that serves files works:

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` will mostly work, but some
browsers block module imports and audio over `file://` — prefer a local
server.

---

## Easter eggs

There are a few. I'm not going to list them here. If you land on a red
planet and hear something, that's intentional.

---

## Credits

Built by **Suryakiran Sureshkumar**. Software Engineer at Goldman Sachs,
formerly ML Engineer / Researcher. Madurai → Singapore → Chennai → NYC →
Raleigh → Salt Lake City.

If you want to reach out: fly to **Neptune**, or the old-fashioned way at
`suryakiranbdsk@gmail.com`.
