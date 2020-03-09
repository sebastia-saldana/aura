'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Person extends Model {
    static get table(){
        return 'persons'
    }
    getPoints () {
        return this.hasMany('App/Models/Point', 'id','person_id')
    }
}

module.exports = Person
