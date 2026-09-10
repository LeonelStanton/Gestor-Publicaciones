// Importamos la clase base que creamos en la Práctica 1
import Publicacion from './Publicacion.js';

// Usamos 'extends' para indicar que PublicacionVenta hereda de Publicacion
export default class PublicacionVenta extends Publicacion {
    // El constructor recibe los datos comunes y el dato específico (precio)
    constructor(titulo, descripcion, autor, precio) {
        // super() llama al constructor de la clase padre (Publicacion). 
        // ¡DEBE ser la primera línea del constructor!
        super(titulo, descripcion, autor);
        
        // Atributos específicos de esta subclase
        this.precio = precio; // Tipo Number
        this.stock = 1;       // Inicializado automáticamente en 1
    }

      // Sobrescribimos el método heredado de la clase padre
    mostrarResumen() {
        // super.mostrarResumen() resuelve "titulo - autor". 
        // Solo le sumamos el comportamiento propio de la venta (el precio).
        return `${super.mostrarResumen()} | Precio: $${this.precio}`;
    }
}