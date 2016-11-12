/* global window */

import React from 'react';
import { Col, Well } from 'react-bootstrap';

import EventEntry from './evententry';

export default class EventList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventData: [],
      majorEvents: [],
    };
  }

  componentDidMount() {
    this.props.dataChannel.on('main', data =>
      data.majorEvents && this.setState({ majorEvents: data.majorEvents })
    );
    this.props.dataChannel.on('data', data =>
      this.setState({ eventData: data })
    );
  }

  render() {
    const mergeMajorEvents = JSON.parse(window.localStorage.getItem('mergeMajorEvents'));
    let events = mergeMajorEvents
      ? Array.prototype.concat(this.state.eventData, this.state.majorEvents)
      : this.state.eventData;
    events.sort((a, b) => a.begin > b.begin);
    if (this.props.routeParams.city && /^\d{13}$/.test(this.props.routeParams.id)) {
      events = events.filter(ev => ev.begin === Number(this.props.routeParams.id));
    } else if (!this.props.routeParams.id) {
      events = events.filter(ev => ev.begin > Date.now() || (ev.end && ev.end > Date.now()));
    }

    const elements = !events.length ? <Well>no data yet</Well> : events.map(ev =>
      <EventEntry key={ev.begin} data={ev} city={this.props.routeParams.city} />
      );

    return (
      <Col lg={8} md={9} sm={8}>
        {elements}
      </Col>
    );
  }
}

EventList.propTypes = {
  dataChannel: React.PropTypes.shape({
    on: React.PropTypes.func.isRequired,
  }).isRequired,
  routeParams: React.PropTypes.shape({
    city: React.PropTypes.string,
    id: React.PropTypes.string,
  }).isRequired,
};
