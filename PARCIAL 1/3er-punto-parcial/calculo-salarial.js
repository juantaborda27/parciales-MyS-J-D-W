const VALOR_PUNTO = 20895;

/**
 * Calcula el salario de un docente universitario según el Decreto 1279 de 2002
 * @param {Object} docente - Datos del docente
 * @returns {Object} - Resultado del cálculo
 */
function calcularSalarioDocente(docente) {
  if (!esDocenteAplicable(docente)) {
    return {
      error: "El docente no está en el ámbito de aplicación del Decreto 1279 de 2002"
    };
  }

  const puntosTitulos = calcularPuntosTitulos(docente.titulos);
  const puntosCategoria = calcularPuntosCategoria(docente.categoria);
  const puntosExperiencia = calcularPuntosExperiencia(docente.experiencia, docente.categoria);
  const puntosProductividad = calcularPuntosProductividad(docente.productividad, docente.categoria);
  const puntosDireccion = calcularPuntosDireccion(docente.cargosDirectivos);
  const puntosDesempeño = calcularPuntosDesempeño(docente.desempeño, docente.categoria);
  
  const totalPuntos = puntosTitulos + puntosCategoria + puntosExperiencia + 
                      puntosProductividad + puntosDireccion + puntosDesempeño;
  
  const salarioBase = totalPuntos * VALOR_PUNTO;
  
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


function esDocenteAplicable(docente) {
  return docente.vinculacion === 'concurso' || 
         docente.reingreso || 
         docente.regimen === 'decreto1444' || 
         docente.acogidoDecreto1279;
}

function calcularPuntosTitulos(titulos) {
  if (!titulos || titulos.length === 0) return 0;
  
  let puntos = 0;
  let puntosPregrado = 0;
  let puntosPosgrado = 0;
  
  const pregrado = titulos.find(t => t.nivel === 'pregrado');
  if (pregrado) {
    puntosPregrado = pregrado.area === 'medicina' || pregrado.area === 'composicion_musical' ? 183 : 178;
  }
  
  const posgrados = titulos.filter(t => t.nivel !== 'pregrado');
  
  const doctoradoSinMaestria = posgrados.some(p => p.nivel === 'doctorado') && 
                              !posgrados.some(p => p.nivel === 'maestria');
  
  for (const posgrado of posgrados) {
    let puntosTitulo = 0;
    
    if (posgrado.nivel === 'especializacion') {
      puntosTitulo = Math.min(20 + (posgrado.duracionAnios > 2 ? (posgrado.duracionAnios - 2) * 10 : 0), 30);
    } 
    else if (posgrado.nivel === 'especializacion_clinica' && 
            (pregrado?.area === 'medicina' || pregrado?.area === 'odontologia')) {
      puntosTitulo = Math.min(posgrado.duracionAnios * 15, 75);
    }
    else if (posgrado.nivel === 'maestria') {
      puntosTitulo = 40;
    }
    else if (posgrado.nivel === 'doctorado') {
      puntosTitulo = doctoradoSinMaestria ? 120 : 80;
    }
    
    puntosPosgrado += puntosTitulo;
  }
  
  const maestrias = posgrados.filter(p => p.nivel === 'maestria');
  if (maestrias.length >= 2) {
    puntosPosgrado = Math.min(puntosPosgrado + 20, 60);
  }
  
  const doctorados = posgrados.filter(p => p.nivel === 'doctorado');
  if (doctorados.length >= 2) {
    if (doctoradoSinMaestria) {
      puntosPosgrado = Math.min(puntosPosgrado + 20, 140);
    } else {
      puntosPosgrado = Math.min(puntosPosgrado + 20, 120);
    }
  }
  
  puntosPosgrado = Math.min(puntosPosgrado, 140);
  
  puntos = puntosPregrado + puntosPosgrado;
  return puntos;
}

function calcularPuntosCategoria(categoria) {
  switch (categoria) {
    case 'instructor_auxiliar':
      return 37;
    case 'instructor_asociado': 
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


function calcularPuntosExperiencia(experiencia, categoria) {
  if (!experiencia) return 0;
  
  let puntos = 0;
  
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
  
  const topes = {
    'instructor_auxiliar': 20,
    'instructor_asociado': 20,
    'asistente': 45,
    'asociado': 90,
    'titular': 120
  };
  
  return Math.min(puntos, topes[categoria] || 0);
}

function calcularPuntosProductividad(productividad, categoria) {
  if (!productividad) return 0;
  
  let puntos = 0;
  
  if (productividad.articulos) {
    for (const articulo of productividad.articulos) {
      let puntosArticulo = 0;
      
      if (articulo.tipoRevista === 'A1') {
        puntosArticulo = 15;
      } else if (articulo.tipoRevista === 'A2') {
        puntosArticulo = 12;
      } else if (articulo.tipoRevista === 'B') {
        puntosArticulo = 8;
      } else if (articulo.tipoRevista === 'C') {
        puntosArticulo = 3;
      }
      
      if (articulo.tipoArticulo === 'comunicacion_corta') {
        puntosArticulo *= 0.6;
      } else if (['reporte_caso', 'revision_tema', 'carta_editor', 'editorial'].includes(articulo.tipoArticulo)) {
        puntosArticulo *= 0.3;
      }
      
      if (articulo.numeroAutores > 5) {
        puntosArticulo = puntosArticulo / (articulo.numeroAutores / 2);
      } else if (articulo.numeroAutores > 3) {
        puntosArticulo = puntosArticulo / 2;
      }
      
      puntos += puntosArticulo;
    }
  }
  
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
      
      if (libro.numeroAutores > 5) {
        puntosLibro = puntosLibro / (libro.numeroAutores / 2);
      } else if (libro.numeroAutores > 3) {
        puntosLibro = puntosLibro / 2;
      }
      
      puntos += puntosLibro;
    }
  }
  
  if (productividad.patentes) {
    puntos += productividad.patentes.length * 25;
  }
  
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
      
      if (obra.numeroAutores > 5) {
        puntosObra = puntosObra / (obra.numeroAutores / 2);
      } else if (obra.numeroAutores > 3) {
        puntosObra = puntosObra / 2;
      }
      
      puntos += puntosObra;
    }
  }
  
  if (productividad.produccionTecnica) {
    for (const produccion of productividad.produccionTecnica) {
      if (produccion.tipo === 'innovacion') {
        puntos += 15;
      } else if (produccion.tipo === 'adaptacion') {
        puntos += 8;
      }
    }
  }
  
  if (productividad.software) {
    puntos += productividad.software.length * 15;
  }
  
  const topes = {
    'instructor_auxiliar': 80,
    'instructor_asociado': 110,
    'asistente': 160,
    'asociado': 320,
    'titular': 540
  };
  
  return Math.min(puntos, topes[categoria] || 0);
}

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
    
    puntosCargo *= cargo.anios || 1;
    puntos += puntosCargo;
  }
  
  return puntos;
}

function calcularPuntosDesempeño(desempeño, categoria) {
  if (!desempeño) return 0;
  
  let puntos = 0;
  
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
  
  if (desempeño.aniosExperiencia) {
    puntos += desempeño.aniosExperiencia * 2;
  }
  
  return puntos;
}

function calcularBonificaciones(docente) {
  if (!docente.bonificaciones) return 0;
  
  let totalBonificaciones = 0;
  
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
  
  if (docente.bonificaciones.publicacionesImpresas) {
    totalBonificaciones += docente.bonificaciones.publicacionesImpresas.length * 60 * VALOR_PUNTO;
  }
  
  if (docente.bonificaciones.estudiosPostdoctorales) {
    totalBonificaciones += docente.bonificaciones.estudiosPostdoctorales.length * 120 * VALOR_PUNTO;
  }
  
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

