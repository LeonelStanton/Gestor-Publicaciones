
/**
 * Valida si una publicación cumple con los requisitos del sistema.
 * @param {Publicacion} publicacion - El objeto publicación a validar.
 * @param {Object} reglas - El objeto con los parámetros de validación (de paso temporal).
 * @returns {boolean} true si es válida, false en caso contrario.
 */
function validarPublicacion(publicacion, reglas) {
    // Si el título es más corto que el mínimo requerido por las reglas, no es válida
    if (publicacion.titulo.length < reglas.minTitulo) {
        return false;
    }
    return true;
}

import Usuario from './usuario.js';
import PublicacionVenta from './publicacionventa.js';
import RepositorioPublicaciones from './repositoriopublicaciones.js';

const repo = new RepositorioPublicaciones();
const usuario = new Usuario("Lucía", "lucia@mail.com");

// 1. Definimos las reglas que actuarán como dependencia [2, 4]
const reglasNegocio = { minTitulo: 5 };

// 2. Creamos dos publicaciones para probar los límites de la regla
const pValida = new PublicacionVenta("Vendo apuntes de Álgebra", "Completos", usuario, 3500);
const pInvalida = new PublicacionVenta("TP1", "Compañero para redes", usuario, 0); // Título muy corto (3 letras)

// 3. Evaluamos de forma segura antes de guardar [2, 4]
console.log("=== PRUEBA DE VALIDACIÓN ===");

if (validarPublicacion(pValida, reglasNegocio)) {
    repo.agregar(pValida);
    console.log(`[OK] Agregada: "${pValida.titulo}"`);
} else {
    console.log(`[RECHAZADO] Título demasiado corto para: "${pValida.titulo}"`);
}

if (validarPublicacion(pInvalida, reglasNegocio)) {
    repo.agregar(pInvalida);
    console.log(`[OK] Agregada: "${pInvalida.titulo}"`);
} else {
    console.log(`[RECHAZADO] Título demasiado corto para: "${pInvalida.titulo}"`);
}

console.log(`\nCantidad total en el repositorio: ${repo.cantidadTotal()}`); // Debería ser 1