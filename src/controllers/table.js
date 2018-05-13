const Table_db = require("../models/table_db")

class Table_controller {
    constructor(app, db_connector) {
        this.app = app;
        this.db = new Table_db(db_connector);
        console.log('helo from table controller')
        this.addEndPoint()
    }

    addEndPoint() {
        this.app.get('/table/get_all', (req, res) => {
                this.db.getAll().then(data => {
                    console.log('sent ' + data.length + ' rows from Table to ' + req.host);
                    res.json(data);
                })
            }
        );
        this.app.get('/table/free', (req, res) => {
            this.db.getNotTaken().then(data => {
                    console.log('sent ' + data.length + ' free tables');
                    res.json(data);
                }
            )
        });
        this.app.get('/table/:id', (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.getById(id).then(data => {
                    console.log('sent info, table id = ' + id);
                    res.json(data)
                });
            }
        });
        this.app.put('/table/take/:id', (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.takeTable(id).then(data => {
                    console.log('take table id = ' + id);
                    res.json({result: data});
                })
            }
        });
        this.app.put('/table/free/:id', (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.freeTable(id).then(result => {
                    res.json({result: result});
                })
            }
        });
        this.app.put('/table/update', (req, res) => {
            console.log(JSON.stringify(req.body));
            res.json({result: false});
        })
    }

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

module.exports = Table_controller;