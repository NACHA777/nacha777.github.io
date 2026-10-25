// Campus San Joaquín · app del mapa interactivo
// HTML/CSS/JS sin librerías. Las vistas se eligen con el # de la URL:
// #mapa, #lugar-2, #bloque, #comunidad, #publicar, #compartir, #ra-1

const app = document.getElementById("app");

// ---------- íconos (trazos estilo Lucide) ----------
const trazos = {
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  atras: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  brujula:
    '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  coffee:
    '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  music:
    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  imagen:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3-3-9 9"/>',
  megafono:
    '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  mensaje:
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v6M9 10h6"/>',
  foco: '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  camara:
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
};
function ico(n) {
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${trazos[n]}</svg>`;
}

// ---------- utilidades ----------
const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// evita que texto escrito por usuarios se interprete como HTML
function esc(t) {
  return String(t).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function partes(f) {
  const [a, m, d] = f.split("-").map(Number);
  return { a, m, d };
}
function fechaLarga(f) {
  const p = partes(f);
  return `${p.d} de ${meses[p.m - 1]} de ${p.a}`;
}
function lugar(id) {
  return lugares.find((l) => l.id == id);
}

function cargar(k) {
  try {
    return JSON.parse(localStorage.getItem(k)) || [];
  } catch (e) {
    return [];
  }
}
function guardar(k, lista) {
  try {
    localStorage.setItem(k, JSON.stringify(lista));
    return true;
  } catch (e) {
    // si la imagen no cabe, se guarda sin ella
    try {
      localStorage.setItem(
        k,
        JSON.stringify(lista.map((x) => ({ ...x, img: "" }))),
      );
    } catch (e2) {}
    return false;
  }
}

// lo que publica cada persona solo queda en su navegador (es una demo)
let misConvs = cargar("usm-convocatorias");
let misExps = cargar("usm-experiencias");

function todasConvs() {
  return [...convocatoriasEjemplo, ...misConvs].sort((a, b) =>
    (a.fecha + a.hora).localeCompare(b.fecha + b.hora),
  );
}
function todasExps() {
  return [...experienciasEjemplo, ...misExps];
}

let tToast;
function aviso(txt) {
  const t = document.getElementById("toast");
  t.innerHTML = ico("check") + esc(txt);
  t.hidden = false;
  clearTimeout(tToast);
  tToast = setTimeout(() => (t.hidden = true), 3200);
}

// ---------- ilustraciones (se usan cuando un lugar no tiene foto) ----------
function ilustracion(id) {
  let s = "";
  if (id == 1) {
    // plaza con edificios y cordillera
    s = `<rect width="320" height="150" fill="#CFE0EE"/>
      <path d="M0 78 50 46 90 66 140 36 200 70 250 44 320 72V100H0z" fill="#9FB4C4"/>
      <rect x="196" y="58" width="124" height="48" fill="#E9E3D8"/><rect x="196" y="58" width="124" height="7" fill="#8F7F6A"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${204 + i * 19}" y="72" width="11" height="22" fill="#56636E"/>`).join("")}
      <rect x="0" y="96" width="320" height="54" fill="#D9D3C8"/>
      <path d="M0 150 140 104h40l140 46z" fill="#C9C2B5"/>
      ${[
        [30, 82, 24],
        [70, 90, 16],
        [165, 88, 18],
        [290, 96, 12],
      ]
        .map(
          (t) =>
            `<rect x="${t[0] - 2}" y="${t[1]}" width="4" height="${t[2]}" fill="#6B5A44"/><circle cx="${t[0]}" cy="${t[1] - 6}" r="${t[2] * 0.7}" fill="#6E9A54"/>`,
        )
        .join("")}`;
  } else if (id == 2) {
    // placa sobre pedestal entre arbustos
    s = `<rect width="320" height="150" fill="#5E7F4C"/>
      ${[
        [20, 40, 40],
        [80, 20, 50],
        [150, 30, 45],
        [230, 15, 55],
        [300, 45, 40],
        [50, 120, 45],
        [270, 125, 50],
      ]
        .map(
          (c) =>
            `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${c[0] % 3 ? "#4A6B3A" : "#7FA05F"}"/>`,
        )
        .join("")}
      <path d="M100 130 115 62h90l15 68z" fill="#A79F92"/>
      <rect x="122" y="70" width="76" height="46" rx="3" fill="#7A6447"/>
      <rect x="128" y="76" width="64" height="34" fill="#94795A"/>
      ${[84, 92, 100].map((y) => `<rect x="136" y="${y}" width="48" height="3" fill="#6A5438"/>`).join("")}
      <rect x="0" y="128" width="320" height="22" fill="#8C8577"/>`;
  } else if (id == 3) {
    // cerro verde con árbol
    s = `<rect width="320" height="150" fill="#D4E6F1"/>
      <path d="M0 90 60 70 120 80 200 62 320 84V150H0z" fill="#A8C3B0"/>
      <path d="M0 150V108Q120 70 230 96T320 104V150z" fill="#86B567"/>
      <rect x="150" y="66" width="8" height="40" fill="#6B5A44"/>
      <circle cx="154" cy="56" r="30" fill="#5E9346"/><circle cx="132" cy="66" r="18" fill="#6FA552"/><circle cx="176" cy="66" r="20" fill="#6FA552"/>
      <rect x="0" y="132" width="320" height="18" fill="#76A659"/>`;
  } else if (id == 4) {
    // auditorio
    s = `<rect width="320" height="150" fill="#4B3427"/>
      <rect x="110" y="16" width="100" height="44" fill="#E9E4DA"/>
      <rect x="0" y="0" width="320" height="12" fill="#3A281E"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${-20 - i * 10} ${78 + i * 13}Q160 ${66 + i * 13} ${340 + i * 10} ${78 + i * 13}" stroke="#7E2E2B" stroke-width="9" fill="none"/>`).join("")}
      ${[40, 280].map((x) => `<rect x="${x - 3}" y="14" width="6" height="60" fill="#A6774F"/>`).join("")}`;
  } else {
    // biblioteca: estantes con libros
    let libros = "";
    const cols = [
      "#7E4A3A",
      "#3D5A80",
      "#A0763C",
      "#5F7A4A",
      "#8B3B3B",
      "#4F4A6E",
    ];
    for (let f = 0; f < 3; f++) {
      let x = 6;
      let i = f * 7;
      while (x < 314) {
        const w = 6 + ((i * 7) % 6);
        libros += `<rect x="${x}" y="${12 + f * 34}" width="${w}" height="${26 - (i % 3) * 3}" fill="${cols[i % 6]}"/>`;
        x += w + 1;
        i++;
      }
      libros += `<rect x="0" y="${38 + f * 34}" width="320" height="4" fill="#5A4130"/>`;
    }
    s = `<rect width="320" height="150" fill="#8A6A4E"/>${libros}
      <rect x="40" y="112" width="240" height="10" fill="#B8915E"/><rect x="0" y="122" width="320" height="28" fill="#6D5440"/>`;
  }
  return `<svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
}

function fotoLugar(l) {
  if (l.foto) {
    return `<div class="foto"><img src="${esc(l.foto)}" alt="${esc(l.nombre)}"><span class="marca-foto">Fotografía referencial</span></div>`;
  }
  return `<div class="foto">${ilustracion(l.id)}<span class="marca-foto">Ilustración referencial</span></div>`;
}

// ---------- dibujo del mapa del campus ----------
// Trazado esquemático basado en el plano oficial del Campus San Joaquín (piso 1).
// Las coordenadas son las del plano: el área visible va de (MX, MY) y mide MW x MH.
const MX = 40,
  MY = 70,
  MW = 1120,
  MH = 990;

function svgMapa() {
  // [x, y, ancho, alto, nombre]
  const edificios = [
    [88, 505, 72, 55],
    [78, 598, 80, 40],
    [92, 672, 70, 48],
    [72, 742, 88, 72, "Auditorio"],
    [300, 275, 120, 28, "Sansanito"],
    [608, 348, 160, 140, "Gimnasio"],
    [632, 488, 136, 152, "Casino"],
    [605, 712, 135, 78],
    [668, 852, 100, 106],
    [596, 818, 40, 80],
    [437, 640, 85, 72],
    [385, 672, 52, 40],
    [175, 742, 230, 48],
    [405, 742, 30, 46],
    [470, 742, 120, 48],
    [175, 790, 30, 128],
    [230, 822, 362, 88, "Edificio A"],
    [230, 910, 370, 42],
    [752, 248, 270, 82],
    [797, 330, 225, 75],
    [797, 405, 225, 60],
    [797, 468, 225, 52],
    [797, 522, 225, 106],
    [1042, 248, 53, 442],
    [1042, 735, 58, 65],
    [1040, 822, 80, 146, "NOAC"],
    [780, 108, 60, 77],
    [852, 130, 170, 55],
  ];
  const estacionamientos = [
    [200, 262, 385, 48],
    [288, 552, 297, 46],
    [200, 330, 70, 210],
  ];
  const arboles = [
    [835, 870],
    [860, 960],
    [990, 880],
    [1000, 950],
    [110, 860],
    [120, 930],
    [300, 975],
    [480, 975],
    [760, 985],
    [1085, 990],
  ];
  const txt = (x, y, t, tam = 13, extra = "") =>
    `<text x="${x}" y="${y}" text-anchor="middle" fill="var(--mapa-texto)" fill-opacity=".7" font-size="${tam}" font-family="Inter, sans-serif" ${extra}>${t}</text>`;

  return `<svg viewBox="${MX} ${MY} ${MW} ${MH}" aria-hidden="true">
    <rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" fill="var(--mapa-fondo)"/>
    <!-- terreno del campus: borde verde y piso interior -->
    <polygon points="160,212 752,212 772,84 1032,84 1145,210 1132,1020 60,1008 64,578" fill="var(--mapa-verde)"/>
    <polygon points="180,232 770,232 790,108 1022,108 1118,230 1110,958 76,955 84,590" fill="var(--mapa-suelo)"/>
    ${estacionamientos.map((e) => `<rect x="${e[0]}" y="${e[1]}" width="${e[2]}" height="${e[3]}" fill="var(--mapa-edif)" opacity=".55"/>`).join("")}

    <!-- áreas verdes y cerrito -->
    <rect x="795" y="640" width="228" height="152" fill="var(--mapa-verde)"/>
    <polygon points="850,645 1015,645 1015,705 940,790 862,790" fill="var(--mapa-tierra)"/>
    ${["805,652 915,790", "1000,645 880,790", "830,790 1015,700"].map((p) => `<polyline points="${p}" stroke="var(--mapa-camino)" stroke-width="6" fill="none"/>`).join("")}
    <rect x="800" y="832" width="225" height="125" fill="var(--mapa-verde)"/>
    <polyline points="815,860 905,925" stroke="var(--mapa-camino)" stroke-width="6" fill="none"/>
    <ellipse cx="920" cy="925" rx="28" ry="10" fill="#8DB6DA"/>
    <rect x="800" y="800" width="236" height="28" fill="var(--mapa-suelo)"/>

    <!-- canchas -->
    <rect x="310" y="325" width="220" height="200" fill="var(--mapa-cancha)"/>
    <g stroke="var(--mapa-camino)" stroke-width="2" fill="none" opacity=".9">
      <rect x="320" y="335" width="200" height="180"/><line x1="420" y1="335" x2="420" y2="515"/><circle cx="420" cy="425" r="22"/>
    </g>
    <rect x="555" y="268" width="125" height="77" fill="var(--mapa-cancha)"/>
    <rect x="565" y="276" width="105" height="61" stroke="var(--mapa-camino)" stroke-width="2" fill="none"/>
    <polygon points="118,355 192,380 168,470 96,448" fill="var(--mapa-edif)" stroke="var(--mapa-borde)"/>

    ${edificios.map((b) => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="2" fill="var(--mapa-edif)" stroke="var(--mapa-borde)"/>`).join("")}
    ${edificios
      .filter((b) => b[4])
      .map((b) =>
        txt(b[0] + b[2] / 2, b[1] + b[3] / 2 + 5, b[4], b[2] < 90 ? 12 : 14),
      )
      .join("")}
    ${arboles.map((a) => `<circle cx="${a[0]}" cy="${a[1]}" r="9" fill="var(--mapa-arbol)"/>`).join("")}

    ${txt(690, 690, "Patio de las Lámparas", 13, 'font-style="italic"')}
    ${txt(420, 470, "Cancha", 13)}
    ${txt(1018, 818, "Busto", 11)}
    ${txt(400, 1045, "AV. VICUÑA MACKENNA", 15, 'letter-spacing="2"')}
    <!-- en el plano oficial el norte apunta a la derecha -->
    <g stroke="var(--mapa-texto)" stroke-width="2" fill="none"><path d="M70 140h56M116 132l10 8-10 8"/></g>
    ${txt(138, 146, "N", 14, 'text-anchor="start" font-weight="700"')}
  </svg>`;
}

// ---------- zoom y arrastre del mapa ----------
// v.z = zoom, v.x / v.y = desplazamiento en px, v.s = escala base
let v = null;

function aplicar() {
  const m = document.querySelector(".mapa");
  const lz = document.querySelector(".lienzo");
  if (!m || !lz) return;
  const cw = m.clientWidth,
    ch = m.clientHeight;
  const w = MW * v.s * v.z,
    h = MH * v.s * v.z;
  // que el mapa nunca deje ver bordes vacíos
  // (en escritorio se deja espacio a la izquierda para que el panel no tape los puntos)
  const holgura = esMovil() ? 0 : 370;
  v.x = Math.min(holgura, Math.max(cw - w, v.x));
  v.y = Math.min(0, Math.max(ch - h, v.y));
  lz.style.width = MW * v.s + "px";
  lz.style.height = MH * v.s + "px";
  lz.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;
  lz.style.setProperty("--z", v.z);
}

function esMovil() {
  return window.innerWidth <= 760;
}

function escalaBase(m) {
  return Math.max(m.clientWidth / MW, m.clientHeight / MH);
}

// deja el punto (px, py) del plano en la posición (fx, fy) del contenedor (0..1)
function centrar(px, py, fx, fy) {
  const m = document.querySelector(".mapa");
  v.x = m.clientWidth * fx - (px - MX) * v.s * v.z;
  v.y = m.clientHeight * fy - (py - MY) * v.s * v.z;
  aplicar();
}

function reiniciarVista() {
  const m = document.querySelector(".mapa");
  const cw = m.clientWidth;
  v = { z: 1, x: 0, y: 0, s: escalaBase(m) };
  // se centra en la zona de los puntos; en escritorio el panel tapa la izquierda
  if (esMovil()) centrar(600, 565, 0.5, 0.5);
  else centrar(580, 780, (370 + cw) / 2 / cw, 0.5);
}

function zoom(f, cx, cy) {
  const m = document.querySelector(".mapa");
  if (cx === undefined) {
    cx = m.clientWidth / 2;
    cy = m.clientHeight / 2;
  }
  const nz = Math.min(3, Math.max(1, v.z * f));
  v.x = cx - (cx - v.x) * (nz / v.z);
  v.y = cy - (cy - v.y) * (nz / v.z);
  v.z = nz;
  aplicar();
}

function activarArrastre(m) {
  let ini = null;
  m.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest(".ctrl, .panel")) return;
    ini = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y, movio: false };
  });
  window.addEventListener("pointermove", (e) => {
    if (!ini) return;
    const dx = e.clientX - ini.x,
      dy = e.clientY - ini.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      ini.movio = true;
      m.classList.add("arrastrando");
    }
    if (ini.movio) {
      v.x = ini.vx + dx;
      v.y = ini.vy + dy;
      aplicar();
    }
  });
  window.addEventListener("pointerup", () => {
    if (ini && ini.movio) {
      // evita que soltar el arrastre sobre un punto lo abra
      m.addEventListener("click", (e) => e.stopPropagation(), {
        capture: true,
        once: true,
      });
    }
    ini = null;
    m.classList.remove("arrastrando");
  });
  m.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const r = m.getBoundingClientRect();
      zoom(
        e.deltaY < 0 ? 1.15 : 1 / 1.15,
        e.clientX - r.left,
        e.clientY - r.top,
      );
    },
    { passive: false },
  );
}

// ---------- vista: mapa ----------
function htmlRecorrido() {
  return `
    <div class="rec-cab"><h2>${esMovil() ? "Tu recorrido sansano" : "Tu recorrido"}</h2><b>${lugares.length} puntos</b></div>
    <p class="rec-intro">${esMovil() ? "Toca un punto del mapa y descubre lo que nos conecta." : "Explora el campus y descubre sus lugares emblemáticos."}</p>
    <ol class="rec-lista">
      ${lugares
        .map(
          (l) => `
        <li><button data-lugar="${l.id}">
          <span class="n">${l.id}</span>
          <span class="t">${esc(l.nombre)}</span>
          ${l.ra ? `<span class="ra" title="Tiene realidad aumentada">${ico("scan")}</span>` : ""}
          ${l.propuesta ? `<span class="prop">Propuesta</span>` : ""}
        </button></li>`,
        )
        .join("")}
    </ol>`;
}

function htmlFicha(l) {
  const conv = todasConvs().find((c) => c.lugar == l.id);
  const num = String(l.id).padStart(2, "0");
  let cajaConv;
  if (conv) {
    cajaConv = `
      <div class="caja">
        <div class="caja-cab"><span class="etiqueta">Próxima convocatoria</span><span class="chip">${conv.propia ? "Tuya" : "Ejemplo"}</span></div>
        <h3>${esc(conv.titulo)}</h3>
        <p class="meta">${fechaLarga(conv.fecha)} · ${esc(conv.hora)}</p>
        <p class="txt">${esc(conv.desc)}</p>
        <a class="btn btn-azul btn-ancho btn-chico" href="#bloque-${conv.id}">Ver convocatoria ${ico("flecha")}</a>
      </div>`;
  } else {
    cajaConv = `
      <div class="caja ${l.propuesta ? "ocre" : ""}">
        <span class="etiqueta">Próxima convocatoria</span>
        <p class="caja-vacia">No hay próximas convocatorias en este lugar</p>
      </div>`;
  }
  const sig = lugares[l.id % lugares.length];
  return `
    <div class="asa"></div>
    <div class="ficha-cab">
      <div>
        <span class="etiqueta">${num} / ${esc(l.tema)}</span>
        <h2 id="ficha-titulo">${esc(l.nombre)}${l.propuesta ? " · propuesta" : ""}</h2>
      </div>
      <button class="cerrar" data-cerrar aria-label="Cerrar ficha">${ico("x")}</button>
    </div>
    ${l.propuesta ? `<p style="margin-top:8px"><span class="chip chip-ocre">Propuesta · pendiente de validar</span></p>` : ""}
    ${fotoLugar(l)}
    <p class="desc">${esc(l.desc)}</p>
    <div class="identidad"><b>Nuestra identidad sansana</b><p>${esc(l.identidad)}</p></div>
    ${conv ? cajaConv : ""}
    <div class="acciones">
      <button class="btn btn-azul btn-ancho" data-conocer aria-expanded="false">Conocer más ${ico("flecha")}</button>
      ${l.ra ? `<a class="btn btn-linea btn-ancho" href="#ra-${l.id}">${ico("scan")} Ver en realidad aumentada</a>` : ""}
    </div>
    <div class="mas" hidden>
      <h3>Sobre este lugar</h3>
      ${l.mas.map((t) => `<p>${esc(t)}</p>`).join("")}
      ${l.dato ? `<div class="dato"><b>${esc(l.dato.titulo)}</b><p>${esc(l.dato.texto)}</p></div>` : ""}
      <a class="btn btn-suave btn-ancho" href="#lugar-${sig.id}">Siguiente parada: ${esc(sig.nombre)} ${ico("flecha")}</a>
    </div>
    ${conv ? "" : cajaConv}`;
}

function vistaMapa() {
  app.innerHTML = `
    <section class="v-mapa">
      <div class="mapa" aria-label="Mapa del Campus San Joaquín">
        <div class="lienzo">
          ${svgMapa()}
          ${lugares
            .map(
              (l) => `
            <button class="pin ${l.propuesta ? "prop" : ""} ${l.izq ? "izq" : ""}" data-lugar="${l.id}"
              style="left:${((l.x - MX) / MW) * 100}%;top:${((l.y - MY) / MH) * 100}%" aria-label="${esc(l.nombre)}">
              <span class="num">${l.id}</span><span class="nom">${esc(l.corto)}</span>
            </button>`,
            )
            .join("")}
        </div>
        <div class="ctrl">
          <button data-reset aria-label="Centrar mapa">${ico("brujula")}</button>
          <div class="ctrl-grupo">
            <button data-zoom="1.3" aria-label="Acercar">${ico("mas")}</button>
            <button data-zoom="0.77" aria-label="Alejar">${ico("menos")}</button>
          </div>
        </div>
        <div class="nota-mapa nota-izq"><span>Cartografía esquemática</span><span>Ubicaciones ilustrativas</span></div>
        <div class="nota-mapa nota-der">Basado en el plano oficial · Piso 1</div>
      </div>
      <aside class="panel recorrido">${htmlRecorrido()}</aside>
      <aside class="panel ficha ficha-abierta" hidden aria-labelledby="ficha-titulo"></aside>
    </section>`;

  const m = app.querySelector(".mapa");
  const vieja = v;
  reiniciarVista();
  if (vieja) {
    v.z = vieja.z;
    v.x = vieja.x;
    v.y = vieja.y;
    aplicar();
  }
  activarArrastre(m);

  app.querySelector("[data-reset]").onclick = reiniciarVista;
  app
    .querySelectorAll("[data-zoom]")
    .forEach((b) => (b.onclick = () => zoom(Number(b.dataset.zoom))));
}

function abrirFicha(id) {
  const f = app.querySelector(".ficha");
  const l = lugar(id);
  app
    .querySelectorAll(".pin")
    .forEach((p) => p.classList.toggle("on", p.dataset.lugar == id));
  app.querySelector(".v-mapa").classList.toggle("con-ficha", !!l);
  if (!l) {
    f.hidden = true;
    return;
  }
  f.innerHTML = htmlFicha(l);
  f.hidden = false;
  f.scrollTop = 0;
  if (esMovil()) centrar(l.x, l.y, 0.4, 0.3);
  else centrar(l.x, l.y, 0.62, 0.5);
}

// ---------- vista: Bloque Sansano ----------
function vistaBloque(resaltar) {
  const lista = todasConvs();
  const mesesUsados = [
    ...new Set(
      lista.map((c) => {
        const p = partes(c.fecha);
        return (
          meses[p.m - 1][0].toUpperCase() + meses[p.m - 1].slice(1) + " " + p.a
        );
      }),
    ),
  ];
  app.innerHTML = `
    <section class="pagina">
      <a class="volver" href="#mapa">${ico("atras")} Volver al Mapa</a>
      <div class="pag-cab">
        <div>
          <span class="etiqueta">Vida en el campus</span>
          <h1>Bloque Sansano</h1>
          <p>Encuéntrate, participa y comparte en las próximas convocatorias del campus.</p>
        </div>
        <a class="btn btn-azul" href="#publicar">${ico("mas")} Publicar convocatoria</a>
      </div>
      <p class="aviso">${ico("info")} Convocatorias de ejemplo · No corresponden a una agenda real.</p>
      <div class="seccion-cab">
        <h2>Próximas convocatorias</h2>
        <span>${lista.length} ${lista.length == 1 ? "actividad" : "actividades"} · ${mesesUsados.join(", ")}</span>
      </div>
      <div class="grilla">
        ${lista
          .map((c) => {
            const p = partes(c.fecha);
            const l = lugar(c.lugar);
            return `
          <article class="tarjeta" id="${c.id}">
            <div class="tar-cab">
              <span class="dia"><b>${p.d}</b><small>${meses[p.m - 1].slice(0, 3).toUpperCase()} ${p.a}</small></span>
              <span class="chip ${c.propia ? "chip-azul" : ""}">${c.propia ? "Tuya" : "Ejemplo"}</span>
            </div>
            ${c.img ? `<img class="img-conv" src="${c.img}" alt="">` : ""}
            <h3>${esc(c.titulo)}</h3>
            <p class="meta">${fechaLarga(c.fecha)}<br>${esc(c.hora)} h</p>
            <span class="lugar-link">${ico("pin")} ${esc(l ? l.nombre : "")}</span>
            <p class="txt">${esc(c.desc)}</p>
            <a class="btn btn-linea btn-ancho" href="#lugar-${c.lugar}">${ico("pin")} Ver en el mapa</a>
          </article>`;
          })
          .join("")}
      </div>
      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><span>Vida universitaria</span></footer>
    </section>`;
  marcar(resaltar);
}

// ---------- vista: Comunidad ----------
function vistaComunidad(resaltar) {
  const lista = todasExps();
  app.innerHTML = `
    <section class="pagina">
      <a class="volver" href="#mapa">${ico("atras")} Volver al Mapa</a>
      <div class="pag-cab">
        <div>
          <span class="etiqueta">Lo que nos conecta</span>
          <h1>Comunidad</h1>
          <p>Experiencias y opiniones sobre la vida universitaria y los lugares que compartimos.</p>
        </div>
        <a class="btn btn-azul" href="#compartir">${ico("mensaje")} Compartir experiencia</a>
      </div>
      <p class="aviso">${ico("info")} Experiencias de ejemplo · No son testimonios reales.</p>
      <div class="seccion-cab">
        <h2>Voces de la vida universitaria</h2>
        <span>${experienciasEjemplo.length} experiencias de ejemplo${misExps.length ? ` · ${misExps.length} tuya${misExps.length > 1 ? "s" : ""}` : ""}</span>
      </div>
      <div class="grilla">
        ${lista
          .map((x) => {
            const l = lugar(x.lugar);
            return `
          <article class="tarjeta" id="${x.id}">
            <div class="cat"><span class="ico-caja">${ico(x.icono)}</span><span class="etiqueta">${esc(x.cat)}</span></div>
            <h3>${esc(x.titulo)}</h3>
            <p class="txt">${esc(x.texto)}</p>
            <hr>
            <a class="lugar-link" href="#lugar-${x.lugar}">${ico("pin")} ${esc(l ? l.nombre : "")}</a>
            <span class="pie">${x.propia ? "Compartida por ti" : "Experiencia de ejemplo"}</span>
            <a class="btn btn-linea btn-ancho" href="#compartir-${x.lugar}">Compartir experiencia</a>
          </article>`;
          })
          .join("")}
      </div>
      <div class="franja">
        <div><h3>Cada lugar tiene algo que contar</h3><p>Comparte una vivencia o una opinión con respeto por la comunidad.</p></div>
        <b>Encuentro · Pausa · Cultura</b>
      </div>
      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><span>Vida universitaria</span></footer>
    </section>`;
  marcar(resaltar);
}

// resalta una tarjeta (ej: al venir desde "Ver convocatoria")
function marcar(id) {
  if (!id) return;
  const t = document.getElementById(id);
  if (!t) return;
  t.classList.add("brilla");
  t.scrollIntoView({ block: "center", behavior: "smooth" });
  setTimeout(() => t.classList.remove("brilla"), 2600);
}

// ---------- formularios ----------
function opcionesLugar(nombre, elegido) {
  return `<div class="opciones" role="radiogroup">
    ${lugares
      .map(
        (l) => `
      <label><input type="radio" name="${nombre}" value="${l.id}" ${l.id == elegido ? "checked" : ""}>
        <span>${esc(l.nombre)}${l.propuesta ? "<small>Propuesta pendiente de validar</small>" : ""}</span>
      </label>`,
      )
      .join("")}
  </div>`;
}

function marcarError(form, campo, msj) {
  const c = form.querySelector(`[data-campo="${campo}"]`);
  c.classList.add("error");
  let e = c.querySelector(".msj-error");
  if (!e) {
    e = document.createElement("p");
    e.className = "msj-error";
    c.appendChild(e);
  }
  e.textContent = msj;
}
function limpiarErrores(form) {
  form
    .querySelectorAll(".campo.error")
    .forEach((c) => c.classList.remove("error"));
  form.querySelectorAll(".msj-error").forEach((e) => e.remove());
}

function vistaPublicar() {
  app.innerHTML = `
    <section class="pagina">
      <a class="volver" href="#bloque">${ico("atras")} Volver a Bloque Sansano</a>
      <div class="pag-cab"><div>
        <span class="etiqueta">Bloque Sansano</span>
        <h1>Publicar convocatoria</h1>
        <p>Invita a la comunidad a participar. Completa los datos de tu actividad.</p>
      </div></div>
      <div class="form-grid">
        <form class="form" id="f-conv" novalidate>
          <div class="campo" data-campo="titulo">
            <label for="c-titulo">Nombre</label>
            <input type="text" id="c-titulo" maxlength="80" placeholder="Escribe el nombre de la actividad">
          </div>
          <div class="campo" data-campo="desc">
            <label for="c-desc">Descripción</label>
            <textarea id="c-desc" maxlength="300" placeholder="Cuenta de qué se trata y a quién está dirigida."></textarea>
          </div>
          <div class="dos">
            <div class="campo" data-campo="fecha"><label for="c-fecha">Fecha</label><input type="date" id="c-fecha"></div>
            <div class="campo" data-campo="hora"><label for="c-hora">Hora</label><input type="time" id="c-hora"></div>
          </div>
          <div class="campo" data-campo="lugar">
            <span class="lbl">Lugar</span>
            <span class="ayuda">Selecciona un lugar del campus.</span>
            ${opcionesLugar("c-lugar")}
          </div>
          <div class="campo" data-campo="img">
            <span class="lbl">Imagen</span>
            <div class="subir" id="zona">
              ${ico("imagen")}
              <span>${esMovil() ? "Agrega una imagen de la actividad" : "Arrastra una imagen o selecciónala desde tu dispositivo"}</span>
              <label class="btn btn-linea btn-chico" for="c-img">Seleccionar imagen</label>
              <input type="file" id="c-img" accept="image/png, image/jpeg" hidden>
              <small>JPG o PNG · Máximo 5 MB</small>
            </div>
            <div class="previa" id="previa" hidden></div>
          </div>
          <div class="form-pie">
            <button class="btn btn-azul" type="submit">Publicar convocatoria</button>
            <a class="btn btn-linea" href="#bloque">Cancelar</a>
          </div>
          <p class="demo">Formulario de demostración. La convocatoria solo se guarda en este navegador.</p>
        </form>
        <aside class="lado">
          ${ico("megafono")}
          <h3>Una invitación clara nos reúne</h3>
          <p>Usa un nombre breve, explica la actividad y revisa la fecha y la hora antes de publicar.</p>
          <hr>
          <p>Elige uno de los lugares del campus para que la convocatoria pueda ubicarse en el mapa.</p>
        </aside>
      </div>
    </section>`;

  const form = document.getElementById("f-conv");
  let img = "";

  // imagen: botón o arrastrar
  const zona = document.getElementById("zona");
  const previa = document.getElementById("previa");
  function leer(archivo) {
    limpiarErrores(form);
    if (!archivo) return;
    if (!/image\/(png|jpeg)/.test(archivo.type))
      return marcarError(form, "img", "La imagen debe ser JPG o PNG.");
    if (archivo.size > 5 * 1024 * 1024)
      return marcarError(
        form,
        "img",
        "La imagen pesa más de 5 MB. Prueba con una más liviana.",
      );
    const r = new FileReader();
    r.onload = () => {
      img = r.result;
      zona.hidden = true;
      previa.hidden = false;
      previa.innerHTML = `<img src="${img}" alt="Vista previa"><button type="button" class="btn btn-linea btn-chico">Quitar</button>`;
      previa.querySelector("button").onclick = () => {
        img = "";
        previa.hidden = true;
        zona.hidden = false;
      };
    };
    r.readAsDataURL(archivo);
  }
  document.getElementById("c-img").onchange = (e) => leer(e.target.files[0]);
  zona.ondragover = (e) => {
    e.preventDefault();
    zona.classList.add("encima");
  };
  zona.ondragleave = () => zona.classList.remove("encima");
  zona.ondrop = (e) => {
    e.preventDefault();
    zona.classList.remove("encima");
    leer(e.dataTransfer.files[0]);
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    limpiarErrores(form);
    const d = {
      titulo: form.querySelector("#c-titulo").value.trim(),
      desc: form.querySelector("#c-desc").value.trim(),
      fecha: form.querySelector("#c-fecha").value,
      hora: form.querySelector("#c-hora").value,
      lugar: (form.querySelector("[name=c-lugar]:checked") || {}).value,
    };
    let ok = true;
    if (!d.titulo) {
      marcarError(form, "titulo", "Escribe el nombre de la actividad.");
      ok = false;
    }
    if (!d.desc) {
      marcarError(form, "desc", "Agrega una descripción breve.");
      ok = false;
    }
    if (!d.fecha) {
      marcarError(form, "fecha", "Elige una fecha.");
      ok = false;
    }
    if (!d.hora) {
      marcarError(form, "hora", "Elige una hora.");
      ok = false;
    }
    if (!d.lugar) {
      marcarError(form, "lugar", "Selecciona dónde será la actividad.");
      ok = false;
    }
    if (!ok) {
      form
        .querySelector(".error input, .error textarea, .error .opciones")
        ?.scrollIntoView({ block: "center" });
      return;
    }

    const nueva = {
      ...d,
      lugar: Number(d.lugar),
      id: "mc" + Date.now(),
      propia: true,
      img,
    };
    misConvs.push(nueva);
    const cupo = guardar("usm-convocatorias", misConvs);
    aviso(
      cupo
        ? "Convocatoria publicada"
        : "Convocatoria publicada (la imagen no se pudo guardar)",
    );
    location.hash = "bloque-" + nueva.id;
  };
}

function vistaCompartir(lugarId) {
  app.innerHTML = `
    <section class="pagina">
      <a class="volver" href="#comunidad">${ico("atras")} Volver a Comunidad</a>
      <div class="pag-cab"><div>
        <span class="etiqueta">Comunidad</span>
        <h1>Compartir experiencia</h1>
        <p>Cuenta una vivencia o una opinión sobre un lugar del campus.</p>
      </div></div>
      <div class="form-grid">
        <form class="form" id="f-exp" novalidate>
          <div class="campo" data-campo="cat">
            <span class="lbl">Tipo de experiencia</span>
            <div class="chips-radio">
              <label><input type="radio" name="e-cat" value="users" checked>${ico("users")} Encuentro</label>
              <label><input type="radio" name="e-cat" value="coffee">${ico("coffee")} Pausa</label>
              <label><input type="radio" name="e-cat" value="music">${ico("music")} Cultura universitaria</label>
            </div>
          </div>
          <div class="campo" data-campo="titulo">
            <label for="e-titulo">Título</label>
            <input type="text" id="e-titulo" maxlength="70" placeholder="Ej: Mi lugar favorito entre clases">
          </div>
          <div class="campo" data-campo="texto">
            <label for="e-texto">Tu experiencia</label>
            <textarea id="e-texto" maxlength="400" placeholder="¿Qué te pasa en este lugar? ¿Qué te gustaría que tuviera?"></textarea>
            <span class="ayuda" id="e-cont">0 / 400</span>
          </div>
          <div class="campo" data-campo="lugar">
            <span class="lbl">Lugar</span>
            ${opcionesLugar("e-lugar", lugarId)}
          </div>
          <div class="form-pie">
            <button class="btn btn-azul" type="submit">Compartir experiencia</button>
            <a class="btn btn-linea" href="#comunidad">Cancelar</a>
          </div>
          <p class="demo">Formulario de demostración. La experiencia solo se guarda en este navegador.</p>
        </form>
        <aside class="lado">
          ${ico("mensaje")}
          <h3>Cada lugar tiene algo que contar</h3>
          <p>Comparte una vivencia o una opinión con respeto por la comunidad.</p>
          <hr>
          <p>Las experiencias ayudan a decidir qué lugares sumar al recorrido.</p>
        </aside>
      </div>
    </section>`;

  const form = document.getElementById("f-exp");
  const txt = form.querySelector("#e-texto");
  txt.oninput = () =>
    (document.getElementById("e-cont").textContent =
      txt.value.length + " / 400");

  form.onsubmit = (e) => {
    e.preventDefault();
    limpiarErrores(form);
    const icono = form.querySelector("[name=e-cat]:checked").value;
    const cats = {
      users: "Encuentro",
      coffee: "Pausa",
      music: "Cultura universitaria",
    };
    const d = {
      titulo: form.querySelector("#e-titulo").value.trim(),
      texto: txt.value.trim(),
      lugar: (form.querySelector("[name=e-lugar]:checked") || {}).value,
    };
    let ok = true;
    if (!d.titulo) {
      marcarError(form, "titulo", "Ponle un título a tu experiencia.");
      ok = false;
    }
    if (!d.texto) {
      marcarError(form, "texto", "Cuéntanos tu experiencia.");
      ok = false;
    }
    if (!d.lugar) {
      marcarError(form, "lugar", "Selecciona un lugar.");
      ok = false;
    }
    if (!ok) return;

    const nueva = {
      ...d,
      lugar: Number(d.lugar),
      icono,
      cat: cats[icono],
      id: "me" + Date.now(),
      propia: true,
    };
    misExps.push(nueva);
    guardar("usm-experiencias", misExps);
    aviso("Experiencia compartida");
    location.hash = "comunidad-" + nueva.id;
  };
}

// ---------- vista: realidad aumentada ----------
let stream = null;

function apagarCamara() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
}

function guiaPlaca() {
  return `<svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="400" height="340" fill="var(--sup-2)"/>
    <rect y="250" width="400" height="90" fill="var(--azul-claro)"/>
    <path d="M140 290 155 168h90l15 122z" fill="var(--mapa-borde)"/>
    <rect x="148" y="120" width="104" height="70" rx="4" fill="var(--sup)" stroke="var(--azul)" stroke-width="3"/>
    <rect x="166" y="140" width="68" height="4" rx="2" fill="var(--azul)" opacity=".5"/>
    <rect x="166" y="152" width="68" height="4" rx="2" fill="var(--azul)" opacity=".5"/>
    <rect x="166" y="164" width="44" height="4" rx="2" fill="var(--azul)" opacity=".5"/>
  </svg>`;
}

// Esta función muestra el contenido cuando la placa está encuadrada.
// Para RA real (por ejemplo con MindAR), llamar a mostrarCapa(l) cuando la librería reconozca la placa.
function mostrarCapa(l, sinCamara) {
  const visor = document.getElementById("visor");
  visor.querySelector(".capa-ra")?.remove();
  visor.querySelector("[data-encuadre]")?.remove();
  visor.insertAdjacentHTML(
    "beforeend",
    `
    <div class="capa-ra">
      <span class="etiqueta">${sinCamara ? ico("info") + " Contenido de la placa" : ico("check") + " Placa encontrada"}</span>
      <h3>${esc(l.nombre)}</h3>
      ${l.mas.map((t) => `<p>${esc(t)}</p>`).join("")}
      ${l.dato ? `<p><b>${esc(l.dato.titulo)}.</b> ${esc(l.dato.texto)}</p>` : ""}
    </div>`,
  );
}

function vistaRA(id) {
  const l = lugar(id);
  if (!l || !l.ra) {
    location.hash = "mapa";
    return;
  }
  app.innerHTML = `
    <section class="pagina ra">
      <a class="volver" href="#lugar-${l.id}">${ico("atras")} Volver al Mapa</a>
      <div class="pag-cab"><div>
        <span class="etiqueta" style="display:flex;align-items:center;gap:6px">${ico("scan")} Experiencia RA</span>
        <h1>Apunta tu cámara hacia la placa</h1>
        <p class="lugar-ra">${esc(l.nombre)}</p>
        <p>Encuadra ${esc(l.placa)} para comenzar.</p>
      </div></div>
      <div class="visor guia" id="visor">
        ${guiaPlaca()}
        <div class="esquinas"><i></i><i></i><i></i><i></i></div>
        <span class="marca-foto">Guía ilustrativa · No es fotografía</span>
      </div>
      <ul class="tips">
        <li>${ico("foco")} Mantén la placa completa dentro del marco.</li>
        <li>${ico("sol")} Busca buena luz y evita reflejos.</li>
      </ul>
      <p class="aviso" id="ra-aviso">${ico("info")} La experiencia pedirá acceso a tu cámara al iniciarse.</p>
      <div class="ra-botones" id="ra-botones">
        <button class="btn btn-azul" id="ra-iniciar">${ico("scan")} Iniciar experiencia RA ${ico("flecha")}</button>
        <button class="btn btn-linea" id="ra-sin">Ver el contenido sin cámara</button>
      </div>
    </section>`;

  document.getElementById("ra-sin").onclick = () => mostrarCapa(l, true);

  document.getElementById("ra-iniciar").onclick = async () => {
    const av = document.getElementById("ra-aviso");
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
    } catch (e) {
      av.innerHTML = `${ico("info")} No se pudo abrir la cámara. Revisa el permiso del navegador o abre la app desde tu celular. Mientras tanto puedes ver el contenido sin cámara.`;
      return;
    }
    const visor = document.getElementById("visor");
    visor.classList.remove("guia");
    visor.innerHTML = `
      <video autoplay playsinline muted></video>
      <div class="esquinas"><i></i><i></i><i></i><i></i></div>
      <button class="btn btn-azul btn-chico" data-encuadre style="position:absolute;left:50%;bottom:14px;transform:translateX(-50%)">Ya encuadré la placa</button>`;
    visor.querySelector("video").srcObject = stream;
    visor.querySelector("[data-encuadre]").onclick = () => mostrarCapa(l);
    av.innerHTML = `${ico("camara")} Cámara activa. Encuadra la placa dentro del marco.`;
    document.getElementById("ra-botones").innerHTML =
      `<button class="btn btn-linea" id="ra-parar">Detener cámara</button>`;
    document.getElementById("ra-parar").onclick = () => vistaRA(id);
  };
}

// ---------- navegación ----------
let vistaActual = "";

function render() {
  const h = decodeURIComponent(location.hash.slice(1)) || "mapa";
  const [nom, param] = [h.split("-")[0], h.split("-").slice(1).join("-")];
  apagarCamara();

  const tab =
    {
      mapa: "mapa",
      lugar: "mapa",
      ra: "mapa",
      bloque: "bloque",
      publicar: "bloque",
      comunidad: "comunidad",
      compartir: "comunidad",
    }[nom] || "mapa";
  document
    .querySelectorAll(".tabs a")
    .forEach((a) => a.classList.toggle("on", a.dataset.tab == tab));

  if (nom == "mapa" || nom == "lugar") {
    if (vistaActual != "mapa") {
      vistaMapa();
      window.scrollTo(0, 0);
    }
    vistaActual = "mapa";
    abrirFicha(nom == "lugar" ? param : null);
    return;
  }
  vistaActual = nom;
  window.scrollTo(0, 0);
  if (nom == "bloque") vistaBloque(param);
  else if (nom == "comunidad") vistaComunidad(param);
  else if (nom == "publicar") vistaPublicar();
  else if (nom == "compartir") vistaCompartir(param);
  else if (nom == "ra") vistaRA(param);
  else {
    location.hash = "mapa";
  }
}

// clics en puntos del mapa, en la lista del recorrido y en "cerrar" / "conocer más"
app.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lugar]");
  if (b) {
    location.hash = "lugar-" + b.dataset.lugar;
    return;
  }
  if (e.target.closest("[data-cerrar]")) {
    location.hash = "mapa";
    return;
  }
  const c = e.target.closest("[data-conocer]");
  if (c) {
    const mas = app.querySelector(".mas");
    mas.hidden = !mas.hidden;
    c.setAttribute("aria-expanded", !mas.hidden);
    c.innerHTML = mas.hidden ? `Conocer más ${ico("flecha")}` : "Ver menos";
    if (!mas.hidden)
      mas.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && location.hash.startsWith("#lugar-"))
    location.hash = "mapa";
});

window.addEventListener("hashchange", render);
window.addEventListener("resize", () => {
  if (vistaActual == "mapa" && v) {
    const m = document.querySelector(".mapa");
    v.s = escalaBase(m);
    aplicar();
  }
});

render();
