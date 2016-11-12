/* global window */

import React from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';

const NavItemRouted = item => (
  <LinkContainer to={`/${item.link}`}>
    <NavItem eventKey={item.link}>{item.link}</NavItem>
  </LinkContainer>
);

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      menuOpen: false,
    };
  }

  componentDidMount() {
    this.props.dataChannel.on('main', data =>
      data.availableCities && this.setState({ cities: Object.keys(data.availableCities) })
    );
  }

  dropdownToggle(newValue) {
    if (this.forceOpen) {
      this.setState({ menuOpen: true });
      this.forceOpen = false;
    } else {
      this.setState({ menuOpen: newValue });
    }
  }
  menuItemClickedThatShouldntCloseDropdown() {
    this.forceOpen = true;
  }

  render() {
    return (
      <Navbar>
        <Row className="show-grid">
          <Col lg={8}>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">IT Events in Croatia</Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav activeKey={this.props.routeParams.city}>
              <NavDropdown eventKey={this.props.routeParams.city} title={this.props.routeParams.city || 'start'} id="basic-nav-dropdown">
                {this.state.cities.map(city =>
                  <LinkContainer key={city} to={`/${city}`} >
                    <MenuItem eventKey={city}>{city}</MenuItem>
                  </LinkContainer>
                )}
                <MenuItem divider />
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItemRouted link="upcoming Events" />
              <NavDropdown
                title="Settings" id="settings-nav-dropdown"
                open={this.state.menuOpen}
                onToggle={val => this.dropdownToggle(val)}
              >
                <MenuItem
                  className="show-merged"
                  onClick={(e) => {
                    this.menuItemClickedThatShouldntCloseDropdown();
                    window.localStorage.setItem('mergeMajorEvents',
                      e.currentTarget.querySelector('.show-merged').classList.toggle('active')
                    );
                  }}
                >
                  Merge Major Events
                  <span
                    className={[
                      'show-merged glyphicon glyphicon-ok text-primary',
                      (JSON.parse(window.localStorage.getItem('mergeMajorEvents')) ? ' active' : ''),
                    ].join(' ')} style={{ float: 'right' }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    this.menuItemClickedThatShouldntCloseDropdown();
                    window.localStorage.setItem('mergeCities',
                      e.currentTarget.querySelector('.show-merged').classList.toggle('active')
                    );
                  }}
                >
                  Merge Cities
                  <span
                    className={[
                      'show-merged glyphicon glyphicon-ok text-primary',
                      (JSON.parse(window.localStorage.getItem('mergeCities')) ? ' active' : ''),
                    ].join(' ')} style={{ float: 'right' }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={() => this.menuItemClickedThatShouldntCloseDropdown()}
                >
                  Last Cities
                  <div className="text-primary" style={{ float: 'right', marginRight: '-15px' }} >
                    <sup style={{ float: 'right', marginTop: '3px' }} >
                      <Button
                        className="glyphicon glyphicon-plus"
                        onClick={() => {
                          const num = Number(window.document.querySelector('.history-count').textContent);
                          window.document.querySelector('.history-count').textContent = num + 1;
                        }}
                      />
                    </sup>
                    <sub style={{ float: 'right', clear: 'right', marginRight: '1px', marginTop: '-5px' }}>
                      <Button
                        className="glyphicon glyphicon-minus"
                        onClick={() => {
                          const num = Number(window.document.querySelector('.history-count').textContent);
                          window.document.querySelector('.history-count').textContent = num - 1;
                        }}
                      />
                    </sub>
                  </div>
                  <span className="history-count text-primary" style={{ float: 'right', fontSize: '15px', fontWeight: 'bold', marginRight: '2px', marginTop: '-2px' }} >
                    3
                  </span>
                </MenuItem>
              </NavDropdown>
              <NavItemRouted link="About" />
            </Nav>
          </Col>
        </Row>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  dataChannel: React.PropTypes.shape({
    on: React.PropTypes.func.isRequired,
  }).isRequired,
  routeParams: React.PropTypes.shape({
    city: React.PropTypes.string,
  }).isRequired,
};
