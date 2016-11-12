/* global window */
/* eslint max-len: ["error", { "code": 130, "ignoreComments": true }] */

import React from 'react';
import { browserHistory } from 'react-router';
import { Grid, Row } from 'react-bootstrap';
import moment from 'moment';
import { join } from 'path';
import Navigation from './navigation';
import EventList from './eventlist';
import Sidebar from './sidebar';
import About from './about';

let currentCity;
let currentMonth = moment().format('YYYY-MM');
const thisMonth = currentMonth;

const createRequestPath = ({ city, id }) => {
  const requestPath = '/data/';
  // console.log('createRequestPath', 'before', city, id, currentCity, currentMonth);
  if (city !== currentCity && !/^\d{13}$/.test(id)) {
    // console.log('createRequestPath', 'match 1', city, id, currentCity, currentMonth);
    currentMonth = '';
    currentCity = city;
    return join(requestPath, city, `${id || thisMonth}.json`);
  } else if (/^\d{4}-\d{2}$/.test(id) && id !== currentMonth) {
    // console.log('createRequestPath', 'match 2', city, id, currentCity, currentMonth);
    currentMonth = id;
    return join(requestPath, city, `${id}.json`);
  } else if (/^\d{13}$/.test(id) && (new Date(Number(id)).toISOString().substr(0, 7)) !== currentMonth) {
    // console.log('createRequestPath', 'match 3', city, id, currentCity, currentMonth);
    currentMonth = new Date(Number(id)).toISOString().substr(0, 7);
    return join(requestPath, city, (new Date(Number(id)).toISOString().substr(0, 7)), '.json');
  }
  // console.log('createRequestPath', 'match 4', city, id, currentCity, currentMonth);
  // console.log('request not neccessary');
  return false;
};

export default class App extends React.Component {
  componentDidMount() {
    const redirectedPath = window.sessionStorage.redirect;
    const storedCity = window.localStorage.getItem('selectedCity');
    delete window.sessionStorage.redirect;

    // meh, race condition ahead when loading main.json AND city/month.json on startup

    if (redirectedPath && redirectedPath !== window.location.href) {
      // console.debug('Navigated to', location.href, '\t\t-> index.html, redirected from 404.html, change', location.href, 'to', redirectedPath)
      browserHistory.push(redirectedPath.replace(' ', '_'));
    } else if (storedCity) {
      // console.debug('Navigated to', location.href, '\t\t-> index.html, switch to stored city', storedCity);
      browserHistory.push(storedCity.replace(' ', '_'));
    } else {
      // console.debug('Navigated to', location.href, '\t\t-> first start? selecting "major Events"')
      browserHistory.push('major Events'.replace(' ', '_'));
    }
    window.fetch('/data/main.json').then(res => res.json()).then(data => this.props.route.dataChannel.emit('main', data));
  }

  componentWillReceiveProps(newprops) {
    // console.log('app props have changed', newprops)
    const requestPath = createRequestPath(newprops.routeParams);
    window.document.querySelector('#atom-feed').href = `/${newprops.routeParams.city}/atom.xml`;
    // console.log(requestPath);
    if (requestPath) {
      window.fetch(requestPath)
      .then(res => res.json())
      .then(data => this.props.route.dataChannel.emit('data', data));
    }
//     /^\d{13}$/.test((1464850800000).toString()) // test length is 13 digits
//     /^\d{4}-\d{2}$/.test('2016-10') // test matches '2016-10'
  }

  render() {
    return (
      <div>
        <Navigation dataChannel={this.props.route.dataChannel} routeParams={this.props.routeParams} />
        <Grid fluid>
          <Row className="show-grid">
            <EventList dataChannel={this.props.route.dataChannel} routeParams={this.props.routeParams} />
            <Sidebar dataChannel={this.props.route.dataChannel} routeParams={this.props.routeParams} />
            <About dataChannel={this.props.route.dataChannel} routeParams={this.props.routeParams} />
          </Row>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  route: React.PropTypes.shape({
    dataChannel: React.PropTypes.shape({
      emit: React.PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  routeParams: React.PropTypes.shape({
  }).isRequired,
};
