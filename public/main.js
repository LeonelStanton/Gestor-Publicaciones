// main.js - Práctica 8 (Completo hasta la Parte 7)
import Usuario from '../usuario.js';
import PublicacionVenta from '../publicacionventa.js';
import PublicacionServicio from '../publicacionservicio.js';

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


// === 6. PARTE 6: SUBMIT CREA OBJETOS DEL DOMINIO ===
form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const autorObj = new Usuario(autor.value, email.value);
    let nuevaPublicacion;

    if (tipo.value === "venta") {
        const precio = parseFloat(document.getElementById("precio").value);
        const stock = parseInt(document.getElementById("stock").value);
        
        nuevaPublicacion = new PublicacionVenta(titulo.value, descripcion.value, autorObj, precio);
        nuevaPublicacion.stock = stock;
    } else {
        const modalidad = document.getElementById("modalidad").value;
        const duracion = parseInt(document.getElementById("duracion").value);
        
        nuevaPublicacion = new PublicacionServicio(titulo.value, descripcion.value, autorObj, modalidad, duracion);
    }

    publicaciones.push(nuevaPublicacion);

    renderizarPublicaciones();

    form.reset();
    actualizarCamposEspecificos();
    actualizarVistaPrevia();
});


// === 7. PARTE 7: CLICK MODIFICA UNA SOLA PUBLICACIÓN ===
function renderizarPublicaciones() {
    listaPublicaciones.innerHTML = "";

    publicaciones.forEach((pub) => {
        const tarjeta = document.createElement("article");
        
        // Si la publicación está inactiva, le agregamos la clase CSS correspondiente
        // para que se muestre semitransparente y tachada en el navegador
        tarjeta.className = `tarjeta ${pub.estaActiva() ? "" : "inactiva"}`;

        tarjeta.innerHTML = `
            <h4>${pub.titulo}</h4>
            <p>${pub.mostrarResumen()}</p>
            <p><small>Publicado por: ${pub.autor.mostrarPerfil()}</small></p>
        `;

        // Creamos el botón "Dar de baja" o "Reactivar" según el estado del objeto
        const botonBaja = document.createElement("button");
        botonBaja.textContent = pub.estaActiva() ? "Dar de baja" : "Reactivar";
        
        // El listener del click captura el objeto "pub" específico gracias al closure
        botonBaja.addEventListener("click", () => {
            if (pub.estaActiva()) {
                pub.darDeBaja(); // Llamamos al método que encapsula el comportamiento
            } else {
                pub.activa = true; // Permite revertir la baja
            }
            // Redibujamos la lista completa para reflejar el cambio de inmediato
            renderizarPublicaciones();
        });

        tarjeta.appendChild(botonBaja);
        listaPublicaciones.appendChild(tarjeta);
    });
}