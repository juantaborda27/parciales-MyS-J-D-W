function mostrarAlerta() {
    const seleccion = document.getElementById("c_postgrado").value;
    if (seleccion !== "") {
        alert("Si un profesor tiene varios títulos de postgrado (como especialización, maestría, doctorado, etc.), solo se le otorgará la bonificación correspondiente al título más alto y más reciente que haya obtenido. Es decir, no acumulará bonificaciones por cada uno de sus títulos, sino que solo recibirá la del nivel más avanzado.");
    }
}


function mostrarAlerta2() {
    const seleccion = document.getElementById("c_postgrado").value;
    if (seleccion !== "") {
        alert("La Universidad Popular del Cesar reconocerá a los profesores ocasionales una bonificación económica mensual adicional por pertenecer a grupos clasificados por Colciencias y semilleros registrados en la división de investigación de la Universidad Popular del Cesar de acuerdo a la siguiente tabla y se ajustarán según el IPC anual vigente, en su lugar lo que establezca el Consejo Superior Universitario o el Rector de la Universidad (por autonomía universitaria)");
    }
}

// function calcularSalario() {
//     const salarioMinimoActual = 1423500;

//     // Obtiene el factor de la categoría docente y multiplica por el salario mínimo actual
//     const factorCategoria = parseFloat(document.getElementById("categoria_docente").value) || 0;
//     const salarioBase = salarioMinimoActual * factorCategoria;

//     const puntos = parseFloat(document.getElementById("puntos").value) || 0;
//     const bonificacionPostgrado = parseFloat(document.getElementById("c_postgrado").value) || 0;
//     const bonificacionSemillero = parseFloat(document.getElementById("c_semillero").value) || 0;

//     const valorPorPunto = 6556; // Valor de cada punto en pesos colombianos
//     const totalPuntos = puntos * valorPorPunto; // Cálculo del valor total de los puntos

//     let salarioTotal = salarioBase + totalPuntos; // Se suman los puntos al salario base

//     // Aplicar las bonificaciones correctamente como porcentaje del salarioTotal
//     salarioTotal += salarioTotal * bonificacionPostgrado;
//     salarioTotal += salarioTotal * bonificacionSemillero;

//     // Formateamos el salario para mostrarlo en pesos colombianos
//     let salarioFormateado = Math.round(salarioTotal).toLocaleString("es-CO");

//     // Mostramos el resultado en la página y en una alerta
//     document.getElementById("resultado").textContent = `Salario Total: ${salarioFormateado} COP`;
//     alert(`Salario Total: ${salarioFormateado} COP`);

//     setTimeout(limpiarCampos(), 3000);
// }


function calcularSalario() {
    salarioMinimoActual = 1423500;
    const bonificacionPostgrado = parseFloat(document.getElementById("c_postgrado").value) || 0;
    const bonificacionSemillero = parseFloat(document.getElementById("c_semillero").value) || 0;

    salarioMinimoActual += salarioMinimoActual*bonificacionPostgrado;
    salarioMinimoActual += salarioMinimoActual*bonificacionSemillero;


    // Obtiene el factor de la categoría docente y multiplica por el salario mínimo actual
    const factorCategoria = parseFloat(document.getElementById("categoria_docente").value) || 0;
    const salarioBase = salarioMinimoActual * factorCategoria;

    const puntos = parseFloat(document.getElementById("puntos").value) || 0;
    // const bonificacionPostgrado = parseFloat(document.getElementById("c_postgrado").value) || 0;
    // const bonificacionSemillero = parseFloat(document.getElementById("c_semillero").value) || 0;

    const valorPorPunto = 6556; // Valor de cada punto en pesos colombianos
    const totalPuntos = puntos * valorPorPunto; // Cálculo del valor total de los puntos

    let salarioTotal = salarioBase + totalPuntos; // Se suman los puntos al salario base

    // Aplicar las bonificaciones correctamente como porcentaje del salarioTotal
    // salarioTotal += salarioTotal * bonificacionPostgrado;
    // salarioTotal += salarioTotal * bonificacionSemillero;

    // Formateamos el salario para mostrarlo en pesos colombianos
    let salarioFormateado = Math.round(salarioTotal).toLocaleString("es-CO");

    // Mostramos el resultado enS la página y en una alerta
    document.getElementById("resultado").textContent = `Salario Total: ${salarioFormateado} COP`;
    alert(`Salario Total: ${salarioFormateado} COP`);

    setTimeout(limpiarCampos(), 3000);
}



// function actualizarPuntos() {
//     let total = 0;

//     // Obtener todos los select y sumar solo los que tienen opciones con id="punto"
//     document.querySelectorAll("select").forEach(select => {
//         const selectedOption = select.options[select.selectedIndex];
//         if (selectedOption && selectedOption.id === "punto") {
//             total += parseFloat(selectedOption.value) || 0;
//         }
//     });

//     document.getElementById("puntos").value = total; // Mostrar el total en el input
// }



function actualizarPuntos() {
    let total = 0;

    // Obtener todas las publicaciones seleccionadas con sus cantidades
    document.querySelectorAll("#lista_publicaciones li").forEach(li => {
        let puntos = parseFloat(li.dataset.puntos) || 0;
        let cantidad = parseInt(li.querySelector(".cantidad").value) || 1;
        total += puntos * cantidad; // Multiplica puntos por cantidad
    });

    document.querySelectorAll("select").forEach(select => {
            const selectedOption = select.options[select.selectedIndex];
                if (selectedOption && selectedOption.id === "punto") {
                    total += parseFloat(selectedOption.value) || 0;
                }
            });

    document.getElementById("puntos").value = total; // Mostrar el total en el input
}

// Agregar eventos a todos los select para actualizar los puntos en tiempo real
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", actualizarPuntos);
    });
});



function abrirModal() {
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("area_desempeño").addEventListener("change", function () {
    let valorSeleccionado = this.value;

    // Mostrar modal solo si se selecciona "Especialización" o "Especialización(2)"
    if (valorSeleccionado === "40" || valorSeleccionado === "20") {
        abrirModal();
    }
});


function limpiarCampos() {
    document.getElementById("categoria_docente").selectedIndex = 0;
    document.getElementById("area_desempeño").selectedIndex = 0;
    document.getElementById("experiencia_calificada").selectedIndex = 0;
    document.getElementById("g_investigacion").selectedIndex = 0;
    document.getElementById("c_investigador").selectedIndex = 0;
    document.getElementById("tipo_publicacion").selectedIndex = 0;
    document.getElementById("c_postgrado").selectedIndex = 0;
    document.getElementById("c_semillero").selectedIndex = 0;
    document.getElementById("puntos").value = 0;
    document.getElementById("resultado").innerText = "";
    document.getElementsByClassName("acntidad").style.display = "none";
}

// function agregarPublicacion() {
//     let select = document.getElementById("tipo_publicacion");
//     let lista = document.getElementById("lista_publicaciones");
//     let opcionSeleccionada = select.options[select.selectedIndex];

//     if (opcionSeleccionada.value !== "" && !document.getElementById(`pub-${opcionSeleccionada.value}`)) {
//         let li = document.createElement("li");
//         li.id = `pub-${opcionSeleccionada.value}`;
//         li.innerHTML = `
//             <span>${opcionSeleccionada.text} - Puntos: ${opcionSeleccionada.value}</span>
//             <input type="number" min="1" max="5" value="1" class="cantidad">
//             <button onclick="this.parentNode.remove()">❌</button>
//         `;
//         lista.appendChild(li);
//     }
// }



function agregarPublicacion() {
    let select = document.getElementById("tipo_publicacion");
    let lista = document.getElementById("lista_publicaciones");
    let opcionSeleccionada = select.options[select.selectedIndex];

    if (opcionSeleccionada.value !== "" && !document.getElementById(`pub-${opcionSeleccionada.value}`)) {
        let li = document.createElement("li");
        li.id = `pub-${opcionSeleccionada.value}`;
        li.dataset.puntos = opcionSeleccionada.value; // Guardamos los puntos como atributo

        li.innerHTML = `
            <span>${opcionSeleccionada.text} - Puntos: ${opcionSeleccionada.value}</span>
            <input type="number" min="1" max="5" value="1" class="cantidad" oninput="actualizarPuntos()">
            <button onclick="this.parentNode.remove(); actualizarPuntos();">❌</button>
        `;
        lista.appendChild(li);
    }
}

// Agregar eventos a todos los select para actualizar los puntos en tiempo real
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", actualizarPuntos);
    });
});