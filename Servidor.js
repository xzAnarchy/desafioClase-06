// Formato: link a un repositorio en Github y url de proyecto subido a glitch
// Realizar un proyecto de servidor basado en node.js que utilice el módulo express e implemente los siguientes endpoints en el puerto 8080:
// Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor
// Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
// Incluir un archivo de texto 'productos.txt' y utilizar la clase Contenedor del desafío anterior para acceder a los datos persistidos del servidor.
// Antes de iniciar el servidor, colocar en el archivo 'productos.txt' tres productos como en el ejemplo del desafío anterior.

const express = require('express')

const app = express()

const PORT = 8080 || process.env.PORT

const fs = require("fs").promises;

const path = require("path");

//Traigo la clase de el desafio anterior
class Contenedor {
    constructor(path) {
        this.path = path
    }

    async save(objeto) {
        try {
            const leer = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(leer)
            let id;
            data.length === 0
                ? (id = 1)
                : (id = data[data.length - 1].id + 1)
            const newProduct = { ...objeto, id }
            data.push(newProduct)
            await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
            return newProduct.id
        } catch (e) {
            console.log(e)
        }
    }

    async getById(id) {
        try {
            const leerArchivo = await fs.readFile(this.path, 'utf-8')
            const data = JSON.parse(leerArchivo)
            const obj = data.find((obj) => obj.id === id)
            obj ? console.log(obj) : console.log("No existe el producto")
        } catch (error) {
            console.log(error)
        }
    }

    async getAll() {
        const leerArchivo = await fs.readFile(this.path, 'utf-8')
        return JSON.parse(leerArchivo)
    }

    async deleteById(id) {
        try {
            const leerArchivo = await fs.readFile(this.path, 'utf-8')
            const data = JSON.parse(leerArchivo)
            const obj = data.find((obj) => obj.id === id)
            if (obj) {
                const newData = data.filter((obj) => obj.id !== id)
                await fs.writeFile(this.path, JSON.stringify(newData, null, 2), "utf-8")
                console.log("Producto eliminado")
            } else {
                console.log("No existe el producto")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.path, JSON.stringify([], null, 2), "utf-8")
        } catch (error) {
            console.log(error)
        }

    }
}
// Traigo el txt con los productos
const contenedor = new Contenedor("productos.txt");

app.get('/', (req, res) => {
    res.send(`<h1 style='color:blue'> Hola Mundo </h1>`)
})

app.get("/productos", async (req, res) => {
    const productos = await contenedor.getAll();
    res.json(productos);
});

app.get("/productoRandom", async (req, res) => {
    const productos = await contenedor.getAll();
    const producto = productos[Math.floor(Math.random() * productos.length)];
    res.json(producto);
});

//configuramos el puerto
const server = app.listen(PORT, () => {
    console.log(`servidor express escuchando en el puerto: ${PORT}`)
})

//escuchamos un evento en caso de error
server.on('error', error => console.log(`error en el servidor ${error}`))