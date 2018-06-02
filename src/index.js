const express = require('express');
const pg = require("pg");
const bodyParser = require('body-parser');

db = require("./models/db_connector");
const Table_controller = require("./controllers/table");
const Reservation_controller = require("./controllers/reservation");
const Table_db = require("./models/table_db");
const Reservation_db = require('./models/reservation_db');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


db.then((dbDriver) => {
    let table_db = new Table_db(dbDriver);
    let reservation_db = new Reservation_db(dbDriver, table_db);
    table_db.Table.hasMany(reservation_db.Reservation, {as: 'Reservations', foreignKey: {name: 'id_table'}});
    table_db.createData().then(() => reservation_db.createData());
    let table_controller = new Table_controller(app, table_db);
    let reservation_controller = new Reservation_controller(app, reservation_db);

    app.listen(process.env.PORT || 3000, () => console.log('Microservice listening on port: ' + (process.env.PORT || 3000)));
});

