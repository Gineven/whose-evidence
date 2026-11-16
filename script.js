"use strict";
(() => {
  const config = window.PROJECT_CONFIG || {};
  const data = window.PAPER_DATA;
  const qs = (selector, parent = document) => parent.querySelector(selector);
  const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const fmt = (number, digits = 2) => Number(number).toFixed(digits);
  const safeUrl = value => {
    if (!value) return "";
    try { const url = new URL(value, location.href); return ["https:", "http:", "file:"].includes(url.protocol) ? value : ""; } catch { return ""; }
  };

  // Empty metadata is intentionally omitted instead of displaying dummy names.
  if (config.authors?.length) {
    const block = qs("#author-block");
    config.authors.forEach(author => {
      const wrapper = document.createElement("span");
      const name = document.createElement("span");
      name.textContent = author.name;
      wrapper.append(name);
      const marks = [...(author.affiliations || []), ...(author.equalContribution ? ["*"] : []), ...(author.corresponding ? ["†"] : [])];
      if (marks.length) { const sup = document.createElement("sup"); sup.textContent = marks.join(","); wrapper.append(sup); }
      block.append(wrapper);
    });
    block.hidden = false;
    const emailGroups = new Map();
    config.authors.forEach(author => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email || "")) return;
      const [local, domain] = author.email.split("@");
      if (!emailGroups.has(domain)) emailGroups.set(domain, []);
      emailGroups.get(domain).push(local);
    });
    const emails = qs("#author-emails");
    emailGroups.forEach((locals, domain) => {
      const group = document.createElement("span");
      group.className = "email-group";
      group.textContent = (locals.length > 1 ? "{" + locals.join(", ") + "}" : locals[0]) + "@" + domain;
      emails.append(group);
    });
    emails.hidden = emailGroups.size === 0;
    const notes = [];
    if (config.authors.some(author => author.equalContribution)) notes.push("* Equal contribution.");
    if (config.authors.some(author => author.corresponding)) notes.push("† Corresponding author.");
    if (notes.length) { qs("#author-notes").textContent = notes.join("  "); qs("#author-notes").hidden = false; }
  }
  if (config.affiliations?.length) {
    const block = qs("#affiliation-block");
    config.affiliations.forEach(affiliation => {
      const span = document.createElement("span");
      const sup = document.createElement("sup"); sup.textContent = affiliation.id;
      span.append(sup, document.createTextNode(" " + affiliation.name)); block.append(span);
    });
    block.hidden = false;
  }
  if (config.venue) { qs("#venue").textContent = config.venue; qs("#venue").hidden = false; }
  if (safeUrl(config.paperUrl)) { qsa("[data-paper-link]").forEach(link => { link.href = config.paperUrl; link.hidden = false; }); qs("#paper-pending").hidden = true; }
  if (safeUrl(config.codeUrl)) { const link = qs("#code-link"); link.href = config.codeUrl; link.target = "_blank"; link.rel = "noopener"; link.hidden = false; qs("#code-pending").hidden = true; }
  if (safeUrl(config.projectUrl)) { const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = config.projectUrl; document.head.append(canonical); }
  if (config.allowIndexing) qs('meta[name="robots"]').content = "index,follow";
  if (config.bibtex) {
    qs("#citation-section").hidden = false; qs("#citation-text").textContent = config.bibtex;
    qs("#copy-citation").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(config.bibtex); qs("#copy-citation").textContent = "Copied"; qs("#copy-status").textContent = "Citation copied to clipboard."; }
      catch { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(qs("#citation-text")); selection.removeAllRanges(); selection.addRange(range); qs("#copy-status").textContent = "Citation selected. Use your device's copy command."; }
    });
  }

  function cell(tag, text, className = "") {
    const element = document.createElement(tag); element.textContent = text;
    if (className) element.className = className;
    if (tag === "th") element.scope = "row";
    return element;
  }
  function appendRows(target, rows, options = {}) {
    const body = qs(target);
    const offset = options.venue ? 2 : 1;
    const maxValues = rows[0].slice(offset).map((_, col) => Math.max(...rows.map(row => row[col + offset])));
    rows.forEach(row => {
      const tr = document.createElement("tr");
      if (row[0] === "Full" || row[0] === "Ours" || row[0] === "Ours · Full") tr.className = "ours-row";
      const name = cell("th", row[0]);
      if (options.venue && row[1]) { const venue = document.createElement("span"); venue.className = "method-venue"; venue.textContent = row[1]; name.append(venue); }
      tr.append(name);
      row.slice(offset).forEach((value, index) => {
        const best = options.best !== false && value === maxValues[index];
        const digits = options.memory && index === row.length - offset - 1 ? 3 : 2;
        tr.append(cell("td", fmt(value, digits), best ? "best" : ""));
      });
      body.append(tr);
    });
  }
  appendRows("#benchmark-body", data.benchmark, { venue: true });
  appendRows("#controls-body", data.controls);
  appendRows("#ablation-body", data.ablations);
  appendRows("#efficiency-body", data.efficiency, { best: false, memory: true });
  data.vidstg.forEach((row, index) => {
    const tr = document.createElement("tr"); if (row[1] === "Ours") tr.className = "ours-row";
    tr.append(cell("th", row[0]), cell("td", row[1]));
    const pair = data.vidstg[index % 2 === 0 ? index + 1 : index - 1];
    row.slice(2).forEach((value, col) => tr.append(cell("td", fmt(value), value >= pair[col + 2] ? "best" : "")));
    qs("#vidstg-body").append(tr);
  });
  data.tnl2k.forEach(group => {
    const header = document.createElement("tr"); header.className = "group-header";
    const th = cell("th", group.label); th.colSpan = 7; th.scope = "rowgroup"; header.append(th); qs("#tnl2k-body").append(header);
    appendRows("#tnl2k-body", group.rows);
  });

  qsa("[data-tabs]").forEach(group => {
    const buttons = qsa('[role="tab"]', group);
    const activate = (button, focus = false) => {
      buttons.forEach(item => { const active = item === button; item.setAttribute("aria-selected", String(active)); item.tabIndex = active ? 0 : -1; });
      qsa(`[data-tab-panel^="${group.dataset.tabs}:"]`).forEach(panel => { panel.hidden = panel.dataset.tabPanel !== `${group.dataset.tabs}:${button.dataset.tab}`; });
      if (focus) button.focus();
    };
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button));
      button.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
        if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(buttons[next], true); }
      });
    });
  });

  const dialog = qs("#figure-dialog");
  let lastTrigger;
  qsa("[data-zoom]").forEach(trigger => trigger.addEventListener("click", event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || !dialog.showModal) return;
    event.preventDefault(); lastTrigger = trigger;
    qs("#dialog-image").src = trigger.dataset.zoom;
    qs("#dialog-image").alt = qs("img", trigger).alt;
    qs("#dialog-title").textContent = trigger.dataset.title;
    qs("#dialog-pdf").href = trigger.href;
    document.body.classList.add("dialog-open"); dialog.showModal();
  }));
  qs("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => { document.body.classList.remove("dialog-open"); lastTrigger?.focus({ preventScroll: true }); });
})();
