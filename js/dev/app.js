(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const openBtn = document.getElementById("openBtn");
const startStage = document.getElementById("startStage");
const scrollStage = document.getElementById("scrollStage");
const env = document.getElementById("env");
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
function smoothstep(a, b, x) {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
function applyProgress(p) {
  const flap = smoothstep(0.05, 0.3, p);
  const sealFade = smoothstep(0.02, 0.15, p);
  const title = smoothstep(0.12, 0.26, p);
  env.style.setProperty("--flap", flap.toFixed(4));
  env.style.setProperty("--sealFade", sealFade.toFixed(4));
  env.style.setProperty("--title", title.toFixed(4));
  const base = 0.32;
  const step = 0.1;
  const p1 = smoothstep(base + step * 0, base + step * 1, p);
  const p2 = smoothstep(base + step * 1, base + step * 2, p);
  const p3 = smoothstep(base + step * 2, base + step * 3, p);
  const p4 = smoothstep(base + step * 3, base + step * 4, p);
  const p5 = smoothstep(base + step * 4, base + step * 5, p);
  env.style.setProperty("--p1", p1.toFixed(4));
  env.style.setProperty("--p2", p2.toFixed(4));
  env.style.setProperty("--p3", p3.toFixed(4));
  env.style.setProperty("--p4", p4.toFixed(4));
  env.style.setProperty("--p5", p5.toFixed(4));
}
function onScroll() {
  if (!scrollStage.classList.contains("is-active")) return;
  const rect = scrollStage.getBoundingClientRect();
  const total = scrollStage.offsetHeight - window.innerHeight;
  const scrolledInside = -rect.top;
  const progress = clamp01(scrolledInside / Math.max(1, total));
  applyProgress(progress);
}
openBtn.addEventListener("click", () => {
  scrollStage.classList.add("is-active");
  startStage.style.display = "none";
  window.scrollTo({
    top: scrollStage.offsetTop + 1,
    behavior: "smooth"
  });
  requestAnimationFrame(() => {
    applyProgress(0);
    onScroll();
  });
});
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
applyProgress(0);
