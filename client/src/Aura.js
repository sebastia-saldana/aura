import React, {Component} from 'react'
import {listPersons, listStarts, registerScore} from './Functions'
import * as ReactBootStrap from 'react-bootstrap'

class Aura extends Component{
    constructor(){
        super()
        this.state = {
            showPoints: false,
            show: false,
            id: '',
            filter: '',
            rate: '',
            starts: [],
            persons: [],
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeRate = this.handleChangeRate.bind(this)
        this.handleChangeFilter = this.handleChangeFilter.bind(this)
    }

    componentDidMount(){
        this.getPersons()
    }

    handleChangeRate = (event) =>{
      this.setState({
        rate: event.target.value,
      })
    }

    handleChangeFilter = (event) =>{
      this.setState({
        filter: event.target.value
      })
    }

    handleSubmit = (event) =>{
      event.preventDefault()
      this.filterPersons(this.state.persons, this.state.filter)
    }

    filterPersons = (persons, filter) =>{
      let personsFilter = []
      Object.values(persons).forEach(person =>{
        if (person.location === filter) {
          personsFilter.push(person)
        }
      })
      this.setState({
        filter:'',
        persons: personsFilter
      })
    }

    getPersons = () =>{
      listPersons().then(data =>{
          this.setState(
              {
                persons: [...data]
              }
          )
          this.getPointsPersons(this.state.persons)
      })
    }

    getPointsPersons = async (persons) =>{
      let newPersons = []
      for (let person of persons){
        await this.getStarts(person.id)
        let sum = 0;
        Object.values(this.state.starts).forEach(point => {
          sum += parseInt(point.starts)
        });
        let average = Math.round((sum / this.state.starts.length))
        newPersons.push(Object.assign({average: average}, person))
      }
      this.setState({
        persons: newPersons
      })
    }

    getStarts = async (id) =>{
      await listStarts(id).then(data => {
        this.setState(
          {
            starts: [...data]
          }
        )
      })
    }

    

    ratePerson = (id, rate) =>{
      registerScore(rate, id).then(response =>{
        console.log(response);
      })
    }

    renderPersons = (person, index) =>{
      return (
        <tr key = {index}>
          <td>{person.id}</td>
          <td>{person.name}</td>
          <td>{person.age}</td>
          <td>{person.location}</td>
          <td>{person.average}</td>
          <td>
            <ReactBootStrap.Button  className="mr-2" onClick = { () =>{
              this.setState({
                show: true,
                id: person.id
              })
            }}>Rate</ReactBootStrap.Button>
            <ReactBootStrap.Button  onClick = { async () =>{
              await this.getStarts(person.id)
              this.setState({
                id: person.id,
                showPoints: true
              })
            }}>Historial</ReactBootStrap.Button>
          </td>
        </tr>
      )
    }

    renderPoints = (point, index) =>{
      return (
        <tr key = {index}>
          <td>{point.id}</td>
          <td>{point.starts}</td>
          <td>{point.person_id}</td>
          <td>{point.created_at}</td>
        </tr>
      )
    }
    
    render(){
      return(
          <div className="App">
            <ReactBootStrap.Form>
              <ReactBootStrap.Form.Group controlId="filter">
                <ReactBootStrap.Form.Label>Filtro: </ReactBootStrap.Form.Label>
                <ReactBootStrap.Form.Control as="textarea" rows="1" value={this.state.filter} onChange={this.handleChangeFilter}/>
              </ReactBootStrap.Form.Group>
              <ReactBootStrap.Form.Group>
                  <ReactBootStrap.Button className="mr-3 px-md-5" onClick={this.handleSubmit}>Filtrar</ReactBootStrap.Button>
                  <ReactBootStrap.Button className="px-md-5" onClick={this.getPersons}>Recargar</ReactBootStrap.Button>
              </ReactBootStrap.Form.Group>
            </ReactBootStrap.Form>
            
            <ReactBootStrap.Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Location</th>
                  <th>Average</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {this.state.persons.map(this.renderPersons)}
              </tbody>
            </ReactBootStrap.Table>

              <ReactBootStrap.Modal show={this.state.show}>
                <ReactBootStrap.Modal.Header closeButton>
                  <ReactBootStrap.Modal.Title>Estrellas</ReactBootStrap.Modal.Title>
                </ReactBootStrap.Modal.Header>

                <ReactBootStrap.Modal.Body>
                  <ReactBootStrap.Form>
                    <ReactBootStrap.Form.Group controlId="selectStarts">
                      <ReactBootStrap.Form.Label>Selecciona el número de estrellas</ReactBootStrap.Form.Label>
                      <ReactBootStrap.Form.Control as="select" value={this.state.rate} onChange={this.handleChangeRate}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </ReactBootStrap.Form.Control>
                    </ReactBootStrap.Form.Group>
                  </ReactBootStrap.Form>
                </ReactBootStrap.Modal.Body>

                <ReactBootStrap.Modal.Footer>
                  <ReactBootStrap.Button variant="secondary" onClick={()=>{
                    this.setState({
                      id: '',
                      show:false
                    })
                  }}>Close</ReactBootStrap.Button>
                  <ReactBootStrap.Button variant="primary" onClick={()=>{
                    this.ratePerson(this.state.id, this.state.rate)
                    this.setState({
                      id: '',
                      show: false
                    }, () =>{
                      this.getPersons()
                    })
                  }}>Rate</ReactBootStrap.Button>
                </ReactBootStrap.Modal.Footer>
              </ReactBootStrap.Modal>

              <ReactBootStrap.Modal show={this.state.showPoints}>
                <ReactBootStrap.Modal.Header closeButton>
                  <ReactBootStrap.Modal.Title>Registro de estrellas</ReactBootStrap.Modal.Title>
                </ReactBootStrap.Modal.Header>

                <ReactBootStrap.Modal.Body>
                  <ReactBootStrap.Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Stars</th>
                        <th>Person Id</th>
                        <th>Created time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.starts.map(this.renderPoints)}
                    </tbody>
                  </ReactBootStrap.Table>
                </ReactBootStrap.Modal.Body>

                <ReactBootStrap.Modal.Footer>
                  <ReactBootStrap.Button variant="secondary" onClick={()=>{
                    this.setState({
                      id: '',
                      showPoints:false
                    })
                  }}>Close</ReactBootStrap.Button>
                </ReactBootStrap.Modal.Footer>
              </ReactBootStrap.Modal>
          </div>
      )
    }
}

export default Aura