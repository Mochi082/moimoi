// 配信スケジュール：schedule.html の <ul class="schedule-src"> に書いた予定からカレンダーを作る
// 表示する月・日付・曜日はすべて自動。「今日の月」だけを表示する
// マスには「時間＋種類」だけを出し、日付を押すと下にその日の詳細を出す

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
const TYPE_LABEL = { live: "配信", video: "動画", collab: "コラボ", off: "お休み" };

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

// 書かれた予定のうち、今月のものだけを読み取る（日付・時間の順に並べる）
const events = [...document.querySelectorAll(".schedule-src li")]
  .map((li) => {
    const [y, m, d] = (li.dataset.date || "").split("-").map(Number);
    return {
      y, m, d,
      time: li.dataset.time || "",
      type: TYPE_LABEL[li.dataset.type] ? li.dataset.type : "live",
      title: li.textContent.trim(),
    };
  })
  .filter((e) => e.y === year && e.m === month && e.d >= 1 && e.d <= 31)
  .sort((a, b) => a.d - b.d || a.time.localeCompare(b.time));

const calendar = document.querySelector(".calendar");
const detail = document.querySelector(".cal-detail");
const dayCells = {};

document.querySelector(".cal-month").innerHTML =
  `<span class="cal-year">${year}</span>${month}<small>月</small>`;

// ---------- 押した日の詳細 ----------
function showDetail(day) {
  Object.values(dayCells).forEach((c) => {
    c.classList.remove("selected");
    c.setAttribute("aria-pressed", "false");
  });
  dayCells[day].classList.add("selected");
  dayCells[day].setAttribute("aria-pressed", "true");

  const weekday = WEEK[new Date(year, month - 1, day).getDay()];
  const dayEvents = events.filter((e) => e.d === day);

  detail.innerHTML = `<p class="cd-date">${month}/${day}<small>(${weekday})</small></p>`;

  if (dayEvents.length === 0) {
    detail.insertAdjacentHTML("beforeend", `<p class="cd-none">この日の予定はありません</p>`);
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "cd-list";
  dayEvents.forEach((e) => {
    const li = document.createElement("li");
    li.className = `type-${e.type}`;
    li.innerHTML = `
      <span class="cl-tag">${TYPE_LABEL[e.type]}</span>
      <span class="cl-time">${e.time}</span>
      <span class="cl-title"></span>`;
    li.querySelector(".cl-title").textContent = e.title;
    ul.appendChild(li);
  });
  detail.appendChild(ul);
}

// ---------- カレンダー ----------
const firstWeekday = new Date(year, month - 1, 1).getDay();
const daysInMonth = new Date(year, month, 0).getDate();

WEEK.forEach((w, i) => {
  const el = document.createElement("div");
  el.className = `cal-week${i === 0 ? " sun" : i === 6 ? " sat" : ""}`;
  el.textContent = w;
  calendar.appendChild(el);
});

for (let i = 0; i < firstWeekday; i++) {
  const blank = document.createElement("div");
  blank.className = "cal-day blank";
  calendar.appendChild(blank);
}

for (let d = 1; d <= daysInMonth; d++) {
  const weekday = (firstWeekday + d - 1) % 7;
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "cal-day";
  if (weekday === 0) cell.classList.add("sun");
  if (weekday === 6) cell.classList.add("sat");
  if (d === today.getDate()) cell.classList.add("today");

  const num = document.createElement("span");
  num.className = "cal-num";
  num.textContent = d;
  cell.appendChild(num);

  events
    .filter((e) => e.d === d)
    .forEach((e) => {
      const ev = document.createElement("span");
      ev.className = `cal-ev type-${e.type}${e.time ? " has-time" : ""}`;
      ev.innerHTML = `${e.time ? `<b>${e.time}</b>` : ""}<span class="ev-type">${TYPE_LABEL[e.type]}</span>`;
      cell.appendChild(ev);
    });

  cell.addEventListener("click", () => showDetail(d));
  dayCells[d] = cell;
  calendar.appendChild(cell);
}

// 最初は今日を表示。今日に予定がなければ、今日以降でいちばん近い予定の日を表示
const upcoming = events.find((e) => e.d >= today.getDate());
showDetail(events.some((e) => e.d === today.getDate()) || !upcoming ? today.getDate() : upcoming.d);
