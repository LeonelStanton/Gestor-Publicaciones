// tests/asincronia.test.js

import  Publicacion  from "../src/Publicacion.js";

describe("Publicacion.revisar", () => {
  // 1. Caso exitoso: Aprobación
  test("aprueba la publicación cuando el servicio resuelve aprobado", async () => {
    const servicio = { evaluar: async () => "aprobado" };
    const publicacion = new Publicacion("Apuntes de Redes", "..." , "Ana");
    
    await expect(publicacion.revisar(servicio)).resolves.toBe("aprobada");
    expect(publicacion.estado).toBe("aprobada");
  });

  // 2. Caso exitoso: Rechazo
  test("rechaza la publicación cuando el servicio resuelve rechazado", async () => {
    const servicio = { evaluar: async () => "rechazado" };
    const publicacion = new Publicacion("Apuntes de Redes", "..." , "Ana");
    
    await expect(publicacion.revisar(servicio)).resolves.toBe("rechazada");
  });

  // 3. Caso de falla: Error en el servicio externo
  test("conserva el estado pendiente si el servicio falla", async () => {
    const servicio = {
      evaluar: async () => { throw new Error("Servicio no disponible"); }
    };
    const publicacion = new Publicacion("Apuntes de Redes", "..." , "Ana");
    
    await expect(publicacion.revisar(servicio)).rejects.toThrow("Servicio no disponible");
    expect(publicacion.estado).toBe("pendiente");
  });
});