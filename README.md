# 🌟ROCKET SHOOTER🚀

Welcome to **Rocket shooter**, a fully responsive, interactive, 2D arcade survival game built entirely from scratch using raw **HTML5, CSS3, and JavaScript**. 
It is designed with a playful, hand-drawn "school notebook sketch" aesthetic, this game is featureing advance canvas manipulation, manual physic  approximation, particles burst etc.

## 🎨 Creative Concept
The game reimagines classic arcade shoot-'em-ups inside a dynamic math-ruled notebook. 
* Your ship is a cardboard rocket capsule held together by tape and imagination.
* Your enemies are erratic, jagged blobs of chaotic purple fountain-pen ink.
* The artwork is generated programmatically using randomized math formulas, ensuring that every line drawn has an authentic, human-made, slightly imperfect "doodled" wobble.

---

## 🕹️ Game Features & Mechanics

* **Expanded Stage Grid:** Upgraded canvas size ($1024 \times 768$) to offer room for sweeping dogfights and intense bullet-hell dodging.
* **Weighted Linear Easing:** Rather than immediate snapping, the player’s craft relies on linear interpolation tracking (`lerp`) to simulate smooth momentum and weight as it follows your cursor.
* **Dynamic Wiggle Vector Math:** Ink monsters fluctuate down the screen via continuous trigonometric sine-wave paths (`Math.sin()`), making their trajectories delightfully unpredictable.
* **Intentionally Flawed Geometry:** Custom rendering functions inject algorithmic imperfections into basic pathing arcs to accurately mimic a human hand sketching with a pen.
* **Juicy Interaction Buffs:** * **Screen Shake Engine:** Getting struck triggers a violent canvas CSS keyframe offset transformation.
  * **Bubble Energy Shield:** Snagging a blue crest token encapsulates the ship in a multi-layered force field for 5 seconds.
  * **Combos & Multipliers:** Collecting stars safely builds a scaling points multiplier, while taking direct damage penalizes your score progression.

---

## 📂 Project Architecture

The codebase is highly optimized, modular, and cleanly split into three dedicated files:

```text
├── index.html   # Holds the structural layout, HUD nodes, and modal popups.
├── style.css    # Implements the scrapbook canvas wrappers, typography, and screen-shake frames.
└── script.js    # Houses the core delta-time tick loop, physics collision calculations, and entity rendering classes.
thank you everyone for visiting my repo
