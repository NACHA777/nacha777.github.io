
const USM_COMUNIDAD = {
  async consultar(tabla) {
    const url =
      `${SUPABASE_URL}/rest/v1/${tabla}` +
      `?select=*&estado=eq.aprobada` +
      `&order=creado_en.desc&limit=100`;
    const respuesta = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY
      }
    });
    if (!respuesta.ok) {
      throw new Error(await respuesta.text());
    }
    return respuesta.json();
  },
  async enviar(tabla, datos) {
    if (!["convocatorias", "experiencias"].includes(tabla)) {
      throw new Error("Tabla no permitida");
    }
    const respuesta = await fetch(
      `${SUPABASE_URL}/rest/v1/${tabla}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          ...datos,
          estado: "aprobada"
        })
      }
    );
    if (!respuesta.ok) {
      throw new Error(await respuesta.text());
    }
    return true;
  },
  async cargar() {
    try {
      const [convs, exps] = await Promise.all([
        this.consultar("convocatorias"),
        this.consultar("experiencias")
      ]);
      misConvs = convs.map(f => ({
        id: f.id,
        titulo: f.titulo,
        desc: f.descripcion,
        fecha: f.fecha,
        hora: f.hora,
        lugar: f.lugar_id,
        propia: false
      }));
      misExps = exps.map(f => ({
        id: f.id,
        titulo: f.titulo,
        texto: f.texto,
        cat: f.categoria,
        lugar: f.lugar_id,
        propia: false
      }));
      console.log(
        `Comunidad: ${misConvs.length} convocatorias, ` +
        `${misExps.length} experiencias`
      );
      if (typeof render === "function") {
        render();
      }
    } catch (error) {
      console.error("Error cargando comunidad:", error);
    }
  }
};
window.addEventListener("DOMContentLoaded", () => {
  USM_COMUNIDAD.cargar();
});
