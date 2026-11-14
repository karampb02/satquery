# Statement of AI Assistance (SI Disclosure)

**Project Name:** Project Liquid — Interactive NISAR Change Visualization App  
**Challenge:** NASA Space Apps Challenge 2026 — "Dancing with the SARs"  
**Repository:** [https://github.com/karampb02/satquery](https://github.com/karampb02/satquery)

---

## 1. Disclosure Notice
In compliance with NASA Space Apps Challenge regulations, this disclosure specifies where and how Artificial Intelligence (AI) tools were utilized in the development of Project Liquid.

> **Visible Disclosure Status:** A visible "Built with AI assistance" notification is permanently displayed across the footer and About & Data pages within the application interface.

---

## 2. Scope of AI Assistance

### Permitted Uses: Code Generation & Scaffolding
- **Code Scaffolding:** AI tools (large language model coding assistants) were used to generate boilerplate code, TypeScript interfaces, Next.js routing patterns, and Tailwind utility classes.
- **Scientific Algorithms Implementation:** AI assistance supported the Python translation of published radar processing formulas (radiometric decibel calibration, Lee speckle filtering, InSAR phase-to-displacement conversion).
- **Documentation & Formatting:** AI tools assisted in drafting Markdown summaries, presentation slides (`docs/slides.md`), and bibliography cross-referencing.

---

## 3. Strict Compliance & Visual Asset Integrity
- **No AI-Generated Images:** Project Liquid strictly **does NOT use AI-generated images or synthetic textures**. All diagrams and explainers (e.g. radar pulse propagation, surface backscatter reflection, InSAR interferometric fringes) are authored as custom vector SVG illustrations.
- **Data Integrity:** All radar observation metadata, coordinate bounding boxes, and satellite product references originate directly from verified NASA Earthdata, ASF DAAC, and NASA/JPL OPERA specifications. No granule names, timestamps, or scientific measurements were fabricated.
- **Human Verification:** All generated code was reviewed, validated, and verified locally by running unit tests, data export pipelines, and production builds.
