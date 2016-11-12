'use strict';
import React from 'react';
import { browserHistory } from 'react-router';

import Navigation from './navigation';
import Sidebar from './sidebar';
import ContentUpper from './content-upper';
import ContentLower from './content-lower';

export default React.createClass ({
  componentDidMount() {
  },

  updateEventData(city, date) {
  },

  render() {
    return(
      <div>
        <Navigation ref='Navigation' loadData={this.updateEventData} />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

/*
    return(
      <div>
        <Navigation ref='Navigation' loadData={this.updateEventData} />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
              {this.props.children}
              <ContentUpper />
              <ContentLower />
            </div>
          </div>
        </div>
      </div>
    );
*/