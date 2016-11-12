// modules/About.js
// console.log(__dirname);
import React from 'react'

const data = fetch("../data/09-2016.json")
  .then( res => res.json() )
  .then( data => {
    // console.log(data.cities);
    let set = new Set(data.cities)
    return set
  })

export default class Cities extends React.Component {
  constructor(props) {
    super(props);
    // debugger
    this.state={city:null}
    // console.log(this)
    data.then(cities=>{
      // debugger
      if(cities.has(this.props.routeParams.city))this.setState({city:this.props.routeParams.city})
      else this.setState({city:'not found'})
    })
  }

  setState(partialState, callback) {
    super.setState(partialState, callback)
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
    console.log('render content view')
    return (<div className="row content">
      city: {this.state.city?this.props.routeParams.city:'empty'}
    </div>)
  }
}
