async function connectar() {
    if(global.connection && global.connection.state !== 'disconnected') {
        return global.connection;
    }
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql:root:root@localhost:3306/rodoviaria");
    console.log("Base de dados conectada");
    global.connection = connection;
    return connection;
}

module.exports = {
    connectar
}