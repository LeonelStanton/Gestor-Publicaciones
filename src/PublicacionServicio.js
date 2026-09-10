// Importamos la clase base
import Publicacion from './Publicacion.js';

// Usamos 'extends' para indicar la relación "es un" con Publicacion
export default class PublicacionServicio extends Publicacion {
    // El constructor recibe los parámetros comunes de la base más los específicos
    constructor(titulo, descripcion, autor, modalidad, duracionMinutos) {
        super(titulo, descripcion, autor);
        this.modalidad = modalidad;
        this.duracionMinutos = duracionMinutos;
        
        // Nuevo atributo con el rol de "cliente" (tipo Usuario) [4]
        // Nace libre (null) y se completará cuando un alumno reserve la tutoría
        this.cliente = null; 
    }

    // Método para asignar el usuario que reserva el servicio [4]
    asignarCliente(usuarioCliente) {
        this.cliente = usuarioCliente;
    }
      // Sobrescribimos el método heredado de la clase padre (Polimorfismo)
    mostrarResumen() {
        // super.mostrarResumen() resuelve "titulo - autor".
        // Le añadimos la información propia de la modalidad y duración.
        return `${super.mostrarResumen()} | Servicio: ${this.modalidad} (${this.duracionMinutos} min)`;
    }
}