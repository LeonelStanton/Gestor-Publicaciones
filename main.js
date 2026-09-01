// main.js
import Usuario from './Usuario.js';
import PublicacionVenta from './PublicacionVenta.js';
import PublicacionServicio from './PublicacionServicio.js';
import RepositorioPublicaciones from './repositoriopublicaciones.js';

// 1. Inicializamos el repositorio
const repo = new RepositorioPublicaciones();

// ====================================================================
// PARTE 2: REGISTRAR DOS LISTENERS DISTINTOS (Antes de agregar datos) [8]
// ====================================================================

// Listener 1: Muestra por consola el resumen polimórfico de la publicación [13]
repo.on("publicacionAgregada", (p) => {
    console.log(`[Listener 1 - Log] ¡Nueva publicación detectada!: "${p.mostrarResumen()}"`);
});

// Listener 2: Lleva una cuenta acumulada del total en tiempo real [13, 14]
let totalPublicaciones = 0;
repo.on("publicacionAgregada", (p) => {
    totalPublicaciones++;
    console.log(`[Listener 2 - Contador] Total acumulado en el sistema: ${totalPublicaciones} publicaciones.\n`);
});

// 2. Instanciamos datos base para la prueba sincrónica
const u1 = new Usuario("Lucía", "lucia@mail.com");
const v1 = new PublicacionVenta("Vendo apuntes de Álgebra", "Completos", u1, 3500);
const s1 = new PublicacionServicio("Clases de Redes", "Preparación final", u1, "virtual", 90);

console.log("=== 1. PRUEBA DE EVENTOS SINCÓNICOS ===");
repo.agregar(v1); // Disparará ambos listeners automáticamente [13]
repo.agregar(s1);


// ====================================================================
// PARTE 3: SIMULAR OPERACIÓN ASÍNCRONA CON CALLBACKS [11]
// ====================================================================
function publicarConDemora(publicacion, callback) {
    console.log(`[Callback] Iniciando subida diferida de: "${publicacion.titulo}"...`);
    setTimeout(() => {
        repo.agregar(publicacion); // Se agrega y se disparan los eventos [11]
        callback();
    }, 2000); // Demora simulada de 2 segundos [11]
}

console.log("=== 2. PRUEBA ASÍNCRONA: CALLBACK (setTimeout) ===");
const v2 = new PublicacionVenta("Vendo calculadora FX-95", "Excelente estado", u1, 12000);

publicarConDemora(v2, () => {
    console.log("[Callback] ¡La publicación diferida con callback ha terminado exitosamente!");
});

// Este log demuestra que el flujo principal no se queda esperando al setTimeout [12]
console.log("[Código principal] El hilo sigue de largo, no se bloquea esperando la demora...\n");


// ====================================================================
// PARTE 3.5: LA MISMA DEMORA CON PROMISE Y ASYNC/AWAIT [12]
// ====================================================================

// Función auxiliar para envolver el setTimeout en una Promise [5, 12]
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Versión moderna asíncrona [12]
async function publicarConDemoraAsync(publicacion) {
    console.log(`[Async/Await] Iniciando subida diferida de: "${publicacion.titulo}"...`);
    await esperar(2000); // Pausa esta función por 2 segundos sin bloquear el resto del programa [6, 9]
    repo.agregar(publicacion);
}

// Función envolvente asíncrona para orquestar el orden en consola
async function ejecutarFlujoAsync() {
    // Esperamos 3 segundos para que terminen de imprimirse las cosas de la prueba anterior
    await esperar(3000); 
    
    console.log("=== 3. PRUEBA ASÍNCRONA: PROMISE + ASYNC / AWAIT ===");
    const s2 = new PublicacionServicio("Tutoría de JS", "Prácticas de POO de cero", u1, "virtual", 120);
    
    await publicarConDemoraAsync(s2); // Esperamos a que la función asíncrona resuelva [12]
    console.log("[Async/Await] ¡La publicación diferida con Async/Await ha finalizado exitosamente!"); // [9]
}

ejecutarFlujoAsync();