'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PointsSchema extends Schema {
  up () {
    this.create('points', (table) => {
      table.increments('id')
      table.enu('starts', ['1','2','3','4','5'])
      table.integer('person_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('points')
  }
}

module.exports = PointsSchema
