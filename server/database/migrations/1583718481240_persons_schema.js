'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonsSchema extends Schema {
  up () {
    this.create('persons', (table) => {
      table.increments('id')
      table.string('name')
      table.string('age')
      table.string('location')
      table.enu('gender', ['M','F'])
      table.timestamps()
    })
  }

  down () {
    this.drop('persons')
  }
}

module.exports = PersonsSchema
