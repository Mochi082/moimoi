// もいもい -FMmoimoi- 公式サイト

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- スマホメニュー ----------
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- ヒーローに舞う花びら（ひまわり・あじさい色） ----------
const rain = document.querySelector(".petal-rain");
const petalColors = ["#FFC21A", "#FFDB4D", "#7FA8F5", "#A88CF0", "#F49CC8", "#B9D3FF"];

if (rain && !reduceMotion) {
  const count = window.innerWidth < 720 ? 14 : 26;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    const size = 0.6 + Math.random() * 0.8;
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = petalColors[i % petalColors.length];
    p.style.width = `${14 * size}px`;
    p.style.height = `${22 * size}px`;
    p.style.animationDuration = `${7 + Math.random() * 8}s`;
    p.style.animationDelay = `${-Math.random() * 15}s`;
    p.style.setProperty("--dx", `${(Math.random() - 0.5) * 200}px`);
    rain.appendChild(p);
  }
}

// ---------- スクロールで要素がぽよんと出てくる ----------
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// ---------- ギャラリーの拡大表示 ----------
const lightbox = document.querySelector(".lightbox");
const lbImg = lightbox.querySelector("img");
const items = [...document.querySelectorAll(".g-item")];
let current = 0;

function show(index) {
  current = (index + items.length) % items.length;
  const img = items[current].querySelector("img");
  lbImg.src = items[current].dataset.src;
  lbImg.alt = img.alt;
}

items.forEach((item, i) =>
  item.addEventListener("click", () => {
    show(i);
    lightbox.showModal();
  })
);

lightbox.querySelector(".lb-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
lightbox.querySelector(".lb-next").addEventListener("click", () => show(current + 1));

// 背景クリックで閉じる
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});
