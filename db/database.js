const knex = require ('knex')({
    client: 'mysql',
    connection: {
        host:'127.0.0.1',
        port:33065,
        user:'root',
        password: '',
        database: 'ecommerce'

    }
});

module.exports={
    knex
}