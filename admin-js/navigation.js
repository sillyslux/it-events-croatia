'use strict';
import React from 'react';
import activeComponent from 'react-router-active-component'
import { Link, browserHistory } from 'react-router';

const NavLink = activeComponent('li', {activeClassName: 'disabled'})

export default React.createClass ({
  render() {
    return(
    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <Link className="navbar-brand" to="/">ITHR Admin Panel</Link>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="/">Preview</a></li>
          </ul>
          <form className="navbar-form navbar-right">
            <input type="text" className="form-control" placeholder="Search..." />
          </form>
        </div>
      </div>
    </nav>
    );
  }
});
