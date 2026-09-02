// Definimos y exportamos por defecto la clase Publicacion
export default class Publicacion {
    // El constructor recibe los 3 datos iniciales obligatorios
    constructor(titulo, descripcion, autor) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.autor = autor; // Por ahora, este autor es un string con el nombre
        this.fechaPublicacion = new Date(); // Se inicializa automáticamente con la fecha y hora actual
        this.activa = true; // Toda publicación nueva arranca activa por defecto
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
}
