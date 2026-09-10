import Publicacion  from "../src/Publicacion.js";

describe("Publicacion", () => {
  test("una publicación nueva comienza activa y sin etiquetas", () => {
    const publicacion = new Publicacion("Apuntes Redes", "Completos", "Ana");
    expect(publicacion.activa).toBe(true);
    expect(publicacion.etiquetas).toEqual([]); // [9]
  });

  test("agregarEtiqueta incorpora una etiqueta normalizada", () => {
    const publicacion = new Publicacion("Apuntes Redes", "Completos", "Ana");
    publicacion.agregarEtiqueta("  redes  ");
    expect(publicacion.etiquetas).toEqual(["redes"]); // [9]
  });

  test("darDeBaja cambia activa a false", () => {
 const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
 publicacion.darDeBaja();
 expect(publicacion.activa).toBe(false);
 });


  test("una etiqueta repetida no se agrega dos veces", () => {
    const publicacion = new Publicacion("Apuntes Redes", "Completos", "Ana");
    publicacion.agregarEtiqueta("redes");
    publicacion.agregarEtiqueta("redes");
    expect(publicacion.etiquetas).toEqual(["redes"]); // [11]
  });

  test("una etiqueta vacía lanza el error esperado", () => {
    const publicacion = new Publicacion("Apuntes Redes", "Completos", "Ana");
    expect(() => publicacion.agregarEtiqueta("   ")).toThrow("Etiqueta inválida"); // [11]
  });

  test("tieneEtiqueta ignora mayúsculas y minúsculas", () => {
    const publicacion = new Publicacion("Apuntes Redes", "Completos", "Ana");
    publicacion.agregarEtiqueta("Redes");
    expect(publicacion.tieneEtiqueta("redes")).toBe(true); // [11]
  });
});