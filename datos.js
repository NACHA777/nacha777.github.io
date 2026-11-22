// Datos de la app. Para cambiar textos, lugares o fechas basta con editar este archivo.
// Los textos "mas" y "dato" vienen de la Investigación Histórica del grupo.

// x, y = posición del punto, en coordenadas del plano oficial (ver svgMapa en app.js)
// izq = true pone el nombre a la izquierda del punto (para que no choque con otros)
// foto = ruta a una imagen real (ej: "img/plaza.jpg"). Si queda vacía se usa una ilustración.
// mas = párrafos de "Conocer más"; dato = recuadro destacado (opcional)
// ra = true si el lugar tiene experiencia de realidad aumentada
const lugares = [
  {
    id: 1,
    nombre: "Plaza Federico Santa María",
    corto: "Plaza F. Santa María",
    tema: "Encuentro",
    x: 112,
    y: 868,
    foto: "img/plaza.jpg",
    galeria:[
      "img/plaza-2.jpeg",
      "img/plaza-3.jpeg",
    ],
    desc: "Un lugar para detenerse, encontrarse y recorrer el campus.",
    identidad:
      "Invita a compartir la vida universitaria y a reconocer el nombre que nos reúne como comunidad sansana.",
    mas: [
      "La plaza es un espacio de encuentro creado para fortalecer la identidad sansana y mantener presente el legado de Federico Santa María.",
      "Aquí están su busto y una frase de su testamento, dos elementos que conectan la historia de la universidad con la comunidad que hoy estudia en San Joaquín.",
    ],
    dato: {
      titulo: "Lema de la USM",
      texto:
        "«Ex umbra in solem»: de la sombra a la luz. Resume el ideal de Federico Santa María: el conocimiento como la luz que guía el desarrollo de la sociedad.",
    },
    ra: true,
    placa:
      "el busto de Federico Santa María o la placa con la frase de su testamento",
  },
  {
    id: 2,
    nombre: "Testamento de Federico Santa María",
    corto: "Testamento",
    tema: "Memoria",
    x: 690,
    y: 812,
    foto: "img/testamento-1.jpeg",
    galeria:[
      "img/testamento-2.jpeg"
    ],
    desc: "Una parada para acercarse al legado de Federico Santa María.",
    identidad:
      "Propone una mirada al sentido de nuestra comunidad y a la memoria que acompaña la identidad sansana.",
    mas: [
      "Federico Santa María Carrera redactó su testamento en París en 1920. En él propuso destinar recursos a la formación de jóvenes de escasos recursos que demostraran aptitudes y dedicación.",
      "Su legado impulsó una visión de educación técnica y científica ligada al mérito, el esfuerzo y una preocupación por ampliar las oportunidades de formación.",
    ],
    dato: {
      titulo: "Símbolos de la universidad",
      texto:
        "El escudo, diseñado a fines de 1920, une las armas de las familias Santa María y Carrera. La bandera, definida en 1931, toma de él sus franjas roja, amarilla y azul.",
    },
    ra: false, // El Testamento ahora es una experiencia de lectura interactiva, sin cámara.
    placa: "la placa del Testamento de Federico Santa María",
  },
  {
    id: 3,
    nombre: "Cerrito",
    corto: "Cerrito",
    tema: "Pausa",
    x: 870,
    y: 712,
    foto: "img/cerrito-campus-san-joaquin.jpg",
    fuenteFoto: "Oxifer · vista general del Campus San Joaquín",
    fuenteFotoUrl: "https://oxifer.cl/campus-san-joaquin-federico-santa-maria-santiago/",
    desc: "Un rincón verde para hacer una pausa durante el recorrido.",
    identidad:
      "Invita a habitar el campus más allá del aula y a construir vínculos cotidianos con la comunidad sansana.",
    mas: [
      "El Cerrito es un lugar de encuentro y recreación dentro del campus, donde la comunidad estudiantil puede descansar, compartir y participar en actividades.",
      "Es un espacio donde la identidad sansana se construye a través de la convivencia cotidiana.",
    ],
    ra: false,
  },
  {
    id: 4,
    nombre: "Aula Magna",
    corto: "Aula Magna",
    tema: "Comunidad",
    x: 645,
    y: 730,
    izq: true,
    foto: "img/aula-magna.jpg",
    fuenteFoto: "Extensión USM",
    fuenteFotoUrl: "https://extension.usm.cl/wp-content/uploads/2022/07/AULA-MAGNA-SAN-JOAQUIN-19JPG.jpg",
    desc: "Un espacio de encuentro académico, cultural e institucional.",
    identidad:
      "Nos recuerda el valor de reunirnos y de participar en la vida cultural y universitaria sansana.",
    mas: [
      "El Aula Magna es uno de los principales espacios de encuentro académico, cultural e institucional del Campus San Joaquín.",
      "Aquí se realizan ceremonias, charlas y actividades que enriquecen la experiencia universitaria y fortalecen los vínculos entre estudiantes y comunidad.",
    ],
    ra: false,
  },
];

// Las convocatorias y experiencias reales vienen de Supabase (ver comunidad-supabase.js).
// Estas listas quedan vacías: si se agregan elementos aquí, aparecerán junto a los reales.
// fecha en formato año-mes-día, hora en 24 h
const convocatoriasEjemplo = [];
// icono: users, coffee o music
const experienciasEjemplo = [];
