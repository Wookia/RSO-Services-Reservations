const Sequelize = require('sequelize');

// let Promise = require('bluebird');

class Table {
    constructor(sequelize) {
        this.Table_db = sequelize.define('Table', {
            id_table: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            waiter: {
                type: Sequelize.TEXT
            },
            seats: {
                type: Sequelize.INTEGER
            },
            is_taken: {
                type: Sequelize.BOOLEAN
            }
        }, {
            timestamps: false, //create and update col
            freezeTableName: true,
        });
        this.Table_db.sync({force: true}).then(() => {
            return this.Table_db.bulkCreate([
                {waiter: 'John', seats: 6, is_taken: false},
                {waiter: 'Peter', seats: 3, is_taken: false},
                {waiter: 'Frank', seats: 2, is_taken: false},
                {waiter: 'Peter', seats: 8, is_taken: false},
                {waiter: 'Peter', seats: 2, is_taken: true},
                {waiter: 'Frank', seats: 4, is_taken: false},
                {waiter: 'John', seats: 5, is_taken: false}]);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.Table_db.findAll().then(data =>
                resolve(data))
        })
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            this.Table_db.findById(id).then(data =>
                resolve(data))
        })
    }

    getNotTaken() {
        return new Promise((resolve, reject) => {
            this.Table_db.findAll({where: {is_taken: false}}).then(data => {
                resolve(data);
            })
        })
    }

    takeTable(id) {
        return new Promise((resolve, reject) => {
            this.Table_db.update({is_taken: true}, {where: {id_table: parseInt(id)}}).then((result) => {
                resolve(result == 1)
            })
        })
    }

    freeTable(id) {
        return new Promise((resolve, reject) => {
            this.Table_db.update({is_taken: false}, {where: {id_table: parseInt(id)}}).then(result => {
                resolve(result == 1)
            })
        })
    }

    updateTable(req) {
        return new Promise((resolve, reject) => {
            this.Table_db.update({
                waiter: req.waiter,
                seats: req.seats,
                is_taken: req.is_taken
            }, {where: {id_table: req.id_table}}).then(result =>
                resolve(result == 1))
        })
    }

    addTable(req) {
        return new Promise((resolve, reject) => {
            this.Table_db.create(req).then((data) => {
                resolve(data.dataValues)
            })
        })
    }

    deleteTable(id) {
        return new Promise((resolve, reject) => {
            this.Table_db.destroy({where: {id_table: id}}).then(result =>
                resolve(result == 1)
            )
        })
    }
}

module.exports = Table;