# Whose Evidence Is It?

Project page for **Whose Evidence Is It? Topology-Scoped Subgraph Reasoning for UAV Video Grounding**.

**Authors:** Jingjun Sun*, Chaowei Wang*, Jiaxu Tian, Ming Yang, Yao Zhang, Yan Di, Shan Gao†.

\* Equal contribution. † Corresponding author.

**Project page:** https://gineven.github.io/whose-evidence/

This repository contains the project website. Model code is not included.

## Local preview

Run `python3 -m http.server 8767 --bind 127.0.0.1` in this directory and visit `http://127.0.0.1:8767`.

The website uses plain HTML, CSS and JavaScript, with no build step or external runtime dependencies. Figures can be enlarged and downloaded as PDFs. Tables and charts use the values reported in the paper.

## Update the page

- `site-config.js`: author names, email links, contribution markers and publication links. Empty metadata stays hidden.
- `data.js`: numerical results.
- `index.html`: page content.
- `style.css` and `script.js`: layout and interactions.
- `assets/images/`: figure previews.
- `assets/pdfs/`: original figures. A public manuscript link can be added in `site-config.js` when available.

## Hosting

GitHub Pages serves the `main` branch at `/ (root)`. Keep `.nojekyll` at the repository root. All assets use relative URLs.

The page design was inspired by [UA-NWM](https://duryi.github.io/UA-NWM-Project-Page/) and [OpenFunGraph](https://openfungraph.github.io/). The implementation, research figures and results belong to this project.
