const { KNEXPORT, KNEXUSER } = require('../config');


const knex = require ('knex')({
    client: 'mysql',
    connection: {
        host:'127.0.0.1',
        port:KNEXPORT,
        user:KNEXUSER,
        password: '',
        database: 'ecommerce'

    }
});

module.exports={
    knex
}