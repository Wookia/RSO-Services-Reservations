const Sequelize = require('sequelize');
let Promise = require('bluebird');

class Reservation_db {

    constructor(sequelize, table_db) {
        this.table_db = table_db;
        this.seq = sequelize;
        this._Reservation = sequelize.define('Reservation', {
            id_reservation: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.TEXT
            },
            amount: {
                type: Sequelize.INTEGER
            },
            from_time: {
                type: Sequelize.DATE
            },
            to_time: {
                type: Sequelize.DATE
            },
            realized: {
                type: Sequelize.BOOLEAN
            }
        }, {
            timestamps: false, //create and update col
            freezeTableName: true,
        });
    }

    get Reservation() {
        return this._Reservation;
    }

    set Reservation(value) {
        this._Reservation = value;
    }

    createData() {
        this._Reservation.sync({force: false}).then(() => {
            return this._Reservation.bulkCreate([
                {
                    id_table: 1,
                    name: "PETER",
                    amount: 5,
                    from_time: new Date(Date.UTC(2018, 7, 7, 7)),
                    to_time: new Date(Date.UTC(2018, 7, 7, 8)),
                    realized: false
                },
                {
                    id_table: 1,
                    name: "JHON",
                    amount: 5,
                    from_time: new Date(Date.UTC(2018, 7, 7, 7)),
                    to_time: new Date(Date.UTC(2018, 7, 7, 8)),
                    realized: false
                },
                {
                    id_table: 3,
                    name: "ANN",
                    amount: 2,
                    from_time: new Date(Date.UTC(2018, 7, 7, 10)),
                    to_time: new Date(Date.UTC(2018, 7, 7, 12)),
                    realized: true
                },
                {
                    id_table: 6,
                    name: "PASHA",
                    amount: 4,
                    from_time: new Date(Date.UTC(2018, 8, 15, 15)),
                    to_time: new Date(Date.UTC(2018, 8, 15, 20)),
                    realized: false
                }
            ]);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this._Reservation.findAll().then(data =>
                resolve(data))
        })
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            this._Reservation.findById(id).then(data =>
                resolve(data))
        })
    }

    getUnrealized() {
        return new Promise((resolve, reject) => {
                this._Reservation.findAll({where: {realized: false}}).then(data => {
                    resolve(data);
                })
            }
        )
    }

    getRealized() {
        return new Promise((resolve, reject) => {
                this._Reservation.findAll({where: {realized: true}}).then(data => {
                    resolve(data);
                })
            }
        )
    }

    addReservation(req) {
        return new Promise((resolve, reject) => {
            this.seq.query('SELECT * FROM "public"."Reservation" ' +
                'WHERE id_table=' + req.id_table + " " +
                "AND (( from_time <=  '" + req.from_time + "' AND TO_TIME >= '" + req.from_time + "' ) " +
                "OR ( FROM_TIME <= '" + req.to_time + "' AND TO_TIME >= '" + req.to_time + "' ) " +
                "OR ( FROM_TIME >= '" + req.from_time + "' AND TO_TIME <= '" + req.to_time +"'))",
                {model: this.Reservation}).then((results) => {
                    if (results.toString().length === 0) {
                        this._Reservation.create(req).then(data => {
                            resolve(data.dataValues);
                        });
                    } else {
                        reject()
                    }
                }
            );

        })
    }

    realize(id) {
        return new Promise((resolve, reject) => {
                this._Reservation.update(
                    {realized: true},
                    {
                        where: {id_reservation: id},
                        returning: true,
                        plain: true
                    })
                    .then(result => {
                        let id_table = result[1].dataValues.id_table;
                        this.table_db.takeTable(id_table).then(finalResult => resolve(finalResult)
                        );
                    })
            }
        )
    }

    update(req) {
        return new Promise((resolve, reject) => {
                this._Reservation.update({
                    id_table: req.id_table,
                    name: req.name,
                    amount: req.amount,
                    from_time: req.from_time,
                    to_time: req.to_time,
                    realized: req.realized
                }, {where: {id_reservation: req.id_reservation}})
                    .then(result => {
                        resolve(result == 1);
                    })
            }
        )
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this._Reservation.destroy({where: {id_reservation: id}}).then(result =>
                resolve(result == 1)
            );
        })
    }
}

module.exports = Reservation_db;
