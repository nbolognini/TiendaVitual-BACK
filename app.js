

const express = require('express'); // 1) Importo Express
const app = express(); //              2) Creo instancia de Express
const bodyParser = require('body-parser');

const mysql = require('mysql'); // 3) Importo módulo mysql para poder interactuar con bases de datos MySQL

const cors = require('cors'); // 4)habilitamos los cors para no hay problemas de comunicacion entre el front y el back
app.use(cors());
app.use(express.json());  

app.use(bodyParser.json());

const connection = mysql.createConnection({ // 5) Creo conexión a la base de datos y configuro los datos de conexión
    host: '192.168.0.38',   
    user: 'usuarioFull',      
    password: 'abcd1234',     
    database: 'tiendavirtual' 
});

connection.connect((err) => { // consulto si se pudo conectar a la base de datos
    if (err) { // Si hay un error al conectar, lo mostramos en consola
        console.log('Error connecting to database');
        return; // Salimos de la función para evitar más ejecución
    }
    // Si la conexión es exitosa, me da el ok
    console.log('Connection exitosa!');
});


app.get('/productos', (req, res) => { // 6) Crear endpoint GET /productos para que me devulva todos los productos
    console.log('Intentando acceder a /productos');

    // Verificar el estado de la conexión
    if (connection.state === 'disconnected') {
        console.log('La conexión a la base de datos está cerrada.');
        res.status(500).send('Internal Server Error: DB connection closed');
        return;
    }

    connection.query('SELECT * FROM productos', (err, rows) => {
        if (err) {
            console.error('Error querying database:', err); // Mostrar el error específico
            res.status(500).send('Error querying database');
            return;
        }
        console.log('Productos consultados con éxito:', rows.length);
        res.json(rows); // Enviar los productos como respuesta en formato JSON
    });
});


app.post('/guardarProductos', (req, res) => {
    // Verificar el estado de la conexión a la base de datos
    if (connection.state === 'disconnected') {
        console.log('La conexión a la base de datos está cerrada.');
        res.status(500).send('Internal Server Error: DB connection closed');
        return;
    }

    // Acceder a la propiedad 'productos' del objeto recibido
    const productos = req.body.productos;

    // cargo todo uno por uno con un forEach y lo meto a la base de datos:
    productos.forEach(producto => {
        console.log(producto); // Depuración para verificar cada producto
        // Insertar el producto en la base de datos
        connection.query('INSERT INTO productos SET ?', producto, (err, result) => {
            if (err) {
                console.error('Error al insertar producto:', err); // Mostrar el error específico
                res.status(500).send('Error al insertar producto');
                return;
            }
            console.log('Producto insertado con éxito:', result.insertId);
        });
    });
    // Envía una respuesta al cliente
    res.status(201).send('Productos guardados con éxito');
});

//Elimino el producto con el id que llega desde Frontend
app.delete('/eliminarProducto/:id', (req, res) => {
    const { id } = req.params;
    // Aca habria que hacer una logica de validacion para que no pueda borrar cualquiera If...
    // y luego seguir con la eliminacion del producto con el id que llega desde Frontend
    connection.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Producto no encontrado');
        } else {
            res.status(200).send('Producto eliminado con éxito');
        }
    });
});


// Paso 6: Inicio servidor de NodeJs en puerto 3000
const PORT = 3000; 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});