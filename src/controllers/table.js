class Table_controller {
    constructor(app, table_db) {
        this.app = app;
        this.db = table_db;
        this.addEndPoint()
    }

    addEndPoint() {
        this.app.get('/table/', (req, res) => {
                this.db.getAll().then(data => {
                    console.log('sent ' + data.length + ' rows from Table to ' + req.hostname);
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
        this.app.put('/table/:id/take/', (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.takeTable(id).then(data => {
                    console.log('take table id = ' + id);
                    res.json({result: data});
                })
            }
        });
        this.app.put('/table/:id/free/', (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.freeTable(id).then(result => {
                    res.json({result: result});
                })
            }
        });
        this.app.put('/table/:id', (req, res) => {
            this.db.updateTable(req.body).then(result => {
                res.json({result});
                if (result) console.log('Updated Table, id:' + req.params.id)
            })
        });
        this.app.post('/table/', (req, res) => {
            this.db.addTable(req.body).then(result => {
                res.json({result});
            });
        });
        this.app.delete('/table/:id/', (req, res) => {
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