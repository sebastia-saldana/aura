'use strict'
const Person = use('App/Models/Person')
const Database = use('Database')
class PointController {
    async points({params,response}){
        let points = await Database.table('points').where('person_id', params.id)
        return response.json(points)
    }

    async create({request, response}){
        const person = await Person.find(request.body.person_id)
        if (!person) {
            return response.json('No existe esta persona')
        }
        const point = await person.getPoints().create(request.all())
        return response.json(point)
    }
}

module.exports = PointController
