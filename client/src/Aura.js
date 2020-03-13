import React, {Component} from 'react'
import {listPersons, listStarts, registerScore} from './Functions'
import * as ReactBootStrap from 'react-bootstrap'
import { Container, Row, Col } from 'react-bootstrap';

class Aura extends Component{
    constructor(){
        super()
        this.state = {
          showPoints: false,
          show: false,
          id: '',
          parcialprom: 0,
          filter: '',
          filterName: '',
          rate: '',
          starts: [],
          personStarts: [],
          persons: [],
          bestPerson: [],
          promLocal: ''
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
        filterName: filter,
        filter:'',
        persons: personsFilter
      }, ()=>{
        this.getTopFilter(this.state.persons)
      })
    }

    getTopFilter = async (persons) =>{
      let proms = 0
      let mayor = []
      for(let person of persons){
        await this.getStartsProm(person.id)
        proms += this.state.parcialprom
        mayor.push(person.average)
      }
      let i = mayor.indexOf(Math.max(...mayor))
      this.setState({
        bestPerson: this.state.persons[i],
        promLocal: (this.round10((proms / persons.length), -2))
      })
    }

    getPersons = () =>{
      listPersons().then(data =>{
          this.setState(
              {
                filterName: '',
                promLocal: '',
                bestPerson: [],
                persons: [...data]
              }
          )
          this.getPointsPersons(this.state.persons)
      })
    }

    round10 = function(value, exp) {
      return this.decimalAdjust('round', value, exp);
    };

    decimalAdjust(type, value, exp) {
      // Si el exp no está definido o es cero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // Si el valor no es un número o el exp no es un entero...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    getPointsPersons = async (persons) =>{
      let newPersons = []
      for (let person of persons){
        await this.getStarts(person.id)
        let sum = 0
        Object.values(this.state.starts).forEach(point => {
          sum += parseInt(point.starts)
        });
        let average = this.round10((sum / this.state.starts.length), -1)
        newPersons.push(Object.assign({average: average}, person))
      }
      this.setState({
        persons: newPersons
      })
    }

    getStartsProm = async (id) =>{
      let total = 0
      await listStarts(id).then(data => {
        for(let point of data){
          total += parseInt(point.starts)
        }
        this.setState({
          parcialprom: (total / data.length)
        })
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

    getStartsPerson = async (id) =>{
      await listStarts(id).then(data => {
        this.setState(
          {
            personStarts: [...data]
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
          <td className="text-nowrap">
            <ReactBootStrap.Button className="mr-3" onClick = { () =>{
              this.setState({
                show: true,
                rate: '1',
                id: person.id
              })
            }}>Rate</ReactBootStrap.Button>
            <ReactBootStrap.Button  onClick = { async () =>{
              await this.getStartsPerson(person.id)
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
          <Container>
            <Row>
              <Col xs={8}>
                <ReactBootStrap.Form>
                  <ReactBootStrap.Form.Group controlId="filter">
                    <ReactBootStrap.Form.Label>Filtro: </ReactBootStrap.Form.Label>
                    <ReactBootStrap.Form.Control as="textarea" rows="1" value={this.state.filter} onChange={this.handleChangeFilter}/>
                  </ReactBootStrap.Form.Group>
                  <ReactBootStrap.Form.Group>
                      <ReactBootStrap.Button className="mr-2 px-md-5" onClick={this.handleSubmit}>Filtrar</ReactBootStrap.Button>
                      <ReactBootStrap.Button className="px-md-5" onClick={this.getPersons}>Recargar</ReactBootStrap.Button>
                  </ReactBootStrap.Form.Group>
                </ReactBootStrap.Form>
              </Col>
              <Col className="text-center" xs={4} >
                <h5>TOP MODEL</h5>
                  <p>
                    {this.state.bestPerson.id} | {this.state.bestPerson.name}
                  </p>
                <h5>Local average</h5>
                    {this.state.filterName} | {this.state.promLocal}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <ReactBootStrap.Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Location</th>
                        <th>Average</th>
                        <th className="text-nowrap">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.persons.map(this.renderPersons)}
                    </tbody>
                  </ReactBootStrap.Table>
              </Col>
            </Row>

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
                    {this.state.personStarts.map(this.renderPoints)}
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
          
          </Container>
        </div>
      )
    }
}

export default Aura