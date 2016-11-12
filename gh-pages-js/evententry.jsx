/* global window */

import React from 'react';
import { Link } from 'react-router';
import { Panel, Label } from 'react-bootstrap';

const EventEntry = (props) => {
  const ev = props.data;
  let dateBegin = new Date(ev.begin).toLocaleString(window.navigator.language);
  dateBegin = dateBegin.substring(0, dateBegin.length - 3);
  let dateEnd = new Date(ev.end).toLocaleString(window.navigator.language);
  dateEnd = dateEnd.substring(0, dateEnd.length - 3);
  let dateEndTime = new Date(ev.end).toLocaleString(window.navigator.language);
  dateEndTime = dateEndTime.substring(0, dateEndTime.length - 3);
  let dateEndString = '';
  if (ev.end) {
    if ((ev.begin - ev.end) / 5184000 > 1) dateEndString = ` – ${dateEnd}`;
    else dateEndString = ` – ${dateEndTime}`;
  }
  return (
    <Panel>
      <sup style={{ fontWeight: 'bold' }}>{dateBegin}{dateEndString}</sup>
      {ev.meta && (<h4 className="pull-right"><Label bsStyle="primary">{ev.meta}</Label></h4>)}
      <h3 className="text-primary">{ev.title}</h3>
      {props.city === ev.city ? '' : <Link style={{ float: 'right', fontWeight: 'bold' }} to={`/${ev.city}`}><Label bsStyle="primary">{ev.city}</Label></Link>}
      <p><small>
        <Link style={{ fontWeight: 'bold' }} to={`/${ev.city}/${ev.begin}`}>permalink</Link>
        <a href={ev.link} style={{ fontWeight: 'bold', margin: '0 20px' }} >official announcement</a>
        {ev.duration && `duration: ${ev.duration}`}<br />
        {ev.address} {ev.map && (
          <a href={ev.map}>
            <span className="glyphicon glyphicon-map-marker" aria-hidden="true" />
          </a>
        )}
      </small></p>
      <div className="description">{ev.teaser ? ev.teaser : ev.description}</div>
    </Panel>
  );
};

EventEntry.propTypes = {
  data: React.PropTypes.shape({}),
  city: React.PropTypes.string.isRequired,
};

export default EventEntry;
