'use strict';
import React from 'react';
import { Link, browserHistory } from 'react-router';
import activeComponent from 'react-router-active-component'

const NavLink = activeComponent('button', {activeClassName: 'active'})

export default React.createClass ({
  getInitialState() {
    return {data: []}
  },
  componentWillReceiveProps(newprops){
    fetch('/data/'+newprops.params.city+'/'+newprops.params.date+'.json').then(res=>res.json()).then(res=>this.setState({data: res.eventData}))
  },
  componentDidMount() {
    fetch('/data/'+this.props.params.city+'/'+this.props.params.date+'.json').then(res=>res.json()).then(res=>this.setState({data: res.eventData}))
  },
  render() {
    return (
      <div className="content-lower">
        {this.props.params.city}
        {this.props.params.date}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date Start</th>
                <th>City</th>
                <th>Link</th>
                <th>Teaser</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(event => [(
                <tr>
                  <td colSpan="4">{event.title}</td>
                </tr>),(
                <tr>
                  <td>{new Date(event.begin).toDateString()}</td>
                  <td>{event.city}</td>
                  <td>{event.link}</td>
                  <td>{event.teaser}</td>
                </tr>
              )])}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});