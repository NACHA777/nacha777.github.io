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
    izq: true,
    foto: "",
    desc: "Una parada para acercarse al legado de Federico Santa María.",
    identidad:
      "Propone una mirada al sentido de nuestra comunidad y a la memoria que acompaña la identidad sansana.",
    mas: [
      "Federico Santa María Carrera redactó su testamento en París en 1920. En él dejó establecido que la institución debía dar oportunidades a jóvenes con talento, sin importar su condición económica.",
      "Su legado no fue solo económico: propuso una educación basada en el mérito, el esfuerzo y la excelencia, principios que hoy forman parte del llamado «Espíritu Sansano».",
    ],
    dato: {
      titulo: "Símbolos de la universidad",
      texto:
        "El escudo, diseñado a fines de 1920, une las armas de las familias Santa María y Carrera. La bandera, definida en 1931, toma de él sus franjas roja, amarilla y azul.",
    },
    ra: true,
    placa: "la placa del Testamento de Federico Santa María",
  },
  {
    id: 3,
    nombre: "Cerrito",
    corto: "Cerrito",
    tema: "Pausa",
    x: 870,
    y: 712,
    foto: "",
    desc: "Un rincón verde para hacer una pausa durante el recorrido.",
    identidad:
      "Invita a habitar el campus más allá del aula y a construir vínculos cotidianos con la comunidad sansana.",
    mas: [
      "El Cerrito es uno de los principales espacios de encuentro y recreación del campus. Los estudiantes lo usan para almorzar, descansar y compartir.",
      "También recibe actividades organizadas por los centros de estudiantes, como fondas, tocatas y ferias. Más que un punto histórico, es un lugar donde la identidad sansana se construye hoy, en la convivencia diaria.",
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
    foto: "",
    desc: "Un espacio para imaginar encuentros, ideas y experiencias compartidas.",
    identidad:
      "Nos recuerda el valor de reunirnos y de participar en la vida cultural y universitaria sansana.",
    mas: [
      "El Aula Magna es uno de los principales espacios de encuentro académico, cultural e institucional del Campus San Joaquín.",
      "Aquí se realizan charlas, ceremonias y eventos culturales que acompañan a los estudiantes en distintas etapas de su vida universitaria. Muestra que la experiencia sansana va más allá de la sala de clases.",
    ],
    ra: false,
  },
];

// fecha en formato año-mes-día, hora en 24 h
const convocatoriasEjemplo = [
  {
    id: "c1",
    titulo: "Encuentro sansano",
    fecha: "2026-10-20",
    hora: "13:00",
    lugar: 1,
    desc: "Una pausa para conocer estudiantes y compartir la vida del campus.",
  },
  {
    id: "c2",
    titulo: "Conversaciones en el Cerrito",
    fecha: "2026-10-22",
    hora: "12:30",
    lugar: 3,
    desc: "Comparte ideas y experiencias sobre la vida universitaria al aire libre.",
  },
  {
    id: "c3",
    titulo: "Encuentro de cultura universitaria",
    fecha: "2026-10-23",
    hora: "18:00",
    lugar: 4,
    desc: "Un encuentro para compartir propuestas culturales de la comunidad sansana.",
  },
];

// icono: users, coffee o music
const experienciasEjemplo = [
  {
    id: "e1",
    cat: "Encuentro",
    icono: "users",
    titulo: "Un punto para encontrarnos",
    texto:
      "La plaza invita a conversar entre clases y conocer a otros estudiantes. Un encuentro breve puede hacer más cercana la vida en el campus.",
    lugar: 1,
  },
  {
    id: "e2",
    cat: "Pausa",
    icono: "coffee",
    titulo: "Una pausa al aire libre",
    texto:
      "Detenerse en el Cerrito permite despejarse y compartir un momento tranquilo. También es un buen espacio para conversar sobre el día universitario.",
    lugar: 3,
  },
  {
    id: "e3",
    cat: "Cultura universitaria",
    icono: "music",
    titulo: "La cultura también nos reúne",
    texto:
      "El Aula Magna inspira encuentros en torno a la cultura. Compartir propuestas y opiniones ayuda a imaginar una vida universitaria más participativa.",
    lugar: 4,
  },
];
