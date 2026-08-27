export default class RepositorioPublicaciones {
    constructor() {
        // Inicializamos la colección de publicaciones vacía [1, 2]
        this.publicaciones = [];
    }

    // Agrega una publicación al array interno [1, 2]
    agregar(publicacion) {
        this.publicaciones.push(publicacion);
    }

    // Busca todas las publicaciones que pertenezcan a un autor por su nombre [1, 2]
    buscarPorUsuario(nombre) {
        return this.publicaciones.filter(p => p.autor.nombre === nombre);
    }

    // [DESAFÍO 1] Devuelve únicamente las publicaciones activas [2]
    filtrarActivas() {
        return this.publicaciones.filter(p => p.estaActiva());
    }

    // [DESAFÍO 2] Devuelve la cantidad total de publicaciones registradas [5]
    cantidadTotal() {
        return this.publicaciones.length;
    }
    // [Novedad Práctica 5] Retorna solo las instancias del constructor de clase enviado
    filtrarPorTipo(claseConstructor) {
        return this.publicaciones.filter(p => p instanceof claseConstructor);
    }

    // [Novedad Práctica 5] Método polimórfico con .map() (cero condicionales "if" internos)
    listarResumenes() {
        return this.publicaciones.map(p => p.mostrarResumen());
    }
}