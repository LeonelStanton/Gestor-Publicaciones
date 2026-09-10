export class Reporte {
  constructor(usuario, motivo) {
    const normalizado = motivo ? motivo.trim() : "";
    
    if (!normalizado) {
      throw new Error("Motivo inválido");
    }
    
    this.usuario = usuario;
    this.motivo = normalizado;
    this.fecha = new Date();
  }
}