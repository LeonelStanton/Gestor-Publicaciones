import express from "express";

const app = express();

// Servir de forma estática los archivos que están en la carpeta 'public'
app.use(express.static("public"));

// Escuchar en el puerto 3000 como lo pide la materia
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Gestor de publicaciones disponible en http://localhost:${PORT}`);
});