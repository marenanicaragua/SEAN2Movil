export const questions = [
  // ==================== FASE 1: INSTALACIONES ====================
  {
    id: "fase1_titulo",
    label: "1. INSTALACIONES",
    type: "title",
  },
  {
    id: "posee_recintos",
    label: "¿Posee recintos?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
  },
  {
    id: "cantidad_recintos",
    label: "Cantidad de Recintos",
    type: "dropdown",
    options: ["Mala", "Adecuada", "Buena", "Excelente"],
    required: true,
  },
  {
    id: "calidad_infraestructura",
    label: "Calidad de la Infraestructura",
    type: "dropdown",
    options: ["Mala", "Buena", "Excelente"],
    required: true,
  },
  {
    id: "tipo_material",
    label: "Tipo de material de la infraestructura",
    type: "dropdown",
    options: ["Madera", "Concreto", "Metal", "Mixto", "Otros"],
    required: true,
  },
  {
    id: "material_otro_cual",
    label: "Si seleccionó 'Otros', especifique",
    type: "text",
    placeholder: "Ej: Bambú, Adobe, etc.",
    dependsOn: { field: "tipo_material", value: "Otros" },
  },
  {
    id: "caracterizacion_nota",
    label:
      "Caracterización del zoocriadero (no es necesario acabar la inspección)",
    type: "textarea",
    placeholder: "Observaciones sobre la caracterización...",
  },

  // ==================== FASE 2: DESCRIPCIÓN BIOFÍSICA ====================
  {
    id: "fase2_titulo",
    label: "2. DESCRIPCIÓN BIOFÍSICA",
    type: "title",
  },
  {
    id: "poblacion_menos_350m",
    label: "¿Existe población a menos de 350 m?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
    critical: true, // peso alto - si es No, inspección no procede
  },
  {
    id: "medidas_seguridad_especies",
    label: "¿Toma las medidas de seguridad para las especies que maneja?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
    critical: true,
  },
  {
    id: "propenso_inundacion",
    label: "¿Propenso a inundación?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
    critical: true,
  },
  {
    id: "existe_vegetacion_cerca",
    label: "¿Existe vegetación, bosques o arbustos cerca?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
  },
  {
    id: "vegetacion_existente",
    label: "Ingrese tipo de vegetación o árboles que existen",
    type: "textarea",
    placeholder: "Ej: Bosque seco tropical, manglar, árboles frutales...",
    dependsOn: { field: "existe_vegetacion_cerca", value: "Sí" },
  },

  // ==================== FASE 3: MANEJO ====================
  {
    id: "fase3_titulo",
    label: "3. MANEJO",
    type: "title",
  },
  {
    id: "tabla_especies",
    label: "Especies y cantidades de individuos",
    type: "table",
    columns: [
      { key: "especie", label: "Especie", type: "text" },
      { key: "cantidad", label: "Cantidad de individuos", type: "number" },
    ],
    required: true,
  },
  {
    id: "calidad_alimentacion",
    label: "Calidad de la alimentación",
    type: "dropdown",
    options: ["Mala", "Adecuada", "Excelente"],
    required: true,
  },
  {
    id: "calidad_hidratacion",
    label: "Calidad de Hidratación",
    type: "dropdown",
    options: ["Mala", "Adecuada", "Excelente"],
    required: true,
  },
  {
    id: "vitalidad_fauna",
    label: "Vitalidad visual de los individuos de fauna",
    type: "dropdown",
    options: ["Mala", "Adecuada", "Excelente"],
    required: true,
  },
  {
    id: "capacidad_manejo_personal",
    label: "Capacidad de manejo técnico del personal a cargo",
    type: "dropdown",
    options: ["Mala", "Adecuada", "Buena", "Excelente"],
    required: true,
  },

  // ==================== FASE 4: OTROS (VISITANTES Y ACTIVIDADES) ====================
  {
    id: "fase4_titulo",
    label: "4. OTROS",
    type: "title",
  },
  {
    id: "recibe_visitantes",
    label: "¿Recibe visitantes?",
    type: "radio",
    options: ["Sí", "No"],
    required: true,
  },
  {
    id: "detalle_visitantes",
    label:
      "Cantidad y procedencia de visitantes (universidad, colegios, turísticos) y objetivo",
    type: "textarea",
    placeholder:
      "Ej: 50 visitantes/mes, principalmente colegios, con fines educativos",
    dependsOn: { field: "recibe_visitantes", value: "Sí" },
  },
  {
    id: "actividades_extramanejo",
    label:
      "¿Realiza actividades extramanejo? (charlas ambientales, educación ambiental en colegio, ferias, universidades, otros)",
    type: "radio",
    options: ["Sí", "No"],
  },
  {
    id: "detalle_actividades",
    label: "Detalle las actividades extramanejo",
    type: "textarea",
    placeholder:
      "Ej: Charlas en 5 colegios al año, participación en ferias ambientales...",
    dependsOn: { field: "actividades_extramanejo", value: "Sí" },
  },
  {
    id: "venta_local",
    label: "¿Posee venta local de individuos o subproductos?",
    type: "radio",
    options: ["Sí", "No"],
  },
  {
    id: "detalle_venta",
    label: "Detalle qué vende y a quién",
    type: "textarea",
    placeholder:
      "Ej: Venta de crías a otros criaderos, subproductos como huevos...",
    dependsOn: { field: "venta_local", value: "Sí" },
  },

  // ==================== TIPO DE LICENCIA / TRÁMITE ====================
  {
    id: "tipo_licencia",
    label: "Tipo de licencia o permiso solicitado",
    type: "checkbox",
    options: [
      "Licencia para establecimiento de zoocriaderos comunitarios, comercio nacional",
      "Licencia para establecimiento de Zoocriadero con fines de investigación, bancos de genes, colecciones científicas, vivarios y repoblamiento",
      "Cierre de Zoocriadero",
      "Permiso para el Comercio Internacional de Especies Forestales (CITES) Nuevo",
      "Permiso para el Comercio Internacional de Especies de Flora menor (CITES) Nuevo",
      "Permiso para el Comercio Internacional de Especies Marina (CITES) Nuevo",
    ],
  },

  // ==================== TABLA MADERA (si aplica CITES Forestal) ====================
  {
    id: "tabla_madera",
    label: "Detalle de madera (para CITES Forestal)",
    type: "table",
    columns: [
      { key: "especie", label: "Especie", type: "text" },
      { key: "cantidad_piezas", label: "Cantidad de piezas", type: "number" },
      { key: "metros_cubicos", label: "Metros cúbicos", type: "number" },
      {
        key: "estado",
        label: "Estado de la madera",
        type: "dropdown",
        options: ["Verde", "Seco", "Tratado"],
      },
    ],
    dependsOn: {
      field: "tipo_licencia",
      value:
        "Permiso para el Comercio Internacional de Especies Forestales (CITES) Nuevo",
    },
  },

  // ==================== TABLA MARINA (si aplica CITES Marina) ====================
  {
    id: "tabla_marina",
    label: "Detalle de especies marinas (para CITES Marina)",
    type: "table",
    columns: [
      { key: "especie", label: "Especie", type: "text" },
      { key: "codigo", label: "Código", type: "text" },
      { key: "corte", label: "Corte", type: "text" },
      {
        key: "cantidad",
        label: "Cantidad",
        type: "text",
        placeholder: "Ej: 50 lb, 20 kg",
      },
      {
        key: "calidad",
        label: "Calidad del producto",
        type: "dropdown",
        options: ["Mala calidad", "Óptimas condiciones"],
      },
    ],
    dependsOn: {
      field: "tipo_licencia",
      value:
        "Permiso para el Comercio Internacional de Especies Marina (CITES) Nuevo",
    },
  },

  // ==================== UBICACIÓN GEOGRÁFICA ====================
  {
    id: "ubicacion_geografica",
    label: "Ubicación Geográfica del Sitio",
    type: "map",
    required: true,
  },
  // ==================== OBSERVACIONES Y CIERRE ====================
  {
    id: "observaciones",
    label: "Observaciones generales",
    type: "textarea",
    placeholder: "Ingrese cualquier observación adicional...",
  },
  {
    id: "manifesto_proponente",
    label: "El Proponente Manifestó...",
    type: "textarea",
    placeholder: "Registrar manifestaciones del proponente...",
  },
  {
    id: "ver_delegacion",
    label: "Ver a la delegación",
    type: "text",
    placeholder: "Nombre de quien verifica",
  },
];
