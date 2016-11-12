/* global window */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './app';

const dataChannel = require('event-emitter')();

Object.defineProperty(window.navigator, 'language', {
  get() {
    return 'de-DE';
  },
});

render(
  (
    <Router history={browserHistory}>
      <Route path="/(:city)(/:id)" component={App} dataChannel={dataChannel} />
    </Router>
  ), window.document.querySelector('.app-container')
);

window.document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.blog-more')) {
    // console.log("Anchor element clicked!");
    e.target.parentNode.nextSibling.classList.toggle('visible');
    const pn = e.target.parentNode;
    const scrollView = () => pn.nextSibling.scrollIntoViewIfNeeded();
    setTimeout(scrollView, 1e3);
  }
});
