// Definimos y exportamos por defecto la clase Usuario
export default class Usuario {
    // El constructor recibe el nombre y el email obligatorios
    constructor(nombre, email) {
        this.nombre = nombre;
        this.email = email;
        this.fechaRegistro = new Date(); // Se inicializa automáticamente con la fecha y hora actual
    // Auto-asociación: guardamos una lista de contactos (otros objetos Usuario) [4]
        this.contactos = []; 
    }

    // Método para obtener una vista rápida del perfil
    mostrarPerfil() {
        return `${this.nombre} - ${this.email}`;
    }

    // Método para agregar un contacto a nuestra agenda [4]
    agregarContacto(otroUsuario) {
        this.contactos.push(otroUsuario);
    }
}