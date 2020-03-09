import axios from 'axios'

export const listPersons = async () =>{
    try {
        const response = await axios
            .get('api/persons', {
                headers: { 'Content-Type': 'application/json' }
            })
        var persons = []
        Object.keys(response.data).forEach((key) => {
            persons.push(response.data[key])
        })
        return persons
    }
    catch (error) {
        return error
    }
}

export const listStarts = async (id) =>{
    try {
        const response = await axios
            .get(`api/points/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            })
        var starts = []
        Object.keys(response.data).forEach((key) => {
            starts.push(response.data[key])
        })
        return starts
    }
    catch (error) {
        return error
    }
}

export const registerScore = async (newStarts, id) =>{
    try {
        console.log(id.toString())
        const response = await axios
            .post('api/points/create', {
                starts: newStarts,
                person_id: id
            }, {
                headers: { 'Content-Type': 'application/json' }
            })
        return response
    }
    catch (error) {
        return error
    }
}

