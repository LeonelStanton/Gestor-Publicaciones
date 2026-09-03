// Definimos y exportamos por defecto la clase Publicacion
export default class Publicacion {
    // Declaramos un campo estático privado para llevar la cuenta global de IDs creados
    static #contadorId = 0;
    // El constructor recibe los 3 datos iniciales obligatorios
    constructor(titulo, descripcion, autor) {
        // Incrementamos el contador global y se lo asignamos a esta nueva instancia
        // Incrementamos el contador global y se lo asignamos a esta nueva instancia
        Publicacion.#contadorId++; // [5]
        this.id = Publicacion.#contadorId; // Cada publicación tendrá su ID exclusivo (1, 2, 3...)
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.autor = autor; // Por ahora, este autor es un string con el nombre
        this.fechaPublicacion = new Date(); // Se inicializa automáticamente con la fecha y hora actual
        this.activa = true;
        this.destacado = false; // Toda publicación nueva arranca activa por defecto
    }

    // Método para obtener una vista rápida de la publicación
    mostrarResumen() {
        return `${this.titulo} - ${this.autor.nombre}`;
    }

    // Método para consultar de forma segura el estado de la publicación
    estaActiva() {
        return this.activa;
    }
    darDeBaja() {
    this.activa = false; // Modifica el estado interno de forma segura
}
reactivar() {
    this.activa = true; // <-- Método nuevo para dar soporte al botón interactivo
}
// === MÉTODOS NUEVOS PARA LA PRÁCTICA 9 === [9]
    destacar() {
        this.destacado = true; // Modifica su estado de forma encapsulada [9, 10]
    }

    opacar() {
        this.destacado = false; // Retorna al estado común de forma encapsulada [9]
    }

    estaDestacado() {
        return this.destacado; // Método de consulta útil para la vista [9]
    }
}
