// modules/About.js
import React from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'

const NavLink = activeComponent('li', {activeClassName: 'diabled'})

const data = fetch("../data/09-2016.json")
  .then( res => res.json() )
  .then( data => {
    // console.log(data.cities);
    let set = new Set(data.cities)
    return set
  })

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state={cities:[]}
    // console.log(this)
    data.then(cities=>{
      console.log(this)
      this.setState({cities:cities})
    })
  }

  setState(partialState, callback) {
    console.log('partialState',partialState)
    super.setState(partialState, callback)
  }

  citySelect(e) {
    // debugger
    this.refs.cityDropdown.childNodes[1].textContent= e.target.innerHTML
    console.log(e.target,e.nativeEvent)
  }

  render() {
    // console.log('cities',this,data)
    // return data.then( cities => {
    //   console.log(cities.has(this.props.routeParams.city));
    //   return cities.has(this.props.routeParams.city) ?
    //     <div>city {this.props.routeParams.city}</div>
    //     :
    //     <div>city not found</div>
    //
    // })
    // debugger
    return (
      <div className="container">
        <div className="row">
          <div className="dropdown pull-left">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" ref="cityDropdown">
              select County
              <span className="caret"></span>
            </button>
            <ul role="nav" className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <NavLink to="/all" activeClassName="disabled">Croatia</NavLink>
              <li><a href="major">Croatia (major events)</a></li>
          {Array.from(this.state.cities).map((city,i)=> <NavLink key={city} to={city} activeClassName="disabled" onClick={this.citySelect.bind(this)} activeStyle={{ color: 'red' }}>{city}</NavLink>)}
              <li role="separator" className="divider"></li>
            </ul>
          </div>
          <div className="dropdown pull-right">
            <p type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              upcoming
              <span className="caret"></span>
            </p>
            <ul role="nav" className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <li><Link to="/" activeClassName='disabled'>upcoming</Link></li>
              <li><Link to="major" activeClassName='disabled'>lapsed</Link></li>
            </ul>
          </div>
        </div>
        <div className="row">

          {/* add this */}
          {this.props.children}
        </div>
      </div>
    )
    // return (<div>
      // {this.state.city?this.state.city:'empty'}
    // </div>)
  }
}
