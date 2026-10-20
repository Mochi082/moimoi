// もいもい -FMmoimoi- 公式サイト（全ページ共通）

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 押すとコピー（ハッシュタグなど） ----------
// data-copy に書いた文字をコピーして、少しのあいだ「コピーしました！」を出す
document.querySelectorAll("[data-copy]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 古いブラウザ向け：見えない入力欄を使ってコピーする
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    btn.classList.add("copied");
    clearTimeout(btn.copiedTimer);
    btn.copiedTimer = setTimeout(() => btn.classList.remove("copied"), 1500);
  })
);

// ---------- 画像の保存をしにくくする ----------
// 画像の上では右クリック・長押しのメニューを出さず、ドラッグもさせない（スクショなどは防げない）
["contextmenu", "dragstart"].forEach((type) =>
  document.addEventListener(type, (e) => {
    if (e.target.closest("img, .g-item")) e.preventDefault();
  })
);

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

// ---------- ギャラリーを画像リストから組み立てる ----------
// リストは tools/build_gallery.py が images/gallery から自動で作ります（js/gallery-data.js）
//   data-show="pickup" … ピックアップだけ（トップページ）
//   data-show="all"    … 全部（gallery.html）
const galleryData = window.GALLERY || { pickup: [], more: [] };
const galleryGrid = document.querySelector(".gallery-grid");
let galleryItems = [];

function makeItem(pic) {
  const btn = document.createElement("button");
  btn.className = "g-item reveal";
  btn.dataset.src = pic.full;
  btn.ratio = pic.h / pic.w;
  const img = document.createElement("img");
  img.src = pic.thumb;
  img.alt = "もいもいのイラスト";
  img.loading = "lazy";
  img.width = pic.w;
  img.height = pic.h;
  btn.appendChild(img);
  return btn;
}

// 画像を「いちばん短い列」に順番に入れていく（列ごとの長さがそろって隙間ができない）
let galleryCols = 0;

function layoutGallery() {
  const width = galleryGrid.clientWidth;
  const count = width < 560 ? 2 : width < 860 ? 3 : 4;
  if (count === galleryCols) return;
  galleryCols = count;

  const cols = Array.from({ length: count }, () => {
    const col = document.createElement("div");
    col.className = "g-col";
    return col;
  });
  const heights = new Array(count).fill(0);
  galleryItems.forEach((item) => {
    const i = heights.indexOf(Math.min(...heights));
    cols[i].appendChild(item);
    heights[i] += item.ratio + 0.1; // 0.1 は枠と隙間のぶん
  });
  galleryGrid.replaceChildren(...cols);
}

if (galleryGrid) {
  const all = [...galleryData.pickup, ...galleryData.more];
  let list = galleryGrid.dataset.show === "all" ? all : galleryData.pickup;
  if (list.length === 0) list = all.slice(0, 8); // ピックアップが空なら先頭8枚を出す

  galleryItems = list.map(makeItem);
  layoutGallery();
  window.addEventListener("resize", layoutGallery);

  const moreSub = document.querySelector(".more-sub");
  if (moreSub) moreSub.textContent = `全${all.length}枚を見る`;

  const countEl = document.querySelector(".gallery-count");
  if (countEl) countEl.textContent = `全${all.length}枚`;
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

// ---------- 動画のタブ（新着／配信アーカイブ／ショート） ----------
const movieFrame = document.querySelector(".movie-frame iframe");

document.querySelectorAll(".movie-tabs button").forEach((tab, _, tabs) =>
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", t === tab));
    movieFrame.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${tab.dataset.list}`;
  })
);

// ---------- ギャラリーの拡大表示 ----------
const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lbImg = lightbox.querySelector("img");
  let current = 0;

  const show = (index) => {
    current = (index + galleryItems.length) % galleryItems.length;
    lbImg.src = galleryItems[current].dataset.src;
    lbImg.alt = galleryItems[current].querySelector("img").alt;
  };

  galleryItems.forEach((item, i) =>
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
}
