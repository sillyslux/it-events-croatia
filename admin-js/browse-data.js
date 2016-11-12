'use strict';
import React from 'react';
import { Link, browserHistory } from 'react-router';
import activeComponent from 'react-router-active-component'

const NavLink = activeComponent('button', {activeClassName: 'active'})

export default React.createClass ({
  getInitialState() {
    return {
      availableCities: {}
    }
  },
  componentDidMount() {
    fetch('/data/main.json').then(res=>res.json()).then(res=>this.setState(res))
  },
  render() {
    return (
      <div className="content-upper">
        {Object.keys(this.state.availableCities).sort().map(city =>
          <Link role="button" activeClassName='active' className="btn btn-default" key={city+'nl'} to={'/browse/'+city}>
            {city}
          </Link>
        )}
        <br />
        {this.props.routeParams.city&&this.state.availableCities[this.props.routeParams.city]?(
          this.state.availableCities[this.props.routeParams.city].map( (archive,i) =>
            <Link activeClassName='active' to={'/browse/'+this.props.routeParams.city+'/'+archive.replace(/\.json$/, '')} role="button" className="btn btn-default" key={i}>{archive.replace(/\.json$/, '')}</Link>
          )
        ):null}
        {this.props.children}
      </div>
    );
  }
});
/*
      <div className="content-upper">
        <ul className="city-browser">
          {
            Object.keys(this.state.availableCities)
            .map( city => 
              <li key={city}>{city}
                <ul>
                  {this.state.availableCities[city].map((archive,i)=><li key={city+i}>{archive}</li>)}
                </ul>
              </li>
            )
          }
        </ul>
      </div>
*/
/*
<div class="col-lg-6">
  <div class="input-group">
    <input type="text" class="form-control" aria-label="...">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Action <span class="caret"></span></button>
      <ul class="dropdown-menu dropdown-menu-right" role="menu">
        <li><a href="#">Action</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li class="divider"></li>
        <li><a href="#">Separated link</a></li>
      </ul>
    </div><!-- /btn-group -->
  </div><!-- /input-group -->
</div>
*/