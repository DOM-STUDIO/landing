const root = document.documentElement;
const revealItems = document.querySelectorAll(".reveal");
const stage = document.querySelector("[data-stage]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -10% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const updatePointerGlow = (event) => {
  const x = (event.clientX / window.innerWidth) * 100;
  const y = (event.clientY / window.innerHeight) * 100;

  root.style.setProperty("--pointer-x", `${x}%`);
  root.style.setProperty("--pointer-y", `${y}%`);

  if (!stage) {
    return;
  }

  const rect = stage.getBoundingClientRect();
  const stageX = ((event.clientX - rect.left) / rect.width - 0.5) * 26;
  const stageY = ((event.clientY - rect.top) / rect.height - 0.5) * 22;

  stage.style.setProperty("--stage-x", `${stageX}px`);
  stage.style.setProperty("--stage-y", `${stageY}px`);
};

window.addEventListener("pointermove", updatePointerGlow, { passive: true });
