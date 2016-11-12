/* global window */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import App from './app';
import BrowseData from './browse-data';
import BrowseCityData from './browse-show-city';
import Meetup from './meetup';
import NewEntry from './new-entry';

const browserHistory = useRouterHistory(createHistory)({
  basename: '/admin',
});

render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="browse(/:city)" component={BrowseData}>
          <Route path=":date" component={BrowseCityData} />
        </Route>
        <Route path="meetup" component={Meetup} />
        <Route path="createEntry" component={NewEntry} />
      </Route>
    </Router>
  ), window.document.querySelector('.app-container')
);
