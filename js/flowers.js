// 花のパーツ（ひまわり・あじさいのSVG）。どのページでも <use href="#sunflower"> などで使えます
document.body.insertAdjacentHTML("afterbegin", `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <!-- ひまわりの花びら -->
      <ellipse id="petal" cx="0" cy="-31" rx="8.5" ry="19"/>
      <ellipse id="petal-in" cx="0" cy="-25" rx="7" ry="15"/>
      <radialGradient id="seed" cx="45%" cy="40%" r="60%">
        <stop offset="0" stop-color="#8A5523"/>
        <stop offset="1" stop-color="#4A2A0E"/>
      </radialGradient>
      <pattern id="seeds" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1" fill="#2E1A08" opacity=".55"/>
      </pattern>
    </defs>

    <symbol id="sunflower" viewBox="-52 -52 104 104">
      <g fill="#FFC21A" stroke="#F0A000" stroke-width="1">
        <use href="#petal"/><use href="#petal" transform="rotate(22.5)"/><use href="#petal" transform="rotate(45)"/><use href="#petal" transform="rotate(67.5)"/>
        <use href="#petal" transform="rotate(90)"/><use href="#petal" transform="rotate(112.5)"/><use href="#petal" transform="rotate(135)"/><use href="#petal" transform="rotate(157.5)"/>
        <use href="#petal" transform="rotate(180)"/><use href="#petal" transform="rotate(202.5)"/><use href="#petal" transform="rotate(225)"/><use href="#petal" transform="rotate(247.5)"/>
        <use href="#petal" transform="rotate(270)"/><use href="#petal" transform="rotate(292.5)"/><use href="#petal" transform="rotate(315)"/><use href="#petal" transform="rotate(337.5)"/>
      </g>
      <g fill="#FFDB4D">
        <use href="#petal-in" transform="rotate(11.25)"/><use href="#petal-in" transform="rotate(33.75)"/><use href="#petal-in" transform="rotate(56.25)"/><use href="#petal-in" transform="rotate(78.75)"/>
        <use href="#petal-in" transform="rotate(101.25)"/><use href="#petal-in" transform="rotate(123.75)"/><use href="#petal-in" transform="rotate(146.25)"/><use href="#petal-in" transform="rotate(168.75)"/>
        <use href="#petal-in" transform="rotate(191.25)"/><use href="#petal-in" transform="rotate(213.75)"/><use href="#petal-in" transform="rotate(236.25)"/><use href="#petal-in" transform="rotate(258.75)"/>
        <use href="#petal-in" transform="rotate(281.25)"/><use href="#petal-in" transform="rotate(303.75)"/><use href="#petal-in" transform="rotate(326.25)"/><use href="#petal-in" transform="rotate(348.75)"/>
      </g>
      <circle r="17" fill="url(#seed)"/>
      <circle r="17" fill="url(#seeds)"/>
      <circle cx="-5" cy="-6" r="4" fill="#fff" opacity=".18"/>
    </symbol>

    <!-- 茎つきのひまわり -->
    <symbol id="sunflower-plant" viewBox="0 0 100 260">
      <path d="M50 60 C 46 120, 56 180, 50 260" stroke="#4E9A3A" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 150 C 20 130, 6 140, 2 156 C 22 162, 40 160, 50 150 Z" fill="#62B04A"/>
      <path d="M51 190 C 80 168, 94 176, 98 192 C 78 200, 62 198, 51 190 Z" fill="#62B04A"/>
      <path d="M50 150 C 32 146, 18 148, 6 155" stroke="#3E8A2E" stroke-width="1.5" fill="none"/>
      <path d="M51 190 C 68 186, 82 186, 95 191" stroke="#3E8A2E" stroke-width="1.5" fill="none"/>
      <use href="#sunflower" x="0" y="0" width="100" height="100" transform="translate(0,6)"/>
    </symbol>

    <!-- あじさいの小花 -->
    <symbol id="floret" viewBox="-12 -12 24 24" overflow="visible">
      <g stroke="rgba(255,255,255,.75)" stroke-width="1">
        <circle cx="0" cy="-5.2" r="5.4"/><circle cx="5.2" cy="0" r="5.4"/>
        <circle cx="0" cy="5.2" r="5.4"/><circle cx="-5.2" cy="0" r="5.4"/>
      </g>
      <circle r="1.8" fill="#fff"/>
    </symbol>

    <!-- あじさい（--ha / --hb / --hc で色を変えられます） -->
    <symbol id="hydrangea" viewBox="0 0 140 140">
      <path d="M70 92 C 40 92, 14 108, 8 132 C 34 130, 56 116, 70 96 Z" fill="#4E9A3A"/>
      <path d="M70 92 C 100 92, 126 108, 132 132 C 106 130, 84 116, 70 96 Z" fill="#62B04A"/>
      <path d="M70 96 C 52 110, 34 122, 14 130" stroke="#3E8A2E" stroke-width="1.5" fill="none"/>
      <path d="M70 96 C 88 110, 106 122, 126 130" stroke="#3E8A2E" stroke-width="1.5" fill="none"/>
      <circle cx="70" cy="60" r="44" style="fill:var(--hc)" opacity=".85"/>
      <use href="#floret" x="38" y="44" width="26" height="26" style="fill:var(--ha)"/>
      <use href="#floret" x="58" y="26" width="26" height="26" style="fill:var(--hb)"/>
      <use href="#floret" x="80" y="38" width="26" height="26" style="fill:var(--ha)"/>
      <use href="#floret" x="30" y="66" width="26" height="26" style="fill:var(--hb)"/>
      <use href="#floret" x="52" y="54" width="28" height="28" style="fill:var(--hc)"/>
      <use href="#floret" x="76" y="62" width="26" height="26" style="fill:var(--hb)"/>
      <use href="#floret" x="94" y="56" width="22" height="22" style="fill:var(--hc)"/>
      <use href="#floret" x="44" y="20" width="22" height="22" style="fill:var(--hc)"/>
      <use href="#floret" x="22" y="44" width="20" height="20" style="fill:var(--hc)"/>
      <use href="#floret" x="56" y="80" width="24" height="24" style="fill:var(--ha)"/>
      <use href="#floret" x="98" y="34" width="18" height="18" style="fill:var(--hb)"/>
      <use href="#floret" x="74" y="16" width="20" height="20" style="fill:var(--ha)"/>
    </symbol>
  </svg>
`);
