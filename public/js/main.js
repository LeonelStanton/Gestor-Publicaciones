// main.js - Práctica 8 (Completo hasta la Parte 7)
import Usuario from './usuario.js';
import PublicacionVenta from './publicacionventa.js';
import PublicacionServicio from './publicacionservicio.js';

// === 1. COLECCIÓN EN MEMORIA PARA LAS INSTANCIAS DEL DOMINIO ===
const publicaciones = [];

// === 2. SELECCIÓN DE ELEMENTOS DEL DOM ===
const form = document.getElementById("form-publicacion");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const autor = document.getElementById("autor");
const email = document.getElementById("email");
const tipo = document.getElementById("tipo");
const camposEspecificos = document.getElementById("campos-especificos");
const ayudaEmail = document.getElementById("ayuda-email");
const vistaPrevia = document.getElementById("vista-previa");
const listaPublicaciones = document.getElementById("lista-publicaciones");

// === 3. PARTE 3: VISTA PREVIA INCREMENTAL EN TIEMPO REAL ===
function actualizarVistaPrevia() {
    const txtTitulo = titulo.value || "[Título vacío]";
    const txtAutor = autor.value || "[Autor vacío]";
    vistaPrevia.textContent = `${txtTitulo} - ${txtAutor}`;
}
titulo.addEventListener("input", actualizarVistaPrevia);
autor.addEventListener("input", actualizarVistaPrevia);


// === 4. PARTE 4: CHANGE ADAPTA EL FORMULARIO (Código de la Consigna) ===
function actualizarCamposEspecificos() {   
    if (tipo.value === "venta") {     
        camposEspecificos.innerHTML = `       
            <input id="precio" type="number" placeholder="Precio" required>       
            <input id="stock" type="number" value="1" min="1" required>`;   
    } else {     
        camposEspecificos.innerHTML = `       
            <select id="modalidad">         
                <option value="presencial">presencial</option>
                <option value="virtual">virtual</option>       
            </select>       
            <input id="duracion" type="number" placeholder="Minutos" required>`;   
    } 
}
tipo.addEventListener("change", actualizarCamposEspecificos); 
actualizarCamposEspecificos();


// === 5. PARTE 5: FOCUS Y BLUR OFRECEN AYUDA ===
function mostrarAyudaEmail() {
    ayudaEmail.textContent = "Por favor, ingresá un correo válido para que puedan contactarte.";
    ayudaEmail.style.color = "#0056b3";
}

function ocultarAyudaEmail() {
    ayudaEmail.textContent = "";
}

email.addEventListener("focus", mostrarAyudaEmail);
email.addEventListener("blur", ocultarAyudaEmail);


function manejarEnvio(evento) {
    // 1. Evitamos la recarga nativa de la página. 
    // Si no hacemos esto, el navegador intenta enviar un HTTP POST/GET, 
    // refresca la pestaña y perdemos el array 'publicaciones' de la memoria.
    evento.preventDefault(); // [1, 2]

    // 2. Extraemos los valores del formulario
    const tituloVal = document.getElementById("titulo").value.trim();
    const descripcionVal = document.getElementById("descripcion").value.trim();
    const autorNombre = document.getElementById("autor").value.trim();
    const autorEmail = document.getElementById("email").value.trim();
    const tipoVal = document.getElementById("tipo").value;

    // 3. Instanciamos el objeto asociado obligatorio de nuestro modelo
    const autorObj = new Usuario(autorNombre, autorEmail); // [3]

    let nuevaPublicacion;

    // 4. Decidimos qué subclase instanciar según la opción seleccionada (Polimorfismo)
    if (tipoVal === "venta") {
        const precioVal = Number(document.getElementById("precio").value);
        nuevaPublicacion = new PublicacionVenta(tituloVal, descripcionVal, autorObj, precioVal); // [3]
    } else {
        const modalidadVal = document.getElementById("modalidad").value;
        const duracionVal = Number(document.getElementById("duracion").value);
        nuevaPublicacion = new PublicacionServicio(tituloVal, descripcionVal, autorObj, modalidadVal, duracionVal); // [3]
    }

    // 5. Agregamos la nueva instancia al repositorio (nuestro array en memoria)
    publicaciones.push(nuevaPublicacion); // [1]

    // 6. Limpiamos los campos del formulario para dejarlo listo para otra carga
    formulario.reset(); // [1]
    
    // Si tenías una función para actualizar los campos específicos (venta/servicio), 
    // la llamamos para que se limpie el contenedor dinámico
    if (typeof actualizarCamposEspecificos === "function") {
        actualizarCamposEspecificos(); 
    }

    // 7. Redibujamos la interfaz
    renderizarPublicaciones(); // [1]
}

// REGISTRAMOS EL EVENTO SUBMIT EN EL FORMULARIO
const formulario = document.getElementById("form-publicacion");
formulario.addEventListener("submit", manejarEnvio); // [1]

// public/main.js - Función renderizarPublicaciones modificada para la Parte 2
function renderizarPublicaciones() {
    listaPublicaciones.innerHTML = ""; // Limpiamos la lista vieja

    publicaciones.forEach((pub) => {
        const tarjeta = document.createElement("article");
        
        // 1. Vinculamos el ID del objeto al atributo data-id del DOM [1]
        tarjeta.setAttribute("data-id", pub.id); 

        // Evaluamos el estado del objeto del dominio para aplicar clases de CSS dinámicas [15]
        let clasesTarjeta = "tarjeta";
        if (!pub.estaActiva()) clasesTarjeta += " inactiva";
        if (pub.estaDestacado()) clasesTarjeta += " destacado";
        
        tarjeta.className = clasesTarjeta;

        // 2. Creamos la estructura interna con los atributos data-accion correspondientes [1]
        tarjeta.innerHTML = `
            <h4>${pub.titulo}</h4>
            <p>${pub.mostrarResumen()}</p>
            <p><small>Publicado por: ${pub.autor.mostrarPerfil()}</small></p>
            
            <div class="acciones-tarjeta">
                <!-- Botón Destacar con data-accion -->
                <button data-accion="destacar">
                    ${pub.estaDestacado() ? "Quitar destacado" : "Destacar"}
                </button>
                
                <!-- Botón Dar de baja con data-accion -->
                <button data-accion="baja">
                    ${pub.estaActiva() ? "Dar de baja" : "Reactivar"}
                </button>
            </div>
        `;

        listaPublicaciones.appendChild(tarjeta);
    });
}

// public/main.js - Parte 4: Conectar con el dominio
function manejarAccion(evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton || !listaPublicaciones.contains(boton)) return;

    const tarjeta = boton.closest("[data-id]");
    const id = Number(tarjeta.dataset.id);
    const accion = boton.dataset.accion;

    // 1. Buscamos el objeto Publicación real dentro de nuestro array de memoria
    const publicacion = publicaciones.find(p => p.id === id);
    if (!publicacion) return; // Validación de seguridad

    // 2. Ejecutamos la lógica de negocio invocando sus métodos públicos encapsulados
    if (accion === "baja") {
        if (publicacion.estaActiva()) {
            publicacion.darDeBaja(); //
        } else {
            publicacion.reactivar(); //
        }
    } else if (accion === "destacar") {
        if (publicacion.estaDestacado()) {
            publicacion.opacar(); //
        } else {
            publicacion.destacar(); //
        }
    }

    // 3. Volvemos a renderizar la lista para que la pantalla refleje los nuevos estados
    renderizarPublicaciones();
}

// REGISTRO ÚNICO: El contenedor padre escucha los clics de todos los botones actuales y futuros
listaPublicaciones.addEventListener("click", manejarAccion);