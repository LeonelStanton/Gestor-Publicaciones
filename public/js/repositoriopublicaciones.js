// RepositorioPublicaciones.js// Importamos el emisor nativo de Node [8]

export default class RepositorioPublicaciones { // Aplicamos herencia [8]
    constructor() {

        this.publicaciones = [];
    }

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

     cargarDesde(datos) {
    this.publicaciones = []; 

    datos.forEach(obj => {
      const autorObj = new Usuario(obj.autor.nombre, obj.autor.email); 
      let inst;

      if (obj.tipo === "venta" || obj.precio !== undefined) {
        inst = new PublicacionVenta(obj.titulo, obj.descripcion, autorObj, obj.precio);
        inst.stock = obj.stock || 1;
      } else {
        inst = new PublicacionServicio(obj.titulo, obj.descripcion, autorObj, obj.modalidad, obj.duracionMinutos);
      }

      if (obj.activa !== undefined) {
        inst.activa = obj.activa;
      }

      this.agregar(inst);
    });
  }
}