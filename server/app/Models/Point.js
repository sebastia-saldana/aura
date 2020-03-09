'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Point extends Model {
    pointsPerson() {
        return this.belongsTo('App/Models/Person','id','person_id')
    }
}

module.exports = Point
