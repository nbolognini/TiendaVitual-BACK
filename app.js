
const express = require('express'); // Paso 1: Importar Express
const app = express(); // Crear instancia de la aplicación


// Importamos el módulo mysql para poder interactuar con bases de datos MySQL
const mysql = require('mysql');

//habilitamos los cors
const cors = require('cors');
app.use(cors());



// Creamos una conexión a la base de datos especificando los detalles de nuestra base de datos
const connection = mysql.createConnection({
    host: '192.168.0.38',     // Dirección del servidor de la base de datos
    user: 'usuarioFull',          // Nombre de usuario para acceder a la base de datos
    password: 'abcd1234',     // Contraseña del usuario
    database: 'tiendavirtual' // Nombre de la base de datos a la que queremos conectarnos
});

// puedo conssultar si se pudo conectar a la base de datos
connection.connect((err) => {
    if (err) { // Si hay un error al conectar, lo mostramos en consola
        console.log('Error connecting to database');
        return; // Salimos de la función para evitar más ejecución
    }
    // Si la conexión es exitosa, mostramos un mensaje en consola
    console.log('Connection exitosa!');
});


// Paso 3: Crear endpoint GET `/productos`
app.get('/productos', (req, res) => {
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



// Paso 6: Iniciar servidor
const PORT = 3000; // Definir puerto
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});