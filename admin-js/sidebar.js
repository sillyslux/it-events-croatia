'use strict';
import React from 'react';
import { Link, browserHistory } from 'react-router';
import activeComponent from 'react-router-active-component'

const NavLink = activeComponent('li', {activeClassName: 'active'})

export default React.createClass ({
  componentWillMount() {

  },
  render() {
    return (
      <div className="col-sm-3 col-md-2 sidebar navbar-default">
        <ul className="nav nav-sidebar">
          <NavLink to="browse">Data Browser</NavLink>
          <NavLink to="meetup">search Meetup.com</NavLink>
          <NavLink to="createEntry">create Entry</NavLink>
        </ul>
      </div>
    );
  }
});
