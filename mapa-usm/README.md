# Campus San Joaquín · Mapa interactivo USM

App web del proyecto de aprendizaje-servicio (Grupo 20): mapa del campus con fichas de lugares, Bloque Sansano (convocatorias), Comunidad (experiencias) y realidad aumentada.

Hecha con HTML, CSS y JavaScript sin librerías. No necesita instalar nada.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `index.html` | Estructura base: cabecera y pestañas |
| `estilos.css` | Todos los estilos (modo claro y oscuro, móvil y escritorio) |
| `datos.js` | Lugares, convocatorias y experiencias de ejemplo. **Aquí se edita el contenido** |
| `app.js` | Lógica: dibujo del mapa, zoom, fichas, formularios y RA |

## Probarla en el computador

Abrir `index.html` en el navegador. Para probar la cámara (RA) hay que servirla por `https` o `localhost`, por ejemplo:

```
python -m http.server 8000
```

y entrar a `http://localhost:8000`.

## Publicar en GitHub Pages

1. Subir estos archivos a la raíz del repositorio.
2. En el repo: **Settings → Pages → Branch: main / (root) → Save**.
3. Queda en `https://<usuario>.github.io/<repo>/`.

## Cosas para completar

- **Fotos reales:** crear una carpeta `img/`, subir las fotos y poner la ruta en el campo `foto` de cada lugar en `datos.js` (ej: `foto: "img/plaza.jpg"`). Mientras esté vacío se muestra una ilustración.
- **Fichas históricas:** reemplazar los textos `mas` de cada lugar en `datos.js`.
- **Realidad aumentada:** hoy la cámara se abre y se usa un botón "Ya encuadré la placa". Para detección real (por ejemplo con MindAR), llamar a `mostrarCapa(l)` en `app.js` cuando la librería reconozca la placa.
- **Datos:** las convocatorias y experiencias que se publican se guardan solo en el navegador de cada persona (`localStorage`). Es una demo.

## Secciones (rutas)

`#mapa` · `#lugar-1` a `#lugar-5` · `#bloque` · `#publicar` · `#comunidad` · `#compartir` · `#ra-1` · `#ra-2`
