
 // Conexión pública del Mapa Interactivo USM con Supabase
 // Nunca colocar claves secretas en este archivo
const SUPABASE_URL = "https://oaedaycrypryegtepkam.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_publishable_f_c7Wku5RwqSqJIIphiQRg_CgwiwP0_";
async function cargarLugaresRemotos() {
  try {
    if (
      SUPABASE_URL.includes("PEGA_AQUI") ||
      SUPABASE_ANON_KEY.includes("PEGA_AQUI")
    ) {
      console.warn(
        "Supabase no configurado; se mantienen los datos locales."
      );
      return;
    }
    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/lugares?select=id,datos&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY
        }
      }
    );
    if (!respuesta.ok) {
      throw new Error(
        `Supabase HTTP ${respuesta.status}: ${await respuesta.text()}`
      );
    }
    const filas = await respuesta.json();
    if (!Array.isArray(filas) || filas.length === 0) {
      throw new Error("La tabla lugares está vacía");
    }
    const nuevos = filas.map(f => ({
      ...f.datos,
      id: f.id
    }));
    lugares.splice(0, lugares.length, ...nuevos);
    console.info(
      `Supabase: ${lugares.length} lugares cargados`
    );
    if (typeof render === "function") {
      if (typeof vistaActual !== "undefined") {
        vistaActual = "";
      }
      render();
    }
  } catch (error) {
    console.error(
      "No se pudieron cargar los lugares; se usan datos locales:",
      error
    );
  }
}
window.addEventListener(
  "DOMContentLoaded",
  cargarLugaresRemotos
);
