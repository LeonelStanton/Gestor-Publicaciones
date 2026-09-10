// server.js
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servimos public para el HTML/CSS y JS cliente
app.use(express.static(path.join(__dirname, "public")));

// 🚀 AGREGÁ ESTA LÍNEA: Publicamos también la carpeta src/
app.use("/src", express.static(path.join(__dirname, "src")));

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));