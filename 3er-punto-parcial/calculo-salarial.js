/**
 * Calculadora de salario para docentes universitarios según Decreto 1279 de 2002
 */

// Valor del punto salarial (Artículo 58)
const VALOR_PUNTO = 20895;

/**
 * Calcula el salario de un docente universitario según el Decreto 1279 de 2002
 * @param {Object} docente - Datos del docente
 * @returns {Object} - Resultado del cálculo
 */
function calcularSalarioDocente(docente) {
  // Validar que el docente esté en el ámbito de aplicación
  if (!esDocenteAplicable(docente)) {
    return {
      error: "El docente no está en el ámbito de aplicación del Decreto 1279 de 2002"
    };
  }

  // Calcular puntos por cada factor
  const puntosTitulos = calcularPuntosTitulos(docente.titulos);
  const puntosCategoria = calcularPuntosCategoria(docente.categoria);
  const puntosExperiencia = calcularPuntosExperiencia(docente.experiencia, docente.categoria);
  const puntosProductividad = calcularPuntosProductividad(docente.productividad, docente.categoria);
  const puntosDireccion = calcularPuntosDireccion(docente.cargosDirectivos);
  const puntosDesempeño = calcularPuntosDesempeño(docente.desempeño, docente.categoria);
  
  // Sumar todos los puntos
  const totalPuntos = puntosTitulos + puntosCategoria + puntosExperiencia + 
                      puntosProductividad + puntosDireccion + puntosDesempeño;
  
  // Calcular salario base
  const salarioBase = totalPuntos * VALOR_PUNTO;
  
  // Calcular bonificaciones (no constitutivas de salario)
  const bonificaciones = calcularBonificaciones(docente);
  
  return {
    puntosTitulos,
    puntosCategoria,
    puntosExperiencia,
    puntosProductividad,
    puntosDireccion,
    puntosDesempeño,
    totalPuntos,
    salarioBase,
    bonificaciones,
    salarioTotal: salarioBase + bonificaciones
  };
}

/**
 * Verifica si el docente está en el ámbito de aplicación del decreto
 */
function esDocenteAplicable(docente) {
  return docente.vinculacion === 'concurso' || 
         docente.reingreso || 
         docente.regimen === 'decreto1444' || 
         docente.acogidoDecreto1279;
}

/**s
 * Calcula puntos por títulos universitarios (Artículo 7)
 */
function calcularPuntosTitulos(titulos) {
  if (!titulos || titulos.length === 0) return 0;
  
  let puntos = 0;
  let puntosPregrado = 0;
  let puntosPosgrado = 0;
  
  // Puntos por pregrado
  const pregrado = titulos.find(t => t.nivel === 'pregrado');
  if (pregrado) {
    puntosPregrado = pregrado.area === 'medicina' || pregrado.area === 'composicion_musical' ? 183 : 178;
  }
  
  // Puntos por posgrados
  const posgrados = titulos.filter(t => t.nivel !== 'pregrado');
  
  // Verificar si tiene doctorado sin maestría
  const doctoradoSinMaestria = posgrados.some(p => p.nivel === 'doctorado') && 
                              !posgrados.some(p => p.nivel === 'maestria');
  
  for (const posgrado of posgrados) {
    let puntosTitulo = 0;
    
    if (posgrado.nivel === 'especializacion') {
      // Especialización: 20 puntos (1-2 años) + 10 por año adicional, máximo 30
      puntosTitulo = Math.min(20 + (posgrado.duracionAnios > 2 ? (posgrado.duracionAnios - 2) * 10 : 0), 30);
    } 
    else if (posgrado.nivel === 'especializacion_clinica' && 
            (pregrado?.area === 'medicina' || pregrado?.area === 'odontologia')) {
      // Especializaciones clínicas en medicina y odontología: 15 puntos por año, máximo 75
      puntosTitulo = Math.min(posgrado.duracionAnios * 15, 75);
    }
    else if (posgrado.nivel === 'maestria') {
      // Maestría: 40 puntos
      puntosTitulo = 40;
    }
    else if (posgrado.nivel === 'doctorado') {
      // Doctorado: 80 puntos (o 120 si no tiene maestría)
      puntosTitulo = doctoradoSinMaestria ? 120 : 80;
    }
    
    puntosPosgrado += puntosTitulo;
  }
  
  // Verificar si tiene dos maestrías (máximo 20 puntos adicionales, tope 60)
  const maestrias = posgrados.filter(p => p.nivel === 'maestria');
  if (maestrias.length >= 2) {
    puntosPosgrado = Math.min(puntosPosgrado + 20, 60);
  }
  
  // Verificar si tiene dos doctorados
  const doctorados = posgrados.filter(p => p.nivel === 'doctorado');
  if (doctorados.length >= 2) {
    if (doctoradoSinMaestria) {
      puntosPosgrado = Math.min(puntosPosgrado + 20, 140);
    } else {
      puntosPosgrado = Math.min(puntosPosgrado + 20, 120);
    }
  }
  
  // Tope máximo por posgrados: 140 puntos
  puntosPosgrado = Math.min(puntosPosgrado, 140);
  
  puntos = puntosPregrado + puntosPosgrado;
  return puntos;
}

/**
 * Calcula puntos por categoría en el escalafón (Artículo 8)
 */
function calcularPuntosCategoria(categoria) {
  switch (categoria) {
    case 'instructor_auxiliar':
      return 37;
    case 'instructor_asociado': // Solo para Universidad Nacional
      return 44;
    case 'asistente':
      return 58;
    case 'asociado':
      return 74;
    case 'titular':
      return 96;
    default:
      return 0;
  }
}

/**
 * Calcula puntos por experiencia calificada (Artículo 9)
 */
function calcularPuntosExperiencia(experiencia, categoria) {
  if (!experiencia) return 0;
  
  let puntos = 0;
  
  // Puntos por años de experiencia
  if (experiencia.aniosInvestigacion) {
    puntos += experiencia.aniosInvestigacion * 6;
  }
  
  if (experiencia.aniosDocencia) {
    puntos += experiencia.aniosDocencia * 4;
  }
  
  if (experiencia.aniosDireccion) {
    puntos += experiencia.aniosDireccion * 4;
  }
  
  if (experiencia.aniosProfesional) {
    puntos += experiencia.aniosProfesional * 3;
  }
  
  // Aplicar topes según categoría
  const topes = {
    'instructor_auxiliar': 20,
    'instructor_asociado': 20,
    'asistente': 45,
    'asociado': 90,
    'titular': 120
  };
  
  return Math.min(puntos, topes[categoria] || 0);
}

/**
 * Calcula puntos por productividad académica (Artículo 10)
 */
function calcularPuntosProductividad(productividad, categoria) {
  if (!productividad) return 0;
  
  let puntos = 0;
  
  // Artículos en revistas
  if (productividad.articulos) {
    for (const articulo of productividad.articulos) {
      let puntosArticulo = 0;
      
      // Según tipo de revista
      if (articulo.tipoRevista === 'A1') {
        puntosArticulo = 15;
      } else if (articulo.tipoRevista === 'A2') {
        puntosArticulo = 12;
      } else if (articulo.tipoRevista === 'B') {
        puntosArticulo = 8;
      } else if (articulo.tipoRevista === 'C') {
        puntosArticulo = 3;
      }
      
      // Ajuste por tipo de artículo
      if (articulo.tipoArticulo === 'comunicacion_corta') {
        puntosArticulo *= 0.6;
      } else if (['reporte_caso', 'revision_tema', 'carta_editor', 'editorial'].includes(articulo.tipoArticulo)) {
        puntosArticulo *= 0.3;
      }
      
      // Ajuste por número de autores
      if (articulo.numeroAutores > 5) {
        puntosArticulo = puntosArticulo / (articulo.numeroAutores / 2);
      } else if (articulo.numeroAutores > 3) {
        puntosArticulo = puntosArticulo / 2;
      }
      
      puntos += puntosArticulo;
    }
  }
  
  // Libros
  if (productividad.libros) {
    for (const libro of productividad.libros) {
      let puntosLibro = 0;
      
      if (libro.tipo === 'investigacion') {
        puntosLibro = 20;
      } else if (libro.tipo === 'texto') {
        puntosLibro = 15;
      } else if (libro.tipo === 'ensayo') {
        puntosLibro = 15;
      }
      
      // Ajuste por número de autores
      if (libro.numeroAutores > 5) {
        puntosLibro = puntosLibro / (libro.numeroAutores / 2);
      } else if (libro.numeroAutores > 3) {
        puntosLibro = puntosLibro / 2;
      }
      
      puntos += puntosLibro;
    }
  }
  
  // Patentes
  if (productividad.patentes) {
    puntos += productividad.patentes.length * 25;
  }
  
  // Obras artísticas
  if (productividad.obrasArtisticas) {
    for (const obra of productividad.obrasArtisticas) {
      let puntosObra = 0;
      
      if (obra.tipo === 'creacion_original') {
        puntosObra = obra.impacto === 'internacional' ? 20 : 14;
      } else if (obra.tipo === 'creacion_complementaria') {
        puntosObra = obra.impacto === 'internacional' ? 12 : 8;
      } else if (obra.tipo === 'interpretacion') {
        puntosObra = obra.impacto === 'internacional' ? 14 : 8;
      }
      
      // Ajuste por número de autores
      if (obra.numeroAutores > 5) {
        puntosObra = puntosObra / (obra.numeroAutores / 2);
      } else if (obra.numeroAutores > 3) {
        puntosObra = puntosObra / 2;
      }
      
      puntos += puntosObra;
    }
  }
  
  // Producción técnica
  if (productividad.produccionTecnica) {
    for (const produccion of productividad.produccionTecnica) {
      if (produccion.tipo === 'innovacion') {
        puntos += 15;
      } else if (produccion.tipo === 'adaptacion') {
        puntos += 8;
      }
    }
  }
  
  // Software
  if (productividad.software) {
    puntos += productividad.software.length * 15;
  }
  
  // Aplicar topes según categoría
  const topes = {
    'instructor_auxiliar': 80,
    'instructor_asociado': 110,
    'asistente': 160,
    'asociado': 320,
    'titular': 540
  };
  
  return Math.min(puntos, topes[categoria] || 0);
}

/**
 * Calcula puntos por dirección académico-administrativa (Artículo 17)
 */
function calcularPuntosDireccion(cargosDirectivos) {
  if (!cargosDirectivos || cargosDirectivos.length === 0) return 0;
  
  let puntos = 0;
  
  for (const cargo of cargosDirectivos) {
    let puntosCargo = 0;
    
    if (cargo.tipo === 'rector') {
      puntosCargo = 11;
    } else if (['vicerrector', 'secretario_general', 'director_administrativo'].includes(cargo.tipo)) {
      puntosCargo = 9;
    } else if (['decano', 'director_division', 'jefe_oficina', 'director_investigacion', 
                'director_extension', 'director_programa'].includes(cargo.tipo)) {
      puntosCargo = 6;
    } else if (['vicedecano', 'director_administrativo_sede'].includes(cargo.tipo)) {
      puntosCargo = 4;
    } else if (['director_departamento', 'director_escuela', 'director_instituto', 
                'director_centro'].includes(cargo.tipo)) {
      puntosCargo = 2;
    }
    
    // Multiplicar por años de servicio en el cargo
    puntosCargo *= cargo.anios || 1;
    
    puntos += puntosCargo;
  }
  
  return puntos;
}

/**
 * Calcula puntos por desempeño destacado en docencia y extensión (Artículo 18)
 */
function calcularPuntosDesempeño(desempeño, categoria) {
  if (!desempeño) return 0;
  
  let puntos = 0;
  
  // Puntos por desempeño destacado
  if (desempeño.destacado) {
    if (categoria === 'titular') {
      puntos += 5;
    } else if (categoria === 'asociado') {
      puntos += 4;
    } else if (categoria === 'asistente') {
      puntos += 3;
    } else if (['instructor_auxiliar', 'instructor_asociado'].includes(categoria)) {
      puntos += 2;
    }
  }
  
  // Puntos por experiencia calificada (2 puntos anuales)
  if (desempeño.aniosExperiencia) {
    puntos += desempeño.aniosExperiencia * 2;
  }
  
  return puntos;
}

/**
 * Calcula bonificaciones no constitutivas de salario (Artículos 19-21)
 */
function calcularBonificaciones(docente) {
  if (!docente.bonificaciones) return 0;
  
  let totalBonificaciones = 0;
  
  // Ponencias
  if (docente.bonificaciones.ponencias) {
    for (const ponencia of docente.bonificaciones.ponencias) {
      if (ponencia.ambito === 'internacional') {
        totalBonificaciones += 84 * VALOR_PUNTO;
      } else if (ponencia.ambito === 'nacional') {
        totalBonificaciones += 48 * VALOR_PUNTO;
      } else if (ponencia.ambito === 'regional') {
        totalBonificaciones += 24 * VALOR_PUNTO;
      }
    }
  }
  
  // Publicaciones impresas universitarias
  if (docente.bonificaciones.publicacionesImpresas) {
    totalBonificaciones += docente.bonificaciones.publicacionesImpresas.length * 60 * VALOR_PUNTO;
  }
  
  // Estudios postdoctorales
  if (docente.bonificaciones.estudiosPostdoctorales) {
    totalBonificaciones += docente.bonificaciones.estudiosPostdoctorales.length * 120 * VALOR_PUNTO;
  }
  
  // Dirección de tesis
  if (docente.bonificaciones.direccionTesis) {
    for (const tesis of docente.bonificaciones.direccionTesis) {
      if (tesis.nivel === 'maestria') {
        totalBonificaciones += 36 * VALOR_PUNTO;
      } else if (tesis.nivel === 'doctorado') {
        totalBonificaciones += 72 * VALOR_PUNTO;
      }
    }
  }
  
  return totalBonificaciones;
}

// Ejemplo de uso
const docente = {
  vinculacion: 'concurso',
  titulos: [
    { nivel: 'pregrado', area: 'ingenieria' },
    { nivel: 'maestria', duracionAnios: 2 },
    { nivel: 'doctorado', duracionAnios: 4 }
  ],
  categoria: 'asociado',
  experiencia: {
    aniosInvestigacion: 3,
    aniosDocencia: 5,
    aniosDireccion: 1,
    aniosProfesional: 2
  },
  productividad: {
    articulos: [
      { tipoRevista: 'A1', tipoArticulo: 'completo', numeroAutores: 2 },
      { tipoRevista: 'B', tipoArticulo: 'completo', numeroAutores: 3 }
    ],
    libros: [
      { tipo: 'investigacion', numeroAutores: 2 }
    ]
  },
  cargosDirectivos: [
    { tipo: 'director_departamento', anios: 2 }
  ],
  desempeño: {
    destacado: true,
    aniosExperiencia: 5
  },
  bonificaciones: {
    ponencias: [
      { ambito: 'internacional' }
    ],
    direccionTesis: [
      { nivel: 'maestria' }
    ]
  }
};

const resultado = calcularSalarioDocente(docente);
console.log(JSON.stringify(resultado, null, 2));

