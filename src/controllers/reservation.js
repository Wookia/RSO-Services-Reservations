class Reservation_controller {
    constructor(app, reservation_db, jwt) {
        this.jwt = jwt;
        this.app = app;
        this.db = reservation_db;
        this.endpoint = "/api/reservation/";

        this.addEndPoint()
    }

    addEndPoint() {
        this.app.get(this.endpoint, this.jwt, (req, res) => {
            this.db.getAll().then(data => {
                console.log('sent ' + data.length + ' rows from reservation to ' + req.hostname);
                res.json(data);
            });
        });
        this.app.get(this.endpoint + 'unrealized', this.jwt, (req, res) => {
            this.db.getUnrealized().then(data => {
                console.log('sent ' + data.length + ' unrealized reservation to ' + req.hostname);
                res.json(data);
            });
        });
        this.app.get(this.endpoint + 'realized', this.jwt, (req, res) => {
            this.db.getRealized().then(data => {
                console.log('sent ' + data.length + ' realized reservation to ' + req.hostname);
                res.json(data);
            });
        });
        this.app.get(this.endpoint + ":id", this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.getById(id).then(data => {
                    console.log('sent info, table id = ' + id);
                    res.json(data)
                });
            }
        });
        this.app.post(this.endpoint, this.jwt, (req, res) => {
            this.db.addReservation(req.body).then(result => {
                res.json({result});
            })
        });
        this.app.put(this.endpoint + ":id/realize", this.jwt, (req, res) => { //znaleźć sposob na zmiane w TABLE.is_taken
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.realize(id).then(result => {
                    res.json({result});
                    console.log("Reservation nr " + id + " realized");
                })
            }
        });
        this.app.put(this.endpoint + ":id/", this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id) && req.body.id_reservation === id) {
                this.db.update(req.body).then(result => {
                    res.json({result});
                    console.log("Reservation nr " + id + " updated");
                })
            } else {
                res.send(':id is not equal id_reservation in body', 400);
            }
        });
        this.app.delete(this.endpoint + ":id", this.jwt, (req, res) => {
            let id = req.params.id;
            if (this.isNumber(id)) {
                this.db.delete(id).then(result => {
                    res.json({result});
                    console.log('Reservation nr ' + id + ' deleted');
                })
            } else {
                res.send(':id is not number', 400);
            }
        });
    }

    isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

module.exports = Reservation_controller;