
const express = require('express'); // 1) Importo Express
const app = express(); //              2) Creo instancia de Express

const mysql = require('mysql'); // 3) Importo módulo mysql para poder interactuar con bases de datos MySQL

const cors = require('cors'); // 4)habilitamos los cors para no hay problemas de comunicacion entre el front y el back
app.use(cors());

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
    // Si la conexión es exitosa, mostramos un mensaje en consola
    console.log('Connection exitosa!');
});


app.get('/productos', (req, res) => { // 6) Crear endpoint GET `/productos`
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


// Paso 6: Iniciar servidor en puerto 3000
const PORT = 3000; // Definir puerto
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});