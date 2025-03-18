// Constantes
const VALOR_PUNTO = 20895

// Variables globales para almacenar los datos del docente
let datosDocente = {
  informacionBasica: {},
  formacionAcademica: {},
  experiencia: {},
  productividad: {
    productos: [],
  },
}

// Función para inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos guardados si existen
  cargarDatosGuardados()

  // Inicializar eventos según la página actual
  const currentPage = window.location.pathname

  if (currentPage.includes("index.html") || currentPage === "/" || currentPage === "") {
    inicializarPaso1()
  } else if (currentPage.includes("paso2.html")) {
    inicializarPaso2()
  } else if (currentPage.includes("paso3.html")) {
    inicializarPaso3()
  } else if (currentPage.includes("paso4.html")) {
    inicializarPaso4()
  } else if (currentPage.includes("resultados.html")) {
    mostrarResultados()
  }

  // Inicializar acordeón en la página de resultados
  if (document.querySelectorAll(".accordion-header").length > 0) {
    inicializarAcordeon()
  }
})

// Función para guardar datos en localStorage
function guardarDatos() {
  localStorage.setItem("datosDocente", JSON.stringify(datosDocente))
}

// Función para cargar datos desde localStorage
function cargarDatosGuardados() {
  const datos = localStorage.getItem("datosDocente")
  if (datos) {
    datosDocente = JSON.parse(datos)
  }
}

// Función para actualizar la barra de progreso
function actualizarProgreso(paso) {
  const progress = document.getElementById("progress")
  if (progress) {
    progress.style.width = ((paso - 1) / 3) * 100 + "%"
  }
}

// Inicializar eventos para el paso 1
function inicializarPaso1() {
  actualizarProgreso(1)

  // Cargar datos guardados en los campos
  if (datosDocente.informacionBasica) {
    const info = datosDocente.informacionBasica
    if (info.nombre) document.getElementById("nombre").value = info.nombre
    if (info.categoria) document.getElementById("categoria").value = info.categoria
    if (info.dedicacion) document.getElementById("dedicacion").value = info.dedicacion
    if (info.vinculacion) document.getElementById("vinculacion").value = info.vinculacion
    if (info.desempeño) document.getElementById("desempeño").value = info.desempeño
    if (info.aniosExperiencia) document.getElementById("aniosExperiencia").value = info.aniosExperiencia
  }

  // Evento para el botón siguiente
  document.getElementById("btnSiguiente1").addEventListener("click", () => {
    // Validar campos
    const nombre = document.getElementById("nombre").value
    const categoria = document.getElementById("categoria").value

    if (!nombre || !categoria) {
      alert("Por favor complete los campos obligatorios: Nombre y Categoría")
      return
    }

    // Guardar datos
    datosDocente.informacionBasica = {
      nombre: document.getElementById("nombre").value,
      categoria: document.getElementById("categoria").value,
      dedicacion: document.getElementById("dedicacion").value,
      vinculacion: document.getElementById("vinculacion").value,
      desempeño: document.getElementById("desempeño").value,
      aniosExperiencia: Number.parseFloat(document.getElementById("aniosExperiencia").value) || 0,
    }

    guardarDatos()
    window.location.href = "paso2.html"
  })
}

// Inicializar eventos para el paso 2
function inicializarPaso2() {
  actualizarProgreso(2)

  // Cargar datos guardados en los campos
  if (datosDocente.formacionAcademica) {
    const formacion = datosDocente.formacionAcademica

    if (formacion.tipoPregrado) {
      document.querySelector(`input[name="pregrado"][value="${formacion.tipoPregrado}"]`).checked = true
    }

    if (formacion.especializaciones) document.getElementById("especializaciones").value = formacion.especializaciones
    if (formacion.especializaciones3) document.getElementById("especializaciones3").value = formacion.especializaciones3
    if (formacion.espMedicas) document.getElementById("espMedicas").value = formacion.espMedicas
    if (formacion.aniosEspMedicas) document.getElementById("aniosEspMedicas").value = formacion.aniosEspMedicas
    if (formacion.maestrias) document.getElementById("maestrias").value = formacion.maestrias
    if (formacion.doctorados) document.getElementById("doctorados").value = formacion.doctorados

    // Mostrar/ocultar campos adicionales
    if (Number.parseInt(formacion.espMedicas) > 0) {
      document.getElementById("espMedicasAnios").style.display = "block"
    }
  }

  // Mostrar/ocultar campos de años de especialización médica
  document.getElementById("espMedicas").addEventListener("change", function () {
    if (Number.parseInt(this.value) > 0) {
      document.getElementById("espMedicasAnios").style.display = "block"
    } else {
      document.getElementById("espMedicasAnios").style.display = "none"
    }
  })

  // Evento para el botón anterior
  document.getElementById("btnAnterior2").addEventListener("click", () => {
    window.location.href = "index.html"
  })

  // Evento para el botón siguiente
  document.getElementById("btnSiguiente2").addEventListener("click", () => {
    // Guardar datos
    datosDocente.formacionAcademica = {
      tipoPregrado: document.querySelector('input[name="pregrado"]:checked').value,
      especializaciones: Number.parseInt(document.getElementById("especializaciones").value) || 0,
      especializaciones3: Number.parseInt(document.getElementById("especializaciones3").value) || 0,
      espMedicas: Number.parseInt(document.getElementById("espMedicas").value) || 0,
      aniosEspMedicas: document.getElementById("aniosEspMedicas").value,
      maestrias: Number.parseInt(document.getElementById("maestrias").value) || 0,
      doctorados: Number.parseInt(document.getElementById("doctorados").value) || 0,
    }

    guardarDatos()
    window.location.href = "paso3.html"
  })
}

// Inicializar eventos para el paso 3
function inicializarPaso3() {
  actualizarProgreso(3)

  // Cargar datos guardados en los campos
  if (datosDocente.experiencia) {
    const exp = datosDocente.experiencia

    if (exp.investigacion) document.getElementById("expInvestigacion").value = exp.investigacion
    if (exp.docencia) document.getElementById("expDocencia").value = exp.docencia
    if (exp.direccion) document.getElementById("expDireccion").value = exp.direccion
    if (exp.profesional) document.getElementById("expProfesional").value = exp.profesional

    if (exp.cargoRector) document.getElementById("cargoRector").value = exp.cargoRector
    if (exp.cargoVicerrector) document.getElementById("cargoVicerrector").value = exp.cargoVicerrector
    if (exp.cargoDecano) document.getElementById("cargoDecano").value = exp.cargoDecano
    if (exp.cargoVicedecano) document.getElementById("cargoVicedecano").value = exp.cargoVicedecano
    if (exp.cargoDirectorDpto) document.getElementById("cargoDirectorDpto").value = exp.cargoDirectorDpto
  }

  // Evento para el botón anterior
  document.getElementById("btnAnterior3").addEventListener("click", () => {
    window.location.href = "paso2.html"
  })

  // Evento para el botón siguiente
  document.getElementById("btnSiguiente3").addEventListener("click", () => {
    // Guardar datos
    datosDocente.experiencia = {
      investigacion: Number.parseFloat(document.getElementById("expInvestigacion").value) || 0,
      docencia: Number.parseFloat(document.getElementById("expDocencia").value) || 0,
      direccion: Number.parseFloat(document.getElementById("expDireccion").value) || 0,
      profesional: Number.parseFloat(document.getElementById("expProfesional").value) || 0,

      cargoRector: Number.parseFloat(document.getElementById("cargoRector").value) || 0,
      cargoVicerrector: Number.parseFloat(document.getElementById("cargoVicerrector").value) || 0,
      cargoDecano: Number.parseFloat(document.getElementById("cargoDecano").value) || 0,
      cargoVicedecano: Number.parseFloat(document.getElementById("cargoVicedecano").value) || 0,
      cargoDirectorDpto: Number.parseFloat(document.getElementById("cargoDirectorDpto").value) || 0,
    }

    guardarDatos()
    window.location.href = "paso4.html"
  })
}

// Inicializar eventos para el paso 4
function inicializarPaso4() {
  actualizarProgreso(4)

  // Cargar productos guardados
  actualizarListaProductos()

  // Eventos para agregar productos
  document.getElementById("addA1").addEventListener("click", () => {
    agregarProducto(
      "articuloA1",
      "Artículo A1",
      Number.parseInt(document.getElementById("articulosA1").value),
      document.getElementById("autoresA1").value,
      15,
    )
  })

  document.getElementById("addA2").addEventListener("click", () => {
    agregarProducto(
      "articuloA2",
      "Artículo A2",
      Number.parseInt(document.getElementById("articulosA2").value),
      document.getElementById("autoresA2").value,
      12,
    )
  })

  document.getElementById("addB").addEventListener("click", () => {
    agregarProducto(
      "articuloB",
      "Artículo B",
      Number.parseInt(document.getElementById("articulosB").value),
      document.getElementById("autoresB").value,
      8,
    )
  })

  document.getElementById("addC").addEventListener("click", () => {
    agregarProducto(
      "articuloC",
      "Artículo C",
      Number.parseInt(document.getElementById("articulosC").value),
      document.getElementById("autoresC").value,
      3,
    )
  })

  document.getElementById("addCorta").addEventListener("click", () => {
    const tipoRevista = document.getElementById("tipoRevistaCorta").value
    let puntos = 0
    let nombre = ""

    switch (tipoRevista) {
      case "A1":
        puntos = 9
        nombre = "Comunicación corta A1"
        break
      case "A2":
        puntos = 7.2
        nombre = "Comunicación corta A2"
        break
      case "B":
        puntos = 4.8
        nombre = "Comunicación corta B"
        break
      case "C":
        puntos = 1.8
        nombre = "Comunicación corta C"
        break
    }

    agregarProducto(
      "comunicacionCorta",
      nombre,
      Number.parseInt(document.getElementById("cantidadCorta").value),
      document.getElementById("autoresCorta").value,
      puntos,
    )
  })

  document.getElementById("addReporte").addEventListener("click", () => {
    const tipoRevista = document.getElementById("tipoRevistaReporte").value
    let puntos = 0
    let nombre = ""

    switch (tipoRevista) {
      case "A1":
        puntos = 4.5
        nombre = "Reporte de caso A1"
        break
      case "A2":
        puntos = 3.6
        nombre = "Reporte de caso A2"
        break
      case "B":
        puntos = 2.4
        nombre = "Reporte de caso B"
        break
      case "C":
        puntos = 0.9
        nombre = "Reporte de caso C"
        break
    }

    agregarProducto(
      "reporteCaso",
      nombre,
      Number.parseInt(document.getElementById("cantidadReporte").value),
      document.getElementById("autoresReporte").value,
      puntos,
    )
  })

  document.getElementById("addLibro").addEventListener("click", () => {
    const tipoLibro = document.getElementById("tipoLibro").value
    let puntos = 0
    let nombre = ""

    switch (tipoLibro) {
      case "investigacion":
        puntos = 20
        nombre = "Libro de investigación"
        break
      case "texto":
        puntos = 15
        nombre = "Libro de texto"
        break
      case "ensayo":
        puntos = 15
        nombre = "Libro de ensayo"
        break
    }

    agregarProducto(
      "libro",
      nombre,
      Number.parseInt(document.getElementById("cantidadLibro").value),
      document.getElementById("autoresLibro").value,
      puntos,
    )
  })

  document.getElementById("addPatente").addEventListener("click", () => {
    agregarProducto(
      "patente",
      "Patente",
      Number.parseInt(document.getElementById("cantidadPatentes").value),
      document.getElementById("autoresPatente").value,
      25,
    )
  })

  document.getElementById("addProduccion").addEventListener("click", () => {
    const tipoProduccion = document.getElementById("tipoProduccion").value
    let puntos = 0
    let nombre = ""

    switch (tipoProduccion) {
      case "innovacion":
        puntos = 15
        nombre = "Innovación tecnológica"
        break
      case "adaptacion":
        puntos = 8
        nombre = "Adaptación tecnológica"
        break
    }

    agregarProducto(
      "produccionTecnica",
      nombre,
      Number.parseInt(document.getElementById("cantidadProduccion").value),
      document.getElementById("autoresProduccion").value,
      puntos,
    )
  })

  document.getElementById("addSoftware").addEventListener("click", () => {
    agregarProducto(
      "software",
      "Software",
      Number.parseInt(document.getElementById("cantidadSoftware").value),
      document.getElementById("autoresSoftware").value,
      15,
    )
  })

  document.getElementById("addObra").addEventListener("click", () => {
    const tipoObra = document.getElementById("tipoObra").value
    let puntos = 0
    let nombre = ""

    switch (tipoObra) {
      case "original_int":
        puntos = 20
        nombre = "Obra artística original internacional"
        break
      case "original_nac":
        puntos = 14
        nombre = "Obra artística original nacional"
        break
      case "complementaria_int":
        puntos = 12
        nombre = "Obra artística complementaria internacional"
        break
      case "complementaria_nac":
        puntos = 8
        nombre = "Obra artística complementaria nacional"
        break
      case "interpretacion_int":
        puntos = 14
        nombre = "Interpretación artística internacional"
        break
      case "interpretacion_nac":
        puntos = 8
        nombre = "Interpretación artística nacional"
        break
    }

    agregarProducto(
      "obraArtistica",
      nombre,
      Number.parseInt(document.getElementById("cantidadObra").value),
      document.getElementById("autoresObra").value,
      puntos,
    )
  })

  // Evento para el botón anterior
  document.getElementById("btnAnterior4").addEventListener("click", () => {
    window.location.href = "paso3.html"
  })

  // Evento para el botón calcular
  document.getElementById("btnCalcular").addEventListener("click", () => {
    guardarDatos()
    window.location.href = "resultados.html"
  })
}

// Función para agregar un producto a la lista
function agregarProducto(tipo, nombre, cantidad, autores, puntosPorUnidad) {
  if (!cantidad || cantidad <= 0) {
    alert("Por favor ingrese una cantidad válida")
    return
  }

  // Factor de ajuste según número de autores
  let factorAutores = 1
  if (autores === "4-5") {
    factorAutores = 0.5
  } else if (autores === "6+") {
    factorAutores = 0.5 / 3 // Aproximación para 6 autores
  }

  // Calcular puntos ajustados
  const puntosAjustados = puntosPorUnidad * factorAutores

  // Agregar producto a la lista
  for (let i = 0; i < cantidad; i++) {
    datosDocente.productividad.productos.push({
      tipo: tipo,
      nombre: nombre,
      autores: autores,
      puntos: puntosAjustados,
    })
  }

  guardarDatos()
  actualizarListaProductos()
}

// Función para actualizar la lista de productos en la interfaz
function actualizarListaProductos() {
  const listaProductos = document.getElementById("listaProductos")
  if (!listaProductos) return

  if (!datosDocente.productividad.productos || datosDocente.productividad.productos.length === 0) {
    listaProductos.innerHTML = '<p class="empty-message">No hay productos agregados</p>'
    return
  }

  let html = ""
  datosDocente.productividad.productos.forEach((producto, index) => {
    html += `
            <div class="product-item">
                <div>${producto.nombre} (${producto.autores} autores) - ${producto.puntos.toFixed(1)} puntos</div>
                <div class="remove-btn" data-index="${index}">✕</div>
            </div>
        `
  })

  listaProductos.innerHTML = html

  // Agregar eventos para eliminar productos
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      datosDocente.productividad.productos.splice(index, 1)
      guardarDatos()
      actualizarListaProductos()
    })
  })
}

// Función para inicializar el acordeón en la página de resultados
function inicializarAcordeon() {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", function () {
      this.parentElement.classList.toggle("active")
    })
  })
}

// Función para mostrar los resultados del cálculo
function mostrarResultados() {
  // Verificar si hay datos para mostrar
  if (!datosDocente.informacionBasica) {
    alert("No hay datos para mostrar. Por favor complete el formulario.")
    window.location.href = "index.html"
    return
  }

  // Mostrar información básica del docente
  document.getElementById("nombreDocente").textContent = datosDocente.informacionBasica.nombre

  let categoriaTexto = ""
  switch (datosDocente.informacionBasica.categoria) {
    case "instructor_auxiliar":
      categoriaTexto = "Instructor o Profesor Auxiliar"
      break
    case "instructor_asociado":
      categoriaTexto = "Instructor Asociado"
      break
    case "asistente":
      categoriaTexto = "Profesor Asistente"
      break
    case "asociado":
      categoriaTexto = "Profesor Asociado"
      break
    case "titular":
      categoriaTexto = "Profesor Titular"
      break
  }
  document.getElementById("categoriaDocente").textContent = categoriaTexto

  let dedicacionTexto = ""
  switch (datosDocente.informacionBasica.dedicacion) {
    case "1":
      dedicacionTexto = "Tiempo Completo"
      break
    case "0.5":
      dedicacionTexto = "Medio Tiempo"
      break
    case "0.25":
      dedicacionTexto = "Cuarto de Tiempo"
      break
  }
  document.getElementById("dedicacionDocente").textContent = dedicacionTexto

  // Calcular puntos
  const resultado = calcularPuntosSalariales(datosDocente)

  // Mostrar puntos en la tabla
  document.getElementById("puntosPregrado").textContent = resultado.puntosTitulos.pregrado
  document.getElementById("puntosPosgrado").textContent = resultado.puntosTitulos.posgrado
  document.getElementById("puntosCategoria").textContent = resultado.puntosCategoria
  document.getElementById("puntosExperiencia").textContent = resultado.puntosExperiencia
  document.getElementById("puntosProductividad").textContent = resultado.puntosProductividad
  document.getElementById("puntosCargos").textContent = resultado.puntosCargos
  document.getElementById("puntosDesempeño").textContent = resultado.puntosDesempeño
  document.getElementById("puntosTotales").textContent = resultado.totalPuntos

  // Mostrar salario
  document.getElementById("valorPunto").textContent = VALOR_PUNTO.toLocaleString()
  document.getElementById("salarioMensual").textContent = (
    resultado.totalPuntos *
    VALOR_PUNTO *
    Number.parseFloat(datosDocente.informacionBasica.dedicacion)
  ).toLocaleString()

  // Mostrar detalles del cálculo
  mostrarDetalleTitulos(resultado)
  mostrarDetalleExperiencia(resultado)
  mostrarDetalleProductividad(resultado)

  // Evento para el botón nuevo cálculo
  document.getElementById("btnNuevoCalculo").addEventListener("click", () => {
    localStorage.removeItem("datosDocente")
    window.location.href = "index.html"
  })

  // Evento para el botón imprimir
  document.getElementById("btnImprimir").addEventListener("click", () => {
    window.print()
  })
}

// Función para mostrar detalle de títulos
function mostrarDetalleTitulos(resultado) {
  const detalle = document.getElementById("detalleTitulos")
  let html = "<ul>"

  // Pregrado
  if (resultado.puntosTitulos.pregrado > 0) {
    html += `<li>Pregrado: ${resultado.puntosTitulos.pregrado} puntos</li>`
  }

  // Posgrados
  if (resultado.detalles.especializaciones > 0) {
    html += `<li>Especializaciones: ${resultado.detalles.especializaciones} puntos</li>`
  }

  if (resultado.detalles.espMedicas > 0) {
    html += `<li>Especializaciones médicas: ${resultado.detalles.espMedicas} puntos</li>`
  }

  if (resultado.detalles.maestrias > 0) {
    html += `<li>Maestrías: ${resultado.detalles.maestrias} puntos</li>`
  }

  if (resultado.detalles.doctorados > 0) {
    html += `<li>Doctorados: ${resultado.detalles.doctorados} puntos</li>`
  }

  html += "</ul>"
  detalle.innerHTML = html
}

// Función para mostrar detalle de experiencia
function mostrarDetalleExperiencia(resultado) {
  const detalle = document.getElementById("detalleExperiencia")
  let html = "<ul>"

  // Experiencia calificada
  if (resultado.detalles.expInvestigacion > 0) {
    html += `<li>Experiencia en investigación: ${resultado.detalles.expInvestigacion} puntos</li>`
  }

  if (resultado.detalles.expDocencia > 0) {
    html += `<li>Experiencia docente: ${resultado.detalles.expDocencia} puntos</li>`
  }

  if (resultado.detalles.expDireccion > 0) {
    html += `<li>Experiencia en dirección: ${resultado.detalles.expDireccion} puntos</li>`
  }

  if (resultado.detalles.expProfesional > 0) {
    html += `<li>Experiencia profesional: ${resultado.detalles.expProfesional} puntos</li>`
  }

  // Cargos académico-administrativos
  if (resultado.detalles.cargoRector > 0) {
    html += `<li>Cargo de Rector: ${resultado.detalles.cargoRector} puntos</li>`
  }

  if (resultado.detalles.cargoVicerrector > 0) {
    html += `<li>Cargo de Vicerrector/Secretario/Director: ${resultado.detalles.cargoVicerrector} puntos</li>`
  }

  if (resultado.detalles.cargoDecano > 0) {
    html += `<li>Cargo de Decano/Director: ${resultado.detalles.cargoDecano} puntos</li>`
  }

  if (resultado.detalles.cargoVicedecano > 0) {
    html += `<li>Cargo de Vicedecano: ${resultado.detalles.cargoVicedecano} puntos</li>`
  }

  if (resultado.detalles.cargoDirectorDpto > 0) {
    html += `<li>Cargo de Director de Departamento: ${resultado.detalles.cargoDirectorDpto} puntos</li>`
  }

  html += "</ul>"
  detalle.innerHTML = html
}

// Función para mostrar detalle de productividad
function mostrarDetalleProductividad(resultado) {
  const detalle = document.getElementById("detalleProductividad")

  if (!datosDocente.productividad.productos || datosDocente.productividad.productos.length === 0) {
    detalle.innerHTML = "<p>No hay productos académicos registrados.</p>"
    return
  }

  let html = "<ul>"

  // Agrupar productos por tipo
  const productosPorTipo = {}
  datosDocente.productividad.productos.forEach((producto) => {
    if (!productosPorTipo[producto.nombre]) {
      productosPorTipo[producto.nombre] = {
        cantidad: 0,
        puntos: 0,
      }
    }
    productosPorTipo[producto.nombre].cantidad++
    productosPorTipo[producto.nombre].puntos += producto.puntos
  })

  // Mostrar productos agrupados
  for (const tipo in productosPorTipo) {
    html += `<li>${tipo}: ${productosPorTipo[tipo].cantidad} producto(s) - ${productosPorTipo[tipo].puntos.toFixed(1)} puntos</li>`
  }

  // Mostrar tope aplicado si corresponde
  if (resultado.detalles.topeProdAplicado) {
    html += `<li class="warning">Se aplicó el tope máximo de ${resultado.detalles.topeProdAplicado} puntos según la categoría docente.</li>`
  }

  html += "</ul>"
  detalle.innerHTML = html
}

// Función principal para calcular los puntos salariales
function calcularPuntosSalariales(datos) {
  // Resultado a devolver
  const resultado = {
    puntosTitulos: {
      pregrado: 0,
      posgrado: 0,
    },
    puntosCategoria: 0,
    puntosExperiencia: 0,
    puntosProductividad: 0,
    puntosCargos: 0,
    puntosDesempeño: 0,
    totalPuntos: 0,
    detalles: {},
  }

  // 1. Calcular puntos por títulos
  resultado.puntosTitulos = calcularPuntosTitulos(datos.formacionAcademica)
  resultado.detalles = { ...resultado.detalles, ...resultado.puntosTitulos.detalles }

  // 2. Calcular puntos por categoría
  resultado.puntosCategoria = calcularPuntosCategoria(datos.informacionBasica.categoria)

  // 3. Calcular puntos por experiencia
  const puntosExp = calcularPuntosExperiencia(datos.experiencia, datos.informacionBasica.categoria)
  resultado.puntosExperiencia = puntosExp.total
  resultado.detalles = { ...resultado.detalles, ...puntosExp.detalles }

  // 4. Calcular puntos por cargos académico-administrativos
  const puntosCargos = calcularPuntosCargos(datos.experiencia)
  resultado.puntosCargos = puntosCargos.total
  resultado.detalles = { ...resultado.detalles, ...puntosCargos.detalles }

  // 5. Calcular puntos por productividad académica
  const puntosProd = calcularPuntosProductividad(datos.productividad, datos.informacionBasica.categoria)
  resultado.puntosProductividad = puntosProd.total
  resultado.detalles = { ...resultado.detalles, ...puntosProd.detalles }

  // 6. Calcular puntos por desempeño destacado
  resultado.puntosDesempeño = calcularPuntosDesempeño(datos.informacionBasica)

  // Calcular total de puntos
  resultado.totalPuntos =
    resultado.puntosTitulos.pregrado +
    resultado.puntosTitulos.posgrado +
    resultado.puntosCategoria +
    resultado.puntosExperiencia +
    resultado.puntosProductividad +
    resultado.puntosCargos +
    resultado.puntosDesempeño

  return resultado
}

// Función para calcular puntos por títulos
function calcularPuntosTitulos(formacion) {
  if (!formacion) return { pregrado: 0, posgrado: 0, detalles: {} }

  const resultado = {
    pregrado: 0,
    posgrado: 0,
    detalles: {
      especializaciones: 0,
      espMedicas: 0,
      maestrias: 0,
      doctorados: 0,
    },
  }

  // Puntos por pregrado
  if (formacion.tipoPregrado === "medicina") {
    resultado.pregrado = 183 // Medicina o composición musical
  } else {
    resultado.pregrado = 178 // Otros pregrados
  }

  // Puntos por especializaciones (1-2 años)
  const puntosEsp = formacion.especializaciones * 20
  resultado.detalles.especializaciones += puntosEsp

  // Puntos por especializaciones (3+ años)
  const puntosEsp3 = formacion.especializaciones3 * 30
  resultado.detalles.especializaciones += puntosEsp3

  // Puntos por especializaciones médicas
  if (formacion.espMedicas > 0 && formacion.aniosEspMedicas) {
    const puntosEspMed = formacion.espMedicas * Number.parseInt(formacion.aniosEspMedicas) * 15
    resultado.detalles.espMedicas = Math.min(puntosEspMed, 75) // Tope de 75 puntos
  }

  // Puntos por maestrías
  let puntosMaestrias = formacion.maestrias * 40
  // Si tiene 2 o más maestrías, se agregan 20 puntos adicionales (tope 60)
  if (formacion.maestrias >= 2) {
    puntosMaestrias = Math.min(puntosMaestrias + 20, 60)
  }
  resultado.detalles.maestrias = puntosMaestrias

  // Verificar si tiene maestría para el cálculo de doctorado
  const tieneMaestria = formacion.maestrias > 0

  // Puntos por doctorados
  let puntosDoctorados = 0
  if (formacion.doctorados > 0) {
    if (!tieneMaestria) {
      // Sin maestría, el primer doctorado vale 120 puntos
      puntosDoctorados = 120
      // Si tiene 2 o más doctorados, se agregan 20 puntos adicionales (tope 140)
      if (formacion.doctorados >= 2) {
        puntosDoctorados = Math.min(puntosDoctorados + 20, 140)
      }
    } else {
      // Con maestría, cada doctorado vale 80 puntos
      puntosDoctorados = formacion.doctorados * 80
      // Si tiene 2 o más doctorados, se agregan 20 puntos adicionales (tope 120)
      if (formacion.doctorados >= 2) {
        puntosDoctorados = Math.min(puntosDoctorados + 20, 120)
      }
    }
  }
  resultado.detalles.doctorados = puntosDoctorados

  // Sumar todos los puntos de posgrado
  resultado.posgrado =
    resultado.detalles.especializaciones +
    resultado.detalles.espMedicas +
    resultado.detalles.maestrias +
    resultado.detalles.doctorados

  // Aplicar tope máximo de 140 puntos por posgrados
  resultado.posgrado = Math.min(resultado.posgrado, 140)

  return resultado
}

// Función para calcular puntos por categoría
function calcularPuntosCategoria(categoria) {
  switch (categoria) {
    case "instructor_auxiliar":
      return 37
    case "instructor_asociado":
      return 44
    case "asistente":
      return 58
    case "asociado":
      return 74
    case "titular":
      return 96
    default:
      return 0
  }
}

// Función para calcular puntos por experiencia
function calcularPuntosExperiencia(experiencia, categoria) {
  if (!experiencia) return { total: 0, detalles: {} }

  const resultado = {
    total: 0,
    detalles: {
      expInvestigacion: 0,
      expDocencia: 0,
      expDireccion: 0,
      expProfesional: 0,
    },
  }

  // Calcular puntos por cada tipo de experiencia
  resultado.detalles.expInvestigacion = experiencia.investigacion * 6
  resultado.detalles.expDocencia = experiencia.docencia * 4
  resultado.detalles.expDireccion = experiencia.direccion * 4
  resultado.detalles.expProfesional = experiencia.profesional * 3

  // Sumar todos los puntos
  const totalPuntos =
    resultado.detalles.expInvestigacion +
    resultado.detalles.expDocencia +
    resultado.detalles.expDireccion +
    resultado.detalles.expProfesional

  // Aplicar topes según categoría
  const topes = {
    instructor_auxiliar: 20,
    instructor_asociado: 20,
    asistente: 45,
    asociado: 90,
    titular: 120,
  }

  resultado.total = Math.min(totalPuntos, topes[categoria] || 0)

  return resultado
}

// Función para calcular puntos por cargos académico-administrativos
function calcularPuntosCargos(experiencia) {
  if (!experiencia) return { total: 0, detalles: {} }

  const resultado = {
    total: 0,
    detalles: {
      cargoRector: 0,
      cargoVicerrector: 0,
      cargoDecano: 0,
      cargoVicedecano: 0,
      cargoDirectorDpto: 0,
    },
  }

  // Calcular puntos por cada tipo de cargo
  resultado.detalles.cargoRector = experiencia.cargoRector * 11
  resultado.detalles.cargoVicerrector = experiencia.cargoVicerrector * 9
  resultado.detalles.cargoDecano = experiencia.cargoDecano * 6
  resultado.detalles.cargoVicedecano = experiencia.cargoVicedecano * 4
  resultado.detalles.cargoDirectorDpto = experiencia.cargoDirectorDpto * 2

  // Sumar todos los puntos
  resultado.total =
    resultado.detalles.cargoRector +
    resultado.detalles.cargoVicerrector +
    resultado.detalles.cargoDecano +
    resultado.detalles.cargoVicedecano +
    resultado.detalles.cargoDirectorDpto

  return resultado
}

// Función para calcular puntos por productividad académica
function calcularPuntosProductividad(productividad, categoria) {
  if (!productividad || !productividad.productos || productividad.productos.length === 0) {
    return { total: 0, detalles: {} }
  }

  const resultado = {
    total: 0,
    detalles: {
      topeProdAplicado: null,
    },
  }

  // Sumar puntos de todos los productos
  let totalPuntos = 0
  productividad.productos.forEach((producto) => {
    totalPuntos += producto.puntos
  })

  // Aplicar topes según categoría
  const topes = {
    instructor_auxiliar: 80,
    instructor_asociado: 110,
    asistente: 160,
    asociado: 320,
    titular: 540,
  }

  const tope = topes[categoria] || 0

  // Si se aplica el tope, guardar el valor para mostrar en detalles
  if (totalPuntos > tope) {
    resultado.detalles.topeProdAplicado = tope
  }

  resultado.total = Math.min(totalPuntos, tope)

  return resultado
}

// Función para calcular puntos por desempeño destacado
function calcularPuntosDesempeño(informacionBasica) {
  if (!informacionBasica) return 0

  let puntos = 0

  // Puntos por desempeño destacado
  if (informacionBasica.desempeño === "si") {
    switch (informacionBasica.categoria) {
      case "titular":
        puntos += 5
        break
      case "asociado":
        puntos += 4
        break
      case "asistente":
        puntos += 3
        break
      case "instructor_auxiliar":
      case "instructor_asociado":
        puntos += 2
        break
    }
  }

  // Puntos por experiencia calificada (2 puntos anuales)
  puntos += informacionBasica.aniosExperiencia * 2

  return puntos
}

