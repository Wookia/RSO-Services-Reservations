class Table_controller {
    constructor(app, table_db, jwt) {
        this.app = app;
        this.db = table_db;
        this.jwt = jwt;
        this.addEndPoint()
    }

    mapData(data) {
        return data.map((element) => {
            return {
                id_table: element.id_table,
                seats: element.seats,
                is_taken: element.is_taken
            }
        })
    }

    addEndPoint() {

        this.app.get('/api/table/', (req, res) => {
                this.db.getAll().then(data => {
                    console.log('sent ' + data.length + ' rows from Table to ' + req.hostname);
                    if (req.headers.authorization) {
                        this.jwt(req, res, (result) => {
                            res.json(data);
                        });
                    }
                    else {
                        res.json(this.mapData(data));
                    }
                })
            }
        );
        this.app.get('/api/table/free', this.jwt, (req, res) => {
            this.db.getNotTaken().then(data => {
                    console.log('sent ' + data.length + ' free tables');
                    res.json(data);
                }
            )
        });
        this.app.get('/api/table/:id', this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.getById(id).then(data => {
                    console.log('sent info, table id = ' + id);
                    res.json(data)
                });
            }
        });
        this.app.put('/api/table/:id/take/', this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.takeTable(id).then(data => {
                    console.log('take table id = ' + id);
                    res.json({result: data});
                })
            }
        });
        this.app.put('/api/table/:id/free/', this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.freeTable(id).then(result => {
                    res.json({result: result});
                })
            }
        });
        this.app.put('/api/table/:id', this.jwt, (req, res) => {
            if (req.params.id != req.body.id_table)
                res.status(400).send("param's is not equal bodies id");
            else
                this.db.updateTable(req.body).then(result => {
                    res.json({result});
                    if (result) console.log('Updated Table, id:' + req.params.id)
                });
        });
        this.app.post('/api/table/', this.jwt, (req, res) => {
            this.db.addTable(req.body).then(result => {
                res.json({result});
            });
        });
        this.app.delete('/api/table/:id/', this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.deleteTable(id).then(result => {
                    res.json({result});
                    if (result) console.log('deleted table, id:' + id);
                })
            }
        });
    }

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

module.exports = Table_controller;