import  RepositorioPublicaciones  from "../public/js/repositoriopublicaciones.js";
import  Publicacion  from "../public/js/publicacion.js";
import  PublicacionVenta  from "../public/js/publicacionventa.js";
import PublicacionServicio  from "../public/js/publicacionservicio.js";

describe("RepositorioPublicaciones", () => {
  test("buscarPorEtiqueta devuelve coincidencias activas", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Apuntes", "Redes", "Ana");
    publicacion.agregarEtiqueta("redes");
    repositorio.agregar(publicacion);

    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([publicacion]); // [6]
  });

  test("una publicación dada de baja queda excluida", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Apuntes", "Redes", "Ana");
    publicacion.agregarEtiqueta("redes");
    publicacion.darDeBaja();
    repositorio.agregar(publicacion);

    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([]); // [6]
  });

  test("una etiqueta inexistente devuelve un arreglo vacío", () => {
 const repositorio = new RepositorioPublicaciones();
 expect(repositorio.buscarPorEtiqueta("inexistente")).toEqual([]);
 });


  test("cada subclase arma su propio resumen polimórfico", () => {
    const venta = new PublicacionVenta("Calculadora", "Uso", "Ana", 5000);
    const servicio = new PublicacionServicio("Clases Álgebra", "Virtual", "Luis", "virtual", 60);

    expect(venta.mostrarResumen()).toContain("5000"); // [12]
    expect(servicio.mostrarResumen()).toContain("Clases Álgebra"); // [12]
  });

  
});