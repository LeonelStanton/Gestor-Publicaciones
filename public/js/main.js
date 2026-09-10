// main.js - Práctica 8 (Completo hasta la Parte 7)
import Usuario from '/src/Usuario.js';
import Publicacion from '/src/Publicacion.js';
import PublicacionVenta from '/src/PublicacionVenta.js';
import PublicacionServicio from '/src/PublicacionServicio.js';
import RepositorioPublicaciones from '/src/RepositorioPublicaciones.js';
import { Reporte } from "/src/Reporte.js";


// === 1. COLECCIÓN EN MEMORIA PARA LAS INSTANCIAS DEL DOMINIO ===
const repositorio = new RepositorioPublicaciones(); // Instancia del repositorio de publicaciones

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


async function manejarEnvio(evento) {
  // 1. Evitamos la recarga nativa de la página.
  evento.preventDefault(); 

  // 2. Validación de seguridad previa (Parte 7)
  // Si el título no cumple las condiciones mínimas, frenamos el submit de inmediato
  if (!validarTitulo(true)) return; 

  // 3. Estado de Carga: Deshabilitamos el botón y cambiamos el texto informativo
  const botonEnviar = formulario.querySelector("button[type='submit']");
  botonEnviar.disabled = true;
  estado.textContent = "Publicando...";

  try {
    // 4. Simulamos la latencia de red de un servidor real (800ms) usando nuestra promesa
    await esperar(800); 

    // 5. Extraemos los valores del formulario
    const tituloVal = document.getElementById("titulo").value.trim();
    const descripcionVal = document.getElementById("descripcion").value.trim();
    const autorNombre = document.getElementById("autor").value.trim();
    const autorEmail = document.getElementById("email").value.trim();
    const tipoVal = document.getElementById("tipo").value;

    // 6. Instanciamos el modelo de negocio (Asociación)
    const autorObj = new Usuario(autorNombre, autorEmail); 

    let nuevaPublicacion;

    // 7. Polimorfismo: Decidimos qué subclase de Publicacion instanciar
    if (tipoVal === "venta") {
        const precioVal = Number(document.getElementById("precio").value);
        nuevaPublicacion = new PublicacionVenta(tituloVal, descripcionVal, autorObj, precioVal); 
    } else {
        const modalidadVal = document.getElementById("modalidad").value;
        const duracionVal = Number(document.getElementById("duracion").value);
        nuevaPublicacion = new PublicacionServicio(tituloVal, descripcionVal, autorObj, modalidadVal, duracionVal); 
    }

    // 8. Agregamos la instancia al repositorio (respetando el encapsulamiento de datos)
    repositorio.agregar(nuevaPublicacion); 

    // 9. Éxito: Comunicamos el resultado positivo
    estado.textContent = "Publicación agregada";

    // 10. Limpieza y reinicio del formulario
    formulario.reset(); 
    
    if (typeof actualizarCamposEspecificos === "function") {
        actualizarCamposEspecificos(); 
    }

    // 11. Limpiamos la vista previa incremental
    actualizarVistaPrevia();

    // 12. Redibujamos la interfaz con el nuevo elemento inyectado en el DOM
    renderizarPublicaciones(); 

  } catch (error) {
    // 13. Capturamos cualquier error de ejecución y lo mostramos en el contenedor de estado
    estado.textContent = `Error: ${error.message}`;
  } finally {
    // 14. El bloque finally garantiza que, ocurra un éxito o un error inesperado,
    // re-evaluamos el estado del formulario para rehabilitar el botón si corresponde.
    actualizarEstadoFormulario(); 
  }
}


// REGISTRAMOS EL EVENTO SUBMIT EN EL FORMULARIO
const formulario = document.getElementById("form-publicacion");
formulario.addEventListener("submit", manejarEnvio); // [1]

// public/main.js - Función renderizarPublicaciones modificada para la Parte 2
function renderizarPublicaciones() {
    listaPublicaciones.innerHTML = ""; // Limpiamos la lista vieja

    repositorio.publicaciones.forEach((pub) => {
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
    const publicacion = repositorio.publicaciones.find(p => p.id === id);
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

/**
 * Retorna una Promesa que se resuelve tras la cantidad de milisegundos especificada.
 */

function esperar(ms) {
return new Promise(resolve => {
setTimeout(resolve, ms);
});
}


const botonActualizar = document.getElementById("boton-actualizar");
const estado = document.getElementById("estado");
async function cargarPublicaciones(forzarError = false) {
  // 1. Fase de Carga: Informamos al usuario y bloqueamos interacciones repetidas
  estado.textContent = "Cargando publicaciones...";
  botonActualizar.disabled = true; [6]

  try {
    // Simulamos una pequeña demora de red antes del fetch para apreciar el estado de carga
    await esperar(1000); [6, 9]

    const url = forzarError ? "/api/publicaciones?error=1" : "/api/publicaciones"; [6]
    const respuesta = await fetch(url); [6]

    // Si la respuesta HTTP no es exitosa (status fuera del rango 200-299), lanzamos error
    if (!respuesta.ok) {
      throw new Error("La respuesta no fue exitosa"); [6]
    }

    const datos = await respuesta.json(); [6]

    // ATENCIÓN: El repositorio debe reconstruir instancias reales (POO), no guardar objetos planos
    publicaciones.cargarDesde(datos); [5]
    
    // Renderizamos la lista actualizada en el DOM
    renderizarPublicaciones(); 

    // Fase de Éxito: Comunicamos la cantidad de publicaciones recibidas
    estado.textContent = `${datos.length} publicaciones recibidas`; [6]

  } catch (error) {
    // Fase de Error: Mostramos el mensaje de error de forma amigable
    estado.textContent = `Error: ${error.message}`; [6]

  } finally {
    // El bloque finally se ejecuta SIEMPRE, garantizando que el botón se vuelva a habilitar
    botonActualizar.disabled = false; [6]
  }
}

const botonError = document.getElementById("boton-error");
// Al hacer clic, forzamos el camino de error del endpoint
botonError.addEventListener("click", () => {
  cargarPublicaciones(true); // Llama con forzarError = true
});


/**
 * Busca o crea dinámicamente un elemento <small> para el mensaje de error
 * justo debajo del input correspondiente.
 */
function obtenerContenedorError(input, id) {
  let errorEl = document.getElementById(id);
  if (!errorEl) {
    errorEl = document.createElement("small");
    errorEl.id = id;
    errorEl.style.color = "#e74c3c"; // Rojo de error
    errorEl.style.display = "block";
    errorEl.style.marginTop = "2px";
    errorEl.style.marginBottom = "8px";
    errorEl.style.fontSize = "0.85em";
    // Inserta el contenedor inmediatamente después del input
    input.insertAdjacentElement("afterend", errorEl);
  }
  return errorEl;
}

// Validación de Título (Mínimo 5 caracteres)
export function validarTitulo(mostrarError = true) {
  const valido = titulo.value.trim().length >= 5;
  const errorTitulo = obtenerContenedorError(titulo, "error-titulo");

  // Toggle de clases CSS para feedback visual inmediato
  titulo.classList.toggle("valido", valido);
  titulo.classList.toggle("invalido", !valido && mostrarError);

  errorTitulo.textContent = !valido && mostrarError 
    ? "El título debe tener al menos 5 caracteres." 
    : "";
  return valido;
}

// Validación de Autor (Mínimo 3 caracteres)
export function validarAutor(mostrarError = true) {
  const valido = autor.value.trim().length >= 3;
  const errorAutor = obtenerContenedorError(autor, "error-autor");

  autor.classList.toggle("valido", valido);
  autor.classList.toggle("invalido", !valido && mostrarError);

  errorAutor.textContent = !valido && mostrarError 
    ? "El nombre de autor debe tener al menos 3 caracteres." 
    : "";
  return valido;
}

// Validación de Precio (Mayor a 0, solo si el tipo seleccionado es "venta")
export function validarPrecio(mostrarError = true) {
  const precioInput = document.getElementById("precio");
  if (!precioInput) return true; // Si no está el campo en pantalla, es válido por defecto

  const precioVal = Number(precioInput.value);
  const valido = precioVal > 0;
  const errorPrecio = obtenerContenedorError(precioInput, "error-precio");

  precioInput.classList.toggle("valido", valido);
  precioInput.classList.toggle("invalido", !valido && mostrarError);

  errorPrecio.textContent = !valido && mostrarError 
    ? "El precio debe ser un número mayor a 0." 
    : "";
  return valido;
}

// REGISTRO DE EVENTOS DE VALIDACIÓN
// - En 'input' validamos silenciosamente (actualiza borde visual sin molestar mientras escribe)
// - En 'blur' mostramos el mensaje de error si el campo quedó incompleto al abandonarlo
titulo.addEventListener("input", () => validarTitulo(false));
titulo.addEventListener("blur", () => validarTitulo(true));

autor.addEventListener("input", () => validarAutor(false));
autor.addEventListener("blur", () => validarAutor(true));

// Escuchamos dinámicamente los campos extra que se inyectan en campos-especificos
camposEspecificos.addEventListener("input", (evento) => {
  if (evento.target.id === "precio") {
    validarPrecio(false);
  }
});
camposEspecificos.addEventListener("focusout", (evento) => {
  if (evento.target.id === "precio") {
    validarPrecio(true);
  }
});


/**
 * Genera una vista previa dinámica en tiempo real basada únicamente en
 * los controles del formulario, sin instanciar clases de dominio todavía.
 */
function actualizarVistaPrevia() {
  const tit = titulo.value.trim() || "Anuncio sin título";
  const aut = autor.value.trim() || "Autor desconocido";
  const desc = descripcion.value.trim() || "Sin descripción aún...";
  const tipoValor = tipo.value.toUpperCase();

  // Actualizamos el elemento <output id="vista-previa">
  vistaPrevia.innerHTML = `
    <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #3498db; margin-top: 5px;">
      <strong>📢 [Previsualización - ${tipoValor}]</strong>
      <p style="margin: 5px 0;"><strong>${tit}</strong> — por <em>${aut}</em></p>
      <p style="color: #555; font-size: 0.9em; font-style: italic;">"${desc}"</p>
    </div>
  `;
}

// Escuchamos el evento 'input' en todos los controles principales para una UX súper reactiva
[titulo, autor, descripcion, tipo].forEach(control => {
  control.addEventListener("input", actualizarVistaPrevia);
});

// También escuchamos dinámicamente cuando cambien los inputs específicos (precio, duración, etc.)
camposEspecificos.addEventListener("input", actualizarVistaPrevia);

// Inicializamos la vista previa en blanco al cargar la página
actualizarVistaPrevia();

const botonEnviar = formulario.querySelector("button[type='submit']");

/**
 * 
 * Evalúa las condiciones completas del formulario para decidir si está listo.
 * Retorna true si cumple todas las reglas, false en caso contrario.
 */
export function formularioValido() {
  const tituloValido = titulo.value.trim().length >= 5;
  const autorValido = autor.value.trim().length >= 3;
  
  // Buscamos el input de precio (que se inyecta dinámicamente) [1, 2]
  const precioInput = document.getElementById("precio");
  
  // El precio solo es obligatorio y debe ser > 0 si el tipo es 'venta' [1, 2]
  const precioValido = tipo.value !== "venta" || (precioInput && Number(precioInput.value) > 0);

  return tituloValido && autorValido && precioValido;
}

/**
 * Modifica la propiedad 'disabled' del botón según el estado del formulario.
 */
export function actualizarEstadoFormulario() {
  const esValido = formularioValido();
  
  // Habilitamos o deshabilitamos el botón [1, 2]
  botonEnviar.disabled = !esValido;
  
  // Agregamos estilos visuales temporales para que se note la inactividad
  if (botonEnviar.disabled) {
    botonEnviar.style.opacity = "0.5";
    botonEnviar.style.cursor = "not-allowed";
  } else {
    botonEnviar.style.opacity = "1";
    botonEnviar.style.cursor = "pointer";
  }
}

// -------------------------------------------------------------
// REGISTRO DE EVENTOS GLOBAL PARA EL FORMULARIO
// -------------------------------------------------------------

// 1. Escuchamos 'input' en el formulario: cualquier tipeo re-evalúa el botón [1, 2]
formulario.addEventListener("input", actualizarEstadoFormulario);

// 2. VERIFICACIÓN CRUCIAL DE LA CÁTEDRA: 
// El evento 'input' a veces no se dispara al cambiar un <select> en ciertos navegadores.
// Registramos explícitamente el evento 'change' en el select de tipo para asegurar que
// se recalcule la validez del formulario al pasar entre Venta y Servicio [1, 5].
tipo.addEventListener("change", actualizarEstadoFormulario);

// 3. Inicializamos el botón como deshabilitado al cargar la página
actualizarEstadoFormulario();

console.log("\n=== 🧪 PRUEBA DE PARTE 2: Moderación en Publicación ===");
const pub = new Publicacion("Carlos", "Vendo Apuntes", "Completos de Redes");

console.log("¿Requiere revisión al inicio?:", pub.requiereRevision()); // false [2]

// 1. Primer reporte válido
pub.reportar("Ana", "Contenido inapropiado");
console.log("Cantidad de reportes acumulados:", pub.reportes.length); // 1

// 2. Intento de reporte duplicado con la misma usuaria (debe fallar)
try {
  pub.reportar("Ana", "Spam repetido");
} catch (error) {
  console.log("✅ Capturado error por duplicado:", error.message); // "El usuario ya reportó esta publicación" [2]
}

// 3. Dos reportes más de usuarios distintos
pub.reportar("Luis", "Spam");
pub.reportar("Pedro", "Información falsa");

console.log("Cantidad de reportes acumulados:", pub.reportes.length); // 3
console.log("¿Requiere revisión con 3 reportes?:", pub.requiereRevision()); // true [2]

