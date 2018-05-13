const Sequelize = require('sequelize');
let Promise = require('bluebird');

const Reservation = sequelize.define('Reservation', {

    id_reservation: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    id_table: {
        type: Sequelize.BIGINT,
        references: 'Table',
        referencesKey: 'id_table' //https://stackoverflow.com/questions/14169655/sequelize-js-foreign-key
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
    }

});


// force: true will drop the table if it already exists
Reservation.sync({force: false}).then(() => {
    // Table created
    // return Reservation.create({
    //     waiter: 'John',
    //     seats: 6,
    //     is_taken: false
    // });
});