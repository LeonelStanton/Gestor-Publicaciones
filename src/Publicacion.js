import { Reporte } from "./Reporte.js";

// Definimos y exportamos por defecto la clase Publicacion
export default class Publicacion {
  // Generador de ID autoincremental estático
  static idIncr = 0;

  constructor(titulo, descripcion, autor) {
    this.id = ++Publicacion.idIncr; // Genera un ID único para cada objeto // Cada publicación tendrá su ID exclusivo (1, 2, 3...)
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.autor = autor; // Por ahora, este autor es un string con el nombre
    this.fechaPublicacion = new Date(); // Se inicializa automáticamente con la fecha y hora actual
    this.activa = true;
    this.destacado = false; // Toda publicación nueva arranca activa por defecto
    this.etiquetas = [];
    this.reportes = [];
    this.estado = "pendiente"; // Colección de etiquetas [4]
  }

  async revisar(servicioModeracion) {
    const decision = await servicioModeracion.evaluar(this);

    if (decision === "aprobado") {
      this.estado = "aprobada";
    } else if (decision === "rechazado") {
      this.estado = "rechazada";
    } else {
      throw new Error("Decisión de moderación inválida");
    }

    return this.estado;
  }

  reportar(usuario, motivo) {
    const yaReporto = this.reportes.some((r) => r.usuario === usuario);
    if (yaReporto) {
      throw new Error("El usuario ya reportó esta publicación");
    }
    this.reportes.push(new Reporte(usuario, motivo));
  }

  requiereRevision() {
    return this.reportes.length >= 3;
  }

  agregarEtiqueta(etiqueta) {
    const normalizada = etiqueta.trim();
    if (!normalizada) {
      throw new Error("Etiqueta inválida"); // [4]
    }
    if (!this.tieneEtiqueta(normalizada)) {
      this.etiquetas.push(normalizada); // Evita duplicados [4]
    }
  }

  tieneEtiqueta(etiqueta) {
    const buscada = etiqueta.trim().toLowerCase();
    return this.etiquetas.some((e) => e.toLowerCase() === buscada); // [4]
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

  resumen() {
    // Retorna una síntesis de una línea con el autor, título y estado de actividad
    const estado = this.estaActiva() ? "Activa" : "Inactiva";
    return `${this.autor.nombre} — "${this.titulo}" [${estado}]`;
    [3];
  }
}
