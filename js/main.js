/* =========================================================================
   HunarNet — Main interactions
   -------------------------------------------------------------------------
   All text content comes from the active language object (window.I18N.data),
   loaded by i18n.js. Dynamic sections are (re)rendered on load and whenever
   the language changes (the "i18n:changed" event).
   ========================================================================= */

(function () {
  "use strict";

  // Photo assets used by spotlight + testimonials (order matters)
  const PHOTOS = ["assets/spot1.jpg", "assets/spot2.jpg", "assets/spot3.jpg"];

  // Shortcut to translated data
  const D = () => window.I18N.data;

  /* ---------------- HEADER / NAV ---------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
  document.querySelectorAll(".mobile-menu a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      if (a.dataset.lstep !== undefined) {
        setTimeout(() => { loopActive = parseInt(a.dataset.lstep); buildLoop(); renderLoopDetail(); resetLoopTimer(); }, 300);
      }
      if (a.dataset.faq !== undefined) {
        setTimeout(() => openFaq(parseInt(a.dataset.faq)), 300);
      }
    });
  });
  document.getElementById("mobileJoinLink").addEventListener("click", (e) => {
    e.preventDefault(); mobileMenu.classList.remove("open"); openModal();
  });

  /* ---------------- DESKTOP DROPDOWNS ---------------- */
  const dds = document.querySelectorAll(".dd");
  function closeAllDD(except) {
    dds.forEach((d) => { if (d !== except) d.classList.remove("open"); });
  }
  dds.forEach((dd) => {
    const trigger = dd.querySelector(".dd-trigger");
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains("open");
      closeAllDD();
      dd.classList.toggle("open", willOpen);
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) closeAllDD(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllDD(); });

  document.querySelectorAll(".dd-item[data-goto]").forEach((item) => {
    item.addEventListener("click", () => {
      const target = document.querySelector(item.dataset.goto);
      closeAllDD();
      if (item.dataset.lstep !== undefined) {
        setTimeout(() => { loopActive = parseInt(item.dataset.lstep); buildLoop(); renderLoopDetail(); resetLoopTimer(); }, 350);
      }
      if (item.dataset.faq !== undefined) {
        setTimeout(() => openFaq(parseInt(item.dataset.faq)), 350);
      }
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll(".dd-item[data-open-join]").forEach((item) => {
    item.addEventListener("click", () => { closeAllDD(); openModal(); });
  });

  /* ---------------- PILLARS ---------------- */
  const pillarTabs = document.getElementById("pillarTabs");
  const pillarBody = document.getElementById("pillarBody");
  let pillarIndex = 0;
  function renderPillars(i) {
    pillarIndex = i;
    const items = D().pillars.items;
    pillarTabs.innerHTML = items.map((p, idx) =>
      `<div class="pillar-tab ${idx === i ? "active" : ""}" data-i="${idx}">${p.name}</div>`).join("");
    const p = items[i];
    pillarBody.innerHTML = `
      <div>
        <div class="num">${p.num}</div>
        <h3>${p.name}</h3>
        <p>${p.body}</p>
        <div style="margin-top:22px;"><button class="btn btn-outline dark btn-sm">${p.cta}</button></div>
      </div>
      <div>
        <p style="font-family:'Fredoka',sans-serif;font-weight:600;color:var(--navy);font-size:14px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px;">${p.h}</p>
        <div class="topic-grid">${p.topics.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      </div>`;
    pillarTabs.querySelectorAll(".pillar-tab").forEach((el) =>
      el.addEventListener("click", () => renderPillars(parseInt(el.dataset.i))));
  }

  /* ---------------- CHARCHA FILTER ---------------- */
  const filterRow = document.getElementById("filterRow");
  const discussList = document.getElementById("discussList");
  let activeFilter = "__ALL__";
  function renderDiscuss() {
    const c = D().charcha;
    const items = c.items;
    const tagsSet = [];
    items.forEach((d) => { if (!tagsSet.includes(d.tag)) tagsSet.push(d.tag); });
    if (activeFilter !== "__ALL__" && !tagsSet.includes(activeFilter)) activeFilter = "__ALL__";
    const chips = [{ key: "__ALL__", label: c.filter_all }].concat(tagsSet.map((t) => ({ key: t, label: t })));
    filterRow.innerHTML = chips.map((ch) =>
      `<div class="filter-chip ${ch.key === activeFilter ? "active" : ""}" data-t="${ch.key}">${ch.label}</div>`).join("");
    discussList.innerHTML = items.map((d) => `
      <div class="discuss-card" data-tag="${d.tag}">
        <div>
          <span class="tag">${d.tag}</span>
          <h4 style="margin-top:10px;">${d.q}</h4>
          <div class="meta">${d.replies} ${c.replies} &middot; ${d.teachers} ${c.teachers}</div>
        </div>
        <button class="btn btn-outline dark btn-sm">${c.join}</button>
      </div>`).join("");
    applyFilter();
  }
  function applyFilter() {
    document.querySelectorAll(".discuss-card").forEach((card) => {
      card.classList.toggle("hide", activeFilter !== "__ALL__" && card.dataset.tag !== activeFilter);
    });
  }
  filterRow.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    activeFilter = chip.dataset.t;
    filterRow.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    applyFilter();
  });
  document.getElementById("startDiscussionBtn").addEventListener("click", () => {
    discussList.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------------- SPOTLIGHT CAROUSEL ---------------- */
  const spotImgWrap = document.getElementById("spotImgWrap");
  const spotQuotes = document.getElementById("spotQuotes");
  const spotCap = document.getElementById("spotCap");
  const spotDots = document.getElementById("spotDots");
  let spotIndex = 0;
  let spotTimer = null;
  function renderSpotlight() {
    const items = D().spotlight.items;
    spotImgWrap.innerHTML = items.map((s, i) =>
      `<img src="${PHOTOS[i]}" alt="" class="${i === spotIndex ? "active" : ""}" data-i="${i}">`).join("");
    spotQuotes.innerHTML = items.map((s, i) =>
      `<p class="spot-quote ${i === spotIndex ? "active" : ""}" data-i="${i}">&ldquo;${s.quote}&rdquo;</p>`).join("");
    spotDots.innerHTML = items.map((s, i) =>
      `<div class="spot-dot ${i === spotIndex ? "active" : ""}" data-i="${i}"></div>`).join("");
    spotCap.textContent = items[spotIndex].cap;
  }
  function showSpot(i) {
    spotIndex = i;
    const items = D().spotlight.items;
    document.querySelectorAll("#spotImgWrap img").forEach((el) => el.classList.toggle("active", +el.dataset.i === i));
    document.querySelectorAll(".spot-quote").forEach((el) => el.classList.toggle("active", +el.dataset.i === i));
    document.querySelectorAll(".spot-dot").forEach((el) => el.classList.toggle("active", +el.dataset.i === i));
    spotCap.textContent = items[i].cap;
  }
  spotDots.addEventListener("click", (e) => {
    const d = e.target.closest(".spot-dot"); if (!d) return;
    showSpot(parseInt(d.dataset.i));
    resetSpotTimer();
  });
  function startSpotTimer() {
    spotTimer = setInterval(() => showSpot((spotIndex + 1) % D().spotlight.items.length), 5000);
  }
  function resetSpotTimer() { clearInterval(spotTimer); startSpotTimer(); }

  /* ---------------- SHARE PRACTICE ---------------- */
  const typePicker = document.getElementById("typePicker");
  function renderShareTypes() {
    const types = D().share.types;
    typePicker.innerHTML = types.map((t, i) =>
      `<div class="type-opt ${i === 0 ? "active" : ""}">${t}</div>`).join("");
  }
  typePicker.addEventListener("click", (e) => {
    const opt = e.target.closest(".type-opt"); if (!opt) return;
    typePicker.querySelectorAll(".type-opt").forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");
  });

  const shareSubmitBtn = document.getElementById("shareSubmitBtn");
  shareSubmitBtn.addEventListener("click", async () => {
    const s = D().share;
    const type = (typePicker.querySelector(".type-opt.active") || {}).textContent || "";
    const payload = {
      type: type,
      title: document.getElementById("shareTitle").value.trim(),
      about: document.getElementById("shareAbout").value.trim(),
      challenge: document.getElementById("shareChallenge").value.trim(),
      changed: document.getElementById("shareChanged").value.trim()
    };
    const original = shareSubmitBtn.textContent;
    shareSubmitBtn.textContent = s.sending;
    shareSubmitBtn.disabled = true;
    const res = await window.submitToSheet("practice", payload);
    shareSubmitBtn.disabled = false;
    shareSubmitBtn.textContent = original;
    if (res.ok) {
      document.getElementById("shareForm").style.display = "none";
      document.getElementById("shareConfirm").classList.add("show");
    } else {
      alert(s.error);
    }
  });
  document.getElementById("shareAnotherBtn").addEventListener("click", () => {
    document.getElementById("shareForm").style.display = "block";
    document.getElementById("shareConfirm").classList.remove("show");
    document.getElementById("shareTitle").value = "";
    document.getElementById("shareAbout").value = "";
    document.getElementById("shareChallenge").value = "";
    document.getElementById("shareChanged").value = "";
  });

  /* ---------------- LOOP SVG ---------------- */
  const loopSvg = document.getElementById("loopSvg");
  const loopDetail = document.getElementById("loopDetail");
  const cx = 200, cy = 200, r = 145;
  let loopActive = 0;
  function buildLoop() {
    const stages = D().loop.stages;
    const loop = D().loop;
    let svgContent = "";
    const n = stages.length;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    const pathD = "M " + pts.map((p) => p.join(",")).join(" L ") + " Z";
    svgContent += `<path d="${pathD}" fill="none" stroke="#e4d8c9" stroke-width="2" stroke-dasharray="6 6"/>`;
    svgContent += `<circle cx="${cx}" cy="${cy}" r="46" fill="var(--beige)"/>`;
    svgContent += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="Anton" font-size="15" fill="var(--brown)">${loop.centerTop}</text>`;
    svgContent += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Anton" font-size="15" fill="var(--brown)">${loop.centerBottom}</text>`;
    pts.forEach((p, i) => {
      const labelDx = p[0] > cx + 10 ? 22 : (p[0] < cx - 10 ? -22 : 0);
      const anchor = p[0] > cx + 10 ? "start" : (p[0] < cx - 10 ? "end" : "middle");
      const labelDy = p[1] < cy - r + 20 ? -18 : (p[1] > cy + r - 20 ? 26 : 5);
      svgContent += `<g class="loop-node ${i === loopActive ? "active" : ""}" data-i="${i}">
        <circle class="dot" cx="${p[0]}" cy="${p[1]}" r="${i === loopActive ? 11 : 8}" fill="${i === loopActive ? "var(--coral)" : "var(--brown)"}"/>
        <text x="${p[0] + labelDx}" y="${p[1] + labelDy}" text-anchor="${anchor}" font-size="13">${stages[i].name}</text>
      </g>`;
    });
    loopSvg.innerHTML = svgContent;
    loopSvg.querySelectorAll(".loop-node").forEach((el) => {
      el.addEventListener("click", () => { loopActive = parseInt(el.dataset.i); buildLoop(); renderLoopDetail(); resetLoopTimer(); });
    });
  }
  function renderLoopDetail() {
    const loop = D().loop;
    const stage = loop.stages[loopActive];
    loopDetail.innerHTML = `
      <div class="lt">${loop.stageLabel} ${loopActive + 1} ${loop.of} ${loop.stages.length}</div>
      <h3>${stage.name}</h3>
      <p>${stage.detail}</p>`;
  }
  let loopTimer = null;
  function startLoopTimer() {
    loopTimer = setInterval(() => { loopActive = (loopActive + 1) % D().loop.stages.length; buildLoop(); renderLoopDetail(); }, 3200);
  }
  function resetLoopTimer() { clearInterval(loopTimer); startLoopTimer(); }

  /* ---------------- IMPACT COUNTERS ---------------- */
  const impactGrid = document.getElementById("impactGrid");
  let impactStarted = false;
  function renderImpact() {
    const items = D().impact.items;
    impactGrid.innerHTML = items.map((d, i) => `
      <div>
        <div class="impact-num" data-target="${d.target}" id="impactNum${i}">${impactStarted ? d.target.toLocaleString() + "+" : "0"}</div>
        <div class="impact-label">${d.label}</div>
      </div>`).join("");
  }
  function animateImpact() {
    if (impactStarted) return;
    impactStarted = true;
    D().impact.items.forEach((d, i) => {
      const el = document.getElementById("impactNum" + i);
      const dur = 1400, t0 = performance.now();
      function step(t) {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.floor(p * d.target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = d.target.toLocaleString() + "+";
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------------- TESTIMONIALS ---------------- */
  const testiGrid = document.getElementById("testiGrid");
  function renderTestimonials() {
    testiGrid.innerHTML = D().impact.testimonials.map((t, i) => `
      <div class="testi-card">
        <div class="testi-top">
          <img class="testi-avatar" src="${PHOTOS[i]}" alt="">
          <div>
            <div class="testi-name">${t.name}</div>
            <div class="testi-role">${t.role}</div>
          </div>
        </div>
        <p class="testi-quote">${t.quote}</p>
      </div>`).join("");
  }

  /* ---------------- FAQS ---------------- */
  const faqList = document.getElementById("faqList");
  function renderFaqs() {
    faqList.innerHTML = D().faqs.items.map((f, i) => `
      <details class="faq-item" id="faq${i}">
        <summary>${f.q}</summary>
        <p class="faq-a">${f.a}</p>
      </details>`).join("");
  }
  function openFaq(i) {
    const el = document.getElementById("faq" + i);
    if (!el) return;
    document.querySelectorAll(".faq-item").forEach((f) => { if (f !== el) f.removeAttribute("open"); });
    el.setAttribute("open", "");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  /* ---------------- MODAL PICK OPTIONS (roles/experience/participate) ---------------- */
  function renderModalPicks() {
    const m = D().modal;
    fillPicks("roleGroup", m.roles, 0);
    fillPicks("expGroup", m.experience, -1);
    fillPicks("partGroup", m.participate, -1);
  }
  function fillPicks(groupId, arr, activeIdx) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.innerHTML = arr.map((label, i) =>
      `<div class="pick ${i === activeIdx ? "active" : ""}">${label}</div>`).join("");
  }
  document.querySelectorAll("[data-group]").forEach((group) => {
    const multi = group.dataset.multi === "true";
    group.addEventListener("click", (e) => {
      const pick = e.target.closest(".pick"); if (!pick) return;
      if (multi) {
        pick.classList.toggle("active");
      } else {
        group.querySelectorAll(".pick").forEach((p) => p.classList.remove("active"));
        pick.classList.add("active");
      }
    });
  });
  function selectedPicks(groupId) {
    return Array.from(document.getElementById(groupId).querySelectorAll(".pick.active")).map((p) => p.textContent);
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        if (entry.target.id === "impactGrid") animateImpact();
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  io.observe(impactGrid);

  /* ---------------- JOIN MODAL ---------------- */
  const joinModal = document.getElementById("joinModal");
  const steps = Array.from(document.querySelectorAll(".modal-step"));
  let currentStep = 0;
  function buildProgress() {
    const progress = document.getElementById("modalProgress");
    progress.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const seg = document.createElement("div");
      seg.className = "seg" + (i < currentStep ? " done" : "");
      seg.innerHTML = "<i></i>";
      if (i === currentStep) seg.querySelector("i").style.width = "50%";
      if (i < currentStep) seg.querySelector("i").style.width = "100%";
      progress.appendChild(seg);
    }
  }
  function showStep(i) {
    currentStep = i;
    steps.forEach((s) => s.classList.toggle("active", parseInt(s.dataset.step) === i));
    if (i < 4) buildProgress(); else document.getElementById("modalProgress").style.display = "none";
  }
  function openModal() {
    joinModal.classList.add("open");
    showStep(0);
    document.getElementById("modalProgress").style.display = "flex";
  }
  function closeModal() { joinModal.classList.remove("open"); }
  window.openModal = openModal;

  document.getElementById("navJoinBtn").addEventListener("click", openModal);
  document.getElementById("heroJoinBtn").addEventListener("click", openModal);
  document.getElementById("ctaJoinBtn").addEventListener("click", openModal);
  document.getElementById("modalClose").addEventListener("click", closeModal);
  joinModal.addEventListener("click", (e) => { if (e.target === joinModal) closeModal(); });
  document.getElementById("startJoin").addEventListener("click", () => showStep(1));
  document.getElementById("doneJoin").addEventListener("click", () => {
    closeModal();
  });
  document.querySelectorAll("[data-next]").forEach((btn) =>
    btn.addEventListener("click", () => showStep(currentStep + 1)));
  document.querySelectorAll("[data-back]").forEach((btn) =>
    btn.addEventListener("click", () => showStep(Math.max(0, currentStep - 1))));

  const finishBtn = document.getElementById("finishJoin");
  finishBtn.addEventListener("click", async () => {
    const m = D().modal;
    const payload = {
      name: document.getElementById("joinName").value.trim(),
      school: document.getElementById("joinSchool").value.trim(),
      role: (selectedPicks("roleGroup")[0] || ""),
      experience: selectedPicks("expGroup"),
      participate: selectedPicks("partGroup")
    };
    const original = finishBtn.textContent;
    finishBtn.textContent = m.sending;
    finishBtn.disabled = true;
    const res = await window.submitToSheet("join", payload);
    finishBtn.disabled = false;
    finishBtn.textContent = original;
    if (res.ok) {
      showStep(4);
    } else {
      alert(m.error);
    }
  });

  /* ---------------- MOBILE PLUS SHEET ---------------- */
  const plusSheet = document.getElementById("plusSheet");
  document.getElementById("mobilePlus").addEventListener("click", () => plusSheet.classList.toggle("open"));
  document.getElementById("plusJoin").addEventListener("click", (e) => { e.preventDefault(); plusSheet.classList.remove("open"); openModal(); });
  document.getElementById("plusShare").addEventListener("click", () => plusSheet.classList.remove("open"));
  document.getElementById("plusDiscuss").addEventListener("click", () => plusSheet.classList.remove("open"));

  /* ---------------- RENDER EVERYTHING ---------------- */
  function renderAll() {
    renderPillars(pillarIndex);
    renderDiscuss();
    renderSpotlight();
    renderShareTypes();
    buildLoop();
    renderLoopDetail();
    renderImpact();
    renderTestimonials();
    renderFaqs();
    renderModalPicks();
  }

  function bootstrap() {
    renderAll();
    startSpotTimer();
    startLoopTimer();
  }

  if (window.I18N.ready) {
    bootstrap();
  } else {
    document.addEventListener("i18n:ready", bootstrap, { once: true });
  }

  // Re-render dynamic content when language changes
  document.addEventListener("i18n:changed", () => {
    if (!window.I18N.ready) return;
    renderAll();
  });
})();
