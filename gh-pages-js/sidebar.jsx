/* global window */

import React from 'react';
import { Panel, ListGroup, ListGroupItem, Col, Carousel, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Calendar from './calendar';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      archives: {},
      majorEvents: [],
      eventList: [],
      calendar: JSON.parse(window.localStorage.getItem('calendar')),
    };
  }

  componentDidMount() {
    this.props.dataChannel.on('main', data =>
      (data.availableCities) && this.setState({
        archives: data.availableCities,
        majorEvents: data.majorEvents,
      })
    );
    this.props.dataChannel.on('data', data =>
      Array.isArray(data) && this.setState({
        eventList: data,
      })
    );
  }

  calendarSwitch(toggle) {
    window.localStorage.setItem('calendar', toggle);
    this.setState({ calendar: toggle });
  }

  render() {
    return (
      <Col lg={3} lgOffset={1} md={3} sm={4} className="sidebar">
        <Panel
          header={
            <h4>
              <Button className={this.state.calendar ? '' : 'inactive'} onClick={() => this.calendarSwitch(true)}>
                Calendar
              </Button>
              <Button onClick={() => this.calendarSwitch(false)} className={`pull-right ${this.state.calendar ? 'inactive' : ''}`}>
                Archives
              </Button>
            </h4>
          }
        >
          {this.state.calendar ?
            <Calendar
              selectedMonth={this.props.routeParams.id}
              eventDates={this.state.eventList.map(ev => ({ begin: ev.begin, title: ev.title }))}
              city={this.props.routeParams.city}
            />
          :
            <ListGroup bsClass="archives">
              {
                this.props.routeParams.city &&
                this.state.archives[this.props.routeParams.city] &&
                this.state.archives[this.props.routeParams.city].map((archive) => {
                  const archiveDate = archive.split('-');
                  return (<LinkContainer key={archive} to={`/${this.props.routeParams.city}/${archive}`} >
                    <ListGroupItem bsClass="" className={this.props.routeParams.id === archive ? 'active' : ''} >
                      {`${months[archiveDate[1] - 1]} ${archiveDate[0]}`}
                    </ListGroupItem>
                  </LinkContainer>);
                })
              }
            </ListGroup>
          }
        </Panel>
        <div className="sidebar-module">
          <Carousel controls={false} indicators className="carousel-fade">
            {(this.state.majorEvents.map((event, index) =>
              <LinkContainer key={index} to={`/${event.city}/${event.begin}`}>
                <Carousel.Item>
                  <div className="dummy" />
                  <img src={event.image} role="presentation" />
                </Carousel.Item>
              </LinkContainer>
            ))}
          </Carousel>
        </div>
      </Col>
    );
  }
}

Sidebar.propTypes = {
  dataChannel: React.PropTypes.shape({
    on: React.PropTypes.func.isRequired,
  }).isRequired,
  routeParams: React.PropTypes.shape({
    city: React.PropTypes.string,
    id: React.PropTypes.string,
  }).isRequired,
};
