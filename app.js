// Campus San Joaquín · app del mapa interactivo
// HTML/CSS/JS sin librerías. Las vistas se eligen con el # de la URL:
// #inicio, #mapa, #lugar-2, #organizacion, #bloque, #comunidad, #publicar, #compartir, #ra-1

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
// "12:00:00" -> "12:00" (Supabase guarda la hora con segundos)
function horaCorta(h) {
  return String(h || "").slice(0, 5);
}
// fecha y hora con el mismo formato en todo el sitio: "17 de noviembre de 2026 · 12:00"
function fechaHora(f, h) {
  return fechaLarga(f) + (h ? " · " + horaCorta(h) : "");
}
function iconoCat(x) {
  return (
    x.icono ||
    { Encuentro: "users", Pausa: "coffee", "Cultura universitaria": "music" }[x.cat] ||
    "mensaje"
  );
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
  if (!l.foto) {
    return `<div class="foto">${ilustracion(l.id)}<span class="marca-foto">Ilustración referencial</span></div>`;
  }
  const fotos = [
    l.foto,
    ...(Array.isArray(l.galeria) ? l.galeria : [])
  ];
  return `
    <div class="foto">
      <img
        src="${esc(l.foto)}"
        alt="${esc(l.nombre)}"
        loading="lazy"
      >
    </div>
    ${fotos.length > 1 ? `
      <details class="galeria-lugar">
        <summary>Ver fotografías (${fotos.length})</summary>
        <div class="galeria-grid">
          ${fotos.map((ruta, i) => `
            <a
              href="${esc(ruta)}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir fotografía ${i + 1} de ${esc(l.nombre)}"
            >
              <img
                src="${esc(ruta)}"
                alt="${esc(l.nombre)} - fotografía ${i + 1}"
                loading="lazy"
              >
            </a>
          `).join("")}
        </div>
      </details>
    ` : ""}
  `;
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
        <div class="caja-cab"><span class="etiqueta">Próxima convocatoria</span><span class="chip ${conv.propia ? "" : "chip-azul"}">${conv.propia ? "Tuya" : "Oficial"}</span></div>
        <h3>${esc(conv.titulo)}</h3>
        <p class="meta">${esc(fechaHora(conv.fecha, conv.hora))}</p>
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

// ---------- vista: conoce Bloque Sansano ----------
// Los espacios provisionales se completarán solo con información oficial validada.
function vistaOrganizacion() {
  const fotoPendiente = (nombre) => `
    <div class="org-foto" role="img" aria-label="Fotografía pendiente: ${nombre}">
      ${ico("imagen")}
      <b>Fotografía oficial pendiente</b>
      <small>${nombre}</small>
    </div>`;

  app.innerHTML = `
    <section class="org-pagina">
      <a class="volver" href="#inicio">${ico("atras")} Volver al inicio</a>

      <header class="org-hero">
        <div>
          <span class="etiqueta">Vida en el campus</span>
          <h1>Conoce Bloque Sansano</h1>
          <p>Un espacio para conocer a la agrupación, su historia y su participación en la comunidad universitaria.</p>
          <p class="org-pendiente">Contenido pendiente de validación oficial</p>
        </div>
        ${fotoPendiente("Imagen de la agrupación por proporcionar")}
      </header>

      <section class="org-seccion" aria-labelledby="org-quienes">
        <h2 id="org-quienes">¿Quiénes somos?</h2>
        <div class="org-panel">
          <span class="etiqueta">Texto provisional</span>
          <h3>Historia y origen de Bloque Sansano</h3>
          <p>En este espacio se incorporará la presentación oficial de la agrupación: cómo surgió, cuáles son sus propósitos y cómo se vincula con la comunidad universitaria.</p>
          <small>Pendiente de información y validación de sus representantes.</small>
        </div>
      </section>

      <section class="org-seccion" aria-labelledby="org-mision">
        <h2 id="org-mision">Misión y objetivos</h2>
        <div class="org-tarjetas">
          <article class="org-tarjeta">
            ${ico("foco")}
            <h3>Misión</h3>
            <p>Incorporar aquí la misión oficial de la agrupación.</p>
          </article>
          <article class="org-tarjeta">
            ${ico("pin")}
            <h3>Objetivos</h3>
            <p>Incorporar aquí los objetivos definidos por Bloque Sansano.</p>
          </article>
          <article class="org-tarjeta">
            ${ico("users")}
            <h3>Valores</h3>
            <p>Incorporar aquí los valores que la agrupación declare.</p>
          </article>
        </div>
      </section>

      <section class="org-seccion" aria-labelledby="org-hacemos">
        <h2 id="org-hacemos">¿Qué hacemos?</h2>
        <p class="org-intro">Espacios para presentar iniciativas reales de la agrupación, pendientes de validar.</p>
        <div class="org-iniciativas">
          ${[1, 2, 3].map((numero) => `
            <article class="org-iniciativa">
              ${fotoPendiente(`Imagen de la iniciativa ${numero}`)}
              <div>
                <h3>Iniciativa ${numero} · Por completar</h3>
                <p>Nombre y descripción oficial de una iniciativa realizada por Bloque Sansano.</p>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="org-seccion" aria-labelledby="org-galeria">
        <h2 id="org-galeria">Galería</h2>
        <p class="org-intro">Fotografías de integrantes y actividades · Material oficial por proporcionar.</p>
        <div class="org-galeria">
          ${[1, 2, 3, 4, 5, 6].map((numero) => fotoPendiente(`Fotografía ${numero} por proporcionar`)).join("")}
        </div>
      </section>

      <section class="org-seccion" aria-labelledby="org-contacto">
        <h2 id="org-contacto">Redes y contacto</h2>
        <div class="org-contactos">
          <article class="org-tarjeta">
            ${ico("mensaje")}
            <h3>Instagram</h3>
            <p>Usuario oficial por confirmar.</p>
            <small>Sin enlace activo hasta su validación.</small>
          </article>
          <article class="org-tarjeta">
            ${ico("mensaje")}
            <h3>Otros medios oficiales</h3>
            <p>Correo o medio de contacto oficial por confirmar.</p>
            <small>Sin enlace activo hasta su validación.</small>
          </article>
        </div>
      </section>

      <section class="org-cta" aria-labelledby="org-actividades">
        <div>
          <span class="etiqueta">Actividades</span>
          <h2 id="org-actividades">Próximas convocatorias</h2>
          <p>Consulta las actividades publicadas por los representantes de Bloque Sansano.</p>
        </div>
        <a class="btn btn-azul" href="#bloque">Ver próximas convocatorias ${ico("flecha")}</a>
      </section>

      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><span>Contenido de la agrupación pendiente de validación</span></footer>
    </section>`;
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
      <a class="volver" href="#organizacion">${ico("atras")} Conoce Bloque Sansano</a>
      <div class="pag-cab">
        <div>
          <span class="etiqueta">Vida en el campus</span>
          <h1>Próximas convocatorias</h1>
          <p>Encuéntrate, participa y comparte en las próximas convocatorias del campus.</p>
        </div>
      </div>
      <p class="aviso">${ico("info")} Las convocatorias son publicadas por representantes autorizados del Bloque Sansano.</p>
      <div class="seccion-cab">
        <h2>Próximas convocatorias</h2>
        <span>${lista.length} ${lista.length == 1 ? "actividad" : "actividades"}${mesesUsados.length ? " · " + mesesUsados.join(", ") : ""}</span>
      </div>
      ${lista.length ? "" : `<div class="vacio">Aún no hay convocatorias publicadas. Vuelve pronto.</div>`}
      <div class="grilla">
        ${lista
          .map((c) => {
            const p = partes(c.fecha);
            const l = lugar(c.lugar);
            return `
          <article class="tarjeta" id="${c.id}">
            <div class="tar-cab">
              <span class="dia"><b>${p.d}</b><small>${meses[p.m - 1].slice(0, 3).toUpperCase()} ${p.a}</small></span>
              <span class="chip ${c.propia ? "" : "chip-azul"}">${c.propia ? "Tuya" : "Oficial"}</span>
            </div>
            ${c.img ? `<img class="img-conv" src="${c.img}" alt="">` : ""}
            <h3>${esc(c.titulo)}</h3>
            <p class="meta">${esc(fechaHora(c.fecha, c.hora))}</p>
            <span class="lugar-link">${ico("pin")} ${esc(l ? l.nombre : "")}</span>
            <p class="txt">${esc(c.desc)}</p>
            <a class="btn btn-linea btn-ancho" href="${l ? `#lugar-${c.lugar}` : "#mapa"}">${ico("pin")} ${l ? "Ver en el mapa" : "Ver mapa"}</a>
          </article>`;
          })
          .join("")}
      </div>
      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><a class="link-rep" href="admin.html">${ico("users")} ¿Eres representante? Ingresa aquí</a></footer>
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
      <p class="aviso">${ico("info")} Experiencias compartidas por la comunidad sansana.</p>
      <div class="seccion-cab">
        <h2>Voces de la vida universitaria</h2>
        <span>${lista.length} ${lista.length == 1 ? "experiencia" : "experiencias"}</span>
      </div>
      ${lista.length ? "" : `<div class="vacio">Todavía no hay experiencias. ¡Sé la primera persona en compartir una!</div>`}
      <div class="grilla">
        ${lista
          .map((x) => {
            const l = lugar(x.lugar);
            return `
          <article class="tarjeta" id="${x.id}">
            <div class="cat"><span class="ico-caja">${ico(iconoCat(x))}</span><span class="etiqueta">${esc(x.cat)}</span></div>
            <h3>${esc(x.titulo)}</h3>
            <p class="txt">${esc(x.texto)}</p>
            <hr>
            <a class="lugar-link" href="#lugar-${x.lugar}">${ico("pin")} ${esc(l ? l.nombre : "")}</a>
            <span class="pie">${x.propia ? "Compartida por ti" : "Compartida por la comunidad"}</span>
            <a class="btn btn-linea btn-ancho" href="#compartir-${x.lugar}">Compartir experiencia</a>
          </article>`;
          })
          .join("")}
      </div>
      <div class="franja">
        <div><h3>Cada lugar tiene algo que contar</h3><p>Comparte una vivencia o una opinión con respeto por la comunidad.</p></div>
        <b>Encuentro · Pausa · Cultura</b>
      </div>
      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><a class="link-rep" href="admin.html">${ico("users")} ¿Eres representante? Ingresa aquí</a></footer>
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

// La publicación de convocatorias se realiza únicamente en admin.html.

// ---------- vista: compartir experiencia (se guarda en Supabase) ----------
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
          <p class="demo">Tu experiencia se publicará en Comunidad para que otras personas la lean.</p>
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

  form.onsubmit = async (e) => {
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
    try {
      const boton = form.querySelector('[type="submit"]');
      if (boton) boton.disabled = true;
      await USM_COMUNIDAD.enviar("experiencias", {
        titulo: nueva.titulo,
        texto: nueva.texto,
        categoria: nueva.cat,
        lugar_id: Number(nueva.lugar)
      });

      aviso("¡Experiencia publicada!");
      await USM_COMUNIDAD.cargar();
      location.hash = "comunidad";

    } catch (error) {
      console.error(error);
      aviso("No se pudo publicar la experiencia");
      const boton = form.querySelector('[type="submit"]');
      if (boton) boton.disabled = false;
    }
  };
}

// ---------- vista: realidad aumentada ----------
let stream = null;

function apagarCamara() {
  if (stream){
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  // al eliminar el iframe, se cierra la experiencia RA
  const visorRA = document.getElementById("ra-frame");
  if(visorRA){
    visorRA.remove();
  }
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

// Experiencia interactiva de la Plaza: se activa con reconocimiento RA
// o desde el botón "Explorar sin cámara".
// El testamento y el significado oficial del lema se contrastaron con usm.cl.
// La reflexión social actual está presentada como interpretación, no como cita.
function mostrarLegadoPlaza(sinCamara = false) {
  const contenedor = document.querySelector(".pagina.ra");
  if (!contenedor) return;

  let seccion = document.getElementById("plaza-legado");
  if (seccion) {
    // No reiniciar la lectura si MindAR pierde y vuelve a encontrar el objetivo.
    if (!sinCamara) {
      const estado = seccion.querySelector(".plaza-legado__eyebrow");
      if (estado) estado.innerHTML = ico("check") + " Monumento reconocido";
    }
    if (sinCamara) seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  seccion = document.createElement("section");
  seccion.id = "plaza-legado";
  seccion.className = "plaza-legado";
  seccion.setAttribute("aria-label", "Explora el legado de Federico Santa María");
  seccion.innerHTML = `
    <div class="plaza-legado__hero">
      <div class="plaza-legado__imagen" aria-hidden="true">
        <img src="img/plaza.jpg" alt="" loading="lazy">
        <span class="plaza-legado__destello"></span>
        <span class="plaza-legado__lema">EX UMBRA IN SOLEM</span>
      </div>
      <div class="plaza-legado__intro">
        <span class="plaza-legado__eyebrow">${ico("check")} ${sinCamara ? "Vista previa sin cámara" : "Monumento reconocido"}</span>
        <span class="plaza-legado__sobretitulo">EDUCACIÓN · IGUALDAD DE OPORTUNIDADES · COMUNIDAD</span>
        <h2>De la sombra <em>a la luz.</em></h2>
        <p>El legado de Federico Santa María nos invita a pensar quiénes pueden acceder al conocimiento y qué responsabilidad tenemos frente a la desigualdad.</p>
      </div>
    </div>

    <div class="plaza-legado__cuerpo">
      <div class="plaza-legado__avance">
        <span id="plaza-paso-texto" aria-live="polite">Capítulo 1 de 3</span>
        <span class="plaza-legado__linea" aria-hidden="true"><span id="plaza-paso-barra" style="width:33.33%"></span></span>
      </div>

      <div class="plaza-legado__tabs" role="tablist" aria-label="Capítulos del legado">
        <button type="button" role="tab" id="plaza-tab-0" aria-selected="true" aria-controls="plaza-panel-0" data-plaza-paso="0"><span>01</span> El testamento</button>
        <button type="button" role="tab" id="plaza-tab-1" aria-selected="false" aria-controls="plaza-panel-1" data-plaza-paso="1"><span>02</span> El lema</button>
        <button type="button" role="tab" id="plaza-tab-2" aria-selected="false" aria-controls="plaza-panel-2" data-plaza-paso="2"><span>03</span> Tu legado</button>
      </div>

      <article class="plaza-legado__panel" id="plaza-panel-0" role="tabpanel" aria-labelledby="plaza-tab-0">
        <span class="plaza-legado__marca">01 · EDUCACIÓN Y DESIGUALDAD SOCIAL</span>
        <h3>El conocimiento no debería depender del origen social</h3>
        <p>A comienzos del siglo XX, las condiciones económicas limitaban las oportunidades de estudiar. Federico Santa María reconoció esa desigualdad y destinó su patrimonio a crear oportunidades educativas para jóvenes de escasos recursos que demostraran mérito y aptitudes.</p>
        <p>En su testamento de 1920 expresó que era importante <strong>«levantar al proletario de mi patria»</strong>. Su proyecto entendía la educación como una vía de desarrollo social y planteaba que quienes tenían más recursos debían contribuir a ampliar las oportunidades de aprendizaje.</p>
        <p class="plaza-legado__nota">Contexto histórico: su propuesta se dirigía especialmente a jóvenes meritorios de escasos recursos; no establecía un acceso universal sin condiciones.</p>
        <a class="plaza-legado__enlace" href="https://usm.cl/universidad/federico-santa-maria/testamento/" target="_blank" rel="noopener noreferrer">Leer el testamento original (USM) ${ico("flecha")}</a>
      </article>

      <article class="plaza-legado__panel" id="plaza-panel-1" role="tabpanel" aria-labelledby="plaza-tab-1" hidden>
        <span class="plaza-legado__marca">02 · UNA LECTURA CRÍTICA DEL LEMA</span>
        <h3>¿De qué sombra queremos salir?</h3>
        <div class="plaza-legado__frase" aria-label="De la sombra a la luz">
          <span class="plaza-legado__frase-sombra">DE LA SOMBRA</span>
          ${ico("flecha")}
          <span class="plaza-legado__frase-luz">A LA LUZ</span>
        </div>
        <p><strong>«Ex umbra in solem» significa «De la sombra a la luz».</strong> Para la USM, el conocimiento es la luz que guía el desarrollo de las sociedades.</p>
        <p>Desde una interpretación social actual, la sombra también puede representar la exclusión, la falta de recursos y las barreras que impiden a muchas personas aprender y desarrollar sus capacidades.</p>
        <p class="plaza-legado__reflexion">Avanzar hacia la luz no es solamente adquirir conocimientos: es preguntarnos cómo abrir oportunidades para que más personas puedan hacerlo.</p>
        <a class="plaza-legado__enlace" href="https://usm.cl/universidad/simbolos/" target="_blank" rel="noopener noreferrer">Conocer el significado oficial (USM) ${ico("flecha")}</a>
      </article>

      <article class="plaza-legado__panel" id="plaza-panel-2" role="tabpanel" aria-labelledby="plaza-tab-2" hidden>
        <span class="plaza-legado__marca">03 · NUESTRA RESPONSABILIDAD HOY</span>
        <h3>¿Qué significa hoy democratizar el conocimiento?</h3>
        <p>El legado de Federico Santa María nos deja una pregunta que sigue vigente: ¿cómo construir una educación que no reproduzca las desigualdades de nuestra sociedad?</p>
        <p>Como estudiantes y futuros profesionales, no solo importa cuánto aprendemos. También importa <strong>para quiénes y para qué usamos ese conocimiento</strong>, y cómo contribuimos a abrir oportunidades para otras personas.</p>
        <div class="plaza-legado__pregunta">
          ${ico("users")}
          <div><strong>¿De qué sirve iluminarnos con el conocimiento si dejamos a otros en la sombra?</strong><p>Esta es una pregunta para reflexionar desde el presente, no una cita histórica. Comparte qué significa para ti una comunidad sansana más justa.</p></div>
        </div>
        <a class="plaza-legado__cta" href="#compartir-1">Compartir mi reflexión ${ico("flecha")}</a>
      </article>

      <div class="plaza-legado__controles">
        <button type="button" class="plaza-legado__anterior" data-plaza-anterior disabled>${ico("atras")} Anterior</button>
        <button type="button" class="plaza-legado__siguiente" data-plaza-siguiente>Siguiente capítulo ${ico("flecha")}</button>
      </div>
    </div>
  `;

  const botones = Array.from(seccion.querySelectorAll("[data-plaza-paso]"));
  const paneles = Array.from(seccion.querySelectorAll(".plaza-legado__panel"));
  const anterior = seccion.querySelector("[data-plaza-anterior]");
  const siguiente = seccion.querySelector("[data-plaza-siguiente]");
  let actual = 0;
  function mostrarPaso(n) {
    actual = Math.max(0, Math.min(2, n));
    botones.forEach((b, i) => b.setAttribute("aria-selected", String(i === actual)));
    paneles.forEach((panel, i) => { panel.hidden = i !== actual; });
    seccion.querySelector("#plaza-paso-texto").textContent = `Capítulo ${actual + 1} de 3`;
    seccion.querySelector("#plaza-paso-barra").style.width = `${(actual + 1) / 3 * 100}%`;
    anterior.disabled = actual === 0;
    siguiente.hidden = actual === 2;
  }
  seccion.addEventListener("click", (evento) => {
    const tab = evento.target.closest("[data-plaza-paso]");
    if (tab) mostrarPaso(Number(tab.dataset.plazaPaso));
    if (evento.target.closest("[data-plaza-anterior]")) mostrarPaso(actual - 1);
    if (evento.target.closest("[data-plaza-siguiente]")) mostrarPaso(actual + 1);
  });
  seccion.addEventListener("keydown", (evento) => {
    const tab = evento.target.closest("[data-plaza-paso]");
    if (!tab || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(evento.key)) return;
    evento.preventDefault();
    const nuevo = evento.key === "Home" ? 0 : evento.key === "End" ? 2 :
      evento.key === "ArrowRight" ? (actual + 1) % 3 : (actual + 2) % 3;
    mostrarPaso(nuevo);
    botones[nuevo].focus();
  });
  document.getElementById("ra-botones").insertAdjacentElement("afterend", seccion);
  // El contenido permanece visible incluso si se pierde el seguimiento de cámara.
  seccion.scrollIntoView({ behavior: "smooth", block: "start" });
}

function vistaRA(id) {
  const l = lugar(id);
  if (!l || !l.ra) {
    location.hash = "mapa";
    return;
  }
  app.innerHTML = `
    <section class="pagina ra">
      <a class="volver" href="#lugar-${l.id}">
        ${ico("atras")} Volver al Mapa
      </a>

      <div class="pag-cab">
        <div>
          <span class="etiqueta">
            ${ico("scan")} Experiencia RA
          </span>
          <h1>Reconocimiento de monumentos</h1>
          <p class="lugar-ra">${esc(l.nombre)}</p>
          <p>${l.id === 1 ? "Apunta tu cámara al monumento de la plaza." : "Apunta tu cámara hacia la placa."}</p>
        </div>
      </div>

      <div class="visor guia" id="visor"
           style="position:relative;overflow:hidden">
        ${guiaPlaca()}
        <div class="esquinas">
          <i></i><i></i><i></i><i></i>
        </div>
      </div>

      <p class="aviso" id="ra-aviso">
        Presiona iniciar para activar la cámara.
      </p>

      <div class="ra-botones" id="ra-botones">
        <button class="btn btn-azul" id="ra-iniciar">
          Iniciar experiencia RA
        </button>
        <button class="btn btn-linea" id="ra-sin">
          ${l.id === 1 ? "Explorar sin cámara" : "Ver contenido sin cámara"}
        </button>
      </div>
    </section>
  `;
  const visor = document.getElementById("visor");
  const aviso = document.getElementById("ra-aviso");
  const botones = document.getElementById("ra-botones");
  document.getElementById("ra-sin").onclick = () => {
    if (l.id === 1) mostrarLegadoPlaza(true);
    else mostrarCapa(l, true);
  };
  document.getElementById("ra-iniciar").onclick = () => {
    visor.classList.remove("guia");
    visor.innerHTML = `
      <iframe
        id="ra-frame"
        src="ra.html"
        allow="camera"
        title="Cámara de realidad aumentada"
        style="width:100%;height:100%;
               min-height:350px;border:0;
               display:block">
      </iframe>
    `;
    aviso.textContent =
      "Buscando el monumento de " + l.nombre + "...";
    botones.innerHTML = `
      <button class="btn btn-linea" id="ra-parar">
        Detener cámara
      </button>
    `;
    document.getElementById("ra-parar").onclick = () => {
      apagarCamara();
      vistaRA(id);
    };
  };
  // Evitar registrar varias veces el mismo listener.
  if (window.usmRAListener) {
    window.removeEventListener(
      "message", window.usmRAListener
    );
  }
  window.usmRAListener = (evento) => {
    if (evento.origin !== window.location.origin) return;
    const frame = document.getElementById("ra-frame");
    if (!frame || evento.source !== frame.contentWindow) {
      return;
    }
    
    const lugarReconocido =
      evento.data?.lugar === "plaza" ? lugar(1) :
      evento.data?.lugar === "testamento" ? lugar(2) :
      null;

    // Cada recorrido responde únicamente al monumento seleccionado.
    if (!lugarReconocido || lugarReconocido.id !== l.id) return;

    if (evento.data.tipo === "USM_RA_ENCONTRADA") {
      aviso.textContent =
        "¡Reconocido: " + lugarReconocido.nombre + "!";
      if (l.id === 1) mostrarLegadoPlaza(false);
      else mostrarCapa(lugarReconocido, false);
    }

    if (evento.data.tipo === "USM_RA_PERDIDA") {
      aviso.textContent =
        "Monumento fuera de cámara. Vuelve a enfocarlo.";
      // En la Plaza preservamos los capítulos para que se puedan leer
      // aunque la persona deje de apuntar al monumento.
      if (l.id !== 1) visor.querySelector(".capa-ra")?.remove();
    }
    };
  window.addEventListener(
    "message", window.usmRAListener
  );
}

// ---------- vista: Inicio (página principal) ----------
function vistaInicio() {
  const conRA = lugares.filter((l) => l.ra);
  app.innerHTML = `
    <section class="hero">
      <img class="hero-img" src="img/plaza.jpg" alt="">
      <div class="hero-in">
        <span class="etiqueta">Bienvenida · Comunidad sansana</span>
        <h1>Descubre el Campus San Joaquín</h1>
        <p>Recorre los lugares que cuentan la historia y la identidad de la Universidad Técnica Federico Santa María.</p>
        <div class="hero-botones">
          <a class="btn btn-blanco" href="#mapa">${ico("brujula")} Explorar el mapa</a>
          <a class="btn btn-transp" href="#organizacion">${ico("users")} Conoce Bloque Sansano</a>
        </div>
      </div>
    </section>

    <section class="pagina inicio">
      <div class="seccion-cab">
        <h2>¿Qué puedes hacer?</h2>
      </div>
      <div class="grilla">
        <a class="tarjeta tarjeta-link" href="#mapa">
          <div class="cat"><span class="ico-caja">${ico("pin")}</span><span class="etiqueta">Mapa interactivo</span></div>
          <h3>Recorre el campus</h3>
          <p class="txt">Explora las paradas del recorrido y conoce la historia de cada lugar.</p>
          <span class="lugar-link">Ir al mapa ${ico("flecha")}</span>
        </a>
        <a class="tarjeta tarjeta-link" href="#ra-${conRA[0] ? conRA[0].id : 1}">
          <div class="cat"><span class="ico-caja">${ico("scan")}</span><span class="etiqueta">Realidad aumentada</span></div>
          <h3>Apunta tu cámara</h3>
          <p class="txt">Enfoca ${conRA.map((l) => esc(l.corto)).join(" o el ")} y descubre su contenido.</p>
          <span class="lugar-link">Probar RA ${ico("flecha")}</span>
        </a>
        <a class="tarjeta tarjeta-link" href="#organizacion">
          <div class="cat"><span class="ico-caja">${ico("users")}</span><span class="etiqueta">Conoce Bloque Sansano</span></div>
          <h3>Presentación de la agrupación</h3>
          <p class="txt">Conoce su historia, propósito e iniciativas.</p>
          <span class="lugar-link">Conocer la agrupación ${ico("flecha")}</span>
        </a>
        <a class="tarjeta tarjeta-link" href="#bloque">
          <div class="cat"><span class="ico-caja">${ico("megafono")}</span><span class="etiqueta">Próximas actividades</span></div>
          <h3>Convocatorias</h3>
          <p class="txt">Revisa las próximas convocatorias del campus.</p>
          <span class="lugar-link">Ver convocatorias ${ico("flecha")}</span>
        </a>
        <a class="tarjeta tarjeta-link" href="#comunidad">
          <div class="cat"><span class="ico-caja">${ico("mensaje")}</span><span class="etiqueta">Comunidad</span></div>
          <h3>Comparte</h3>
          <p class="txt">Lee y cuenta experiencias de la vida universitaria en San Joaquín.</p>
          <span class="lugar-link">Ver comunidad ${ico("flecha")}</span>
        </a>
      </div>

      <div class="seccion-cab">
        <h2>Paradas del recorrido</h2>
        <span>${lugares.length} lugares</span>
      </div>
      <div class="paradas">
        ${lugares
          .map(
            (l, i) => `
          <a class="parada" href="#lugar-${l.id}">
            <span class="parada-num">${i + 1}</span>
            <span class="parada-txt">
              <b>${esc(l.nombre)}</b>
              <small>${esc(l.desc)}</small>
            </span>
            <span class="parada-chips">
              <span class="chip">${esc(l.tema)}</span>
              ${l.ra ? `<span class="chip chip-azul">RA</span>` : ""}
            </span>
          </a>`,
          )
          .join("")}
      </div>

      <div class="franja lema">
        <div>
          <h3>«Ex umbra in solem»</h3>
          <p>De la sombra a la luz: el conocimiento como la luz que guía el desarrollo de la sociedad.</p>
        </div>
        <a class="btn btn-azul" href="#mapa">Comenzar recorrido ${ico("flecha")}</a>
      </div>

      <footer class="pie-pag"><span>Campus San Joaquín · USM</span><a class="link-rep" href="admin.html">${ico("users")} ¿Eres representante? Ingresa aquí</a></footer>
    </section>`;
}

// ---------- navegación ----------
let vistaActual = "";

function render() {
  const h = decodeURIComponent(location.hash.slice(1)) || "inicio";
  const [nom, param] = [h.split("-")[0], h.split("-").slice(1).join("-")];
  apagarCamara();

  const tab =
    {
      inicio: "inicio",
      mapa: "mapa",
      lugar: "mapa",
      ra: "mapa",
      bloque: "bloque",
      organizacion: "bloque",
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
  if (nom == "inicio") vistaInicio();
  else if (nom == "bloque") vistaBloque(param);
  else if (nom == "organizacion") vistaOrganizacion();
  else if (nom == "comunidad") vistaComunidad(param);
  else if (nom == "publicar") location.href = "admin.html";
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