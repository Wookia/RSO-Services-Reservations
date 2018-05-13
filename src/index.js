const express = require('express');
const pg = require("pg");
db = require("./models/db_connector");
const Table_controller = require("./controllers/table")


const app = express();

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/reservations', (req, res) => {
    console.log("Reservations");

    res.json({
        responseFrom: "reservations222"
    });
});


db.then((dbDriver) => {
    let table = new Table_controller(app, dbDriver);
    app.listen(process.env.PORT || 3000, () => console.log('Microservice listening on port: ' + (process.env.PORT || 3000)));
});

