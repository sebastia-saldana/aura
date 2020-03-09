'use strict'

/*
|--------------------------------------------------------------------------
| PointsAndPersonSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class PointsAndPersonSeeder {
  async run () {
    const persons = await Factory.model('App/Models/Person').createMany(50)
    
    for(let person of persons){
      if (parseInt(person.id) % 2 == 0) {
        person.gender = 'M'
      }else{
        person.gender = 'F'
      }
      await person.save()

      let point =  await Factory.model('App/Models/Point').create()
      point.starts = Math.floor((Math.random()*5) + 1).toString()
      await point.save()
      await person.getPoints().save(point)
    }
  }
}

module.exports = PointsAndPersonSeeder
