'use strict'
const Person = use('App/Models/Person')
class PersonController {
    async persons({response}){
        let persons = await Person.all()
        return response.json(persons)
    }
}

module.exports = PersonController