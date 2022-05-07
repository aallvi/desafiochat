const {knex} = require('./db/dbsqlite')

// knex.schema.dropTable('mensajes')
//   .then(() => console.log('tabla borrada') )
//   .catch(err => console.log(err))


  knex.schema.createTable('messages', (table) => {
      table.string('mensaje')


  } )
   .then(() => console.log('tabla creada') )
   .catch((error) => console.log(error) )