const Sequelize = require('sequelize');
let Promise = require('bluebird');

class Reservation_db {

    constructor(sequelize) {
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
        this._Reservation.sync({force: true}).then(() => {
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
            this._Reservation.create(req).then(data =>
                resolve(data.dataValues))
        })
    }

    realize(id) {
        return new Promise((resolve, reject) => {
                this._Reservation.update(
                    {realize: true},
                    {where: {id_reservation: parseInt(id)}})
                    .then(result => {
                        resolve(result);
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
                    realize: req.realize
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
