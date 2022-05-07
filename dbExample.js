const {knex} = require('./db/database')

knex.schema.dropTable('products')
  .then(() => console.log('tabla borrada') )
  .catch(err => console.log(err))

  knex.schema.createTable('products', (table) => {
      table.string('nombre')
    //   table.string('codigo')
      table.float('precio')
    //   table.integer('stock')
      table.increments('id')
      table.string('foto')
  } )
   .then(() => console.log('tabla creada') )
   .catch((error) => console.log(error) )


