/* eslint max-len: ["error", 1000] */
/* eslint import/no-extraneous-dependencies: 0 */

import React from 'react';
import { Col, Panel } from 'react-bootstrap';

const About = props => (
  <Col lg={3} lgOffset={1} md={3} sm={12} className="sidebar pull-right about">
    <Panel header={(<h4>About</h4>)}>
      <p>
        Before you leave the house, make sure your event wasn&apos;t cancelled,
        always check the official announcement.<br />
        The information here may not be updated in time.
      </p>
      <p>
        To report missing events, please use <a href="https://github.com/sillyslux/sillyslux.github.io/issues/new">
        github issues</a> or send <a href="mailto:sillyslux@net.hr?subject=IT%20Event%20Announcement%20&body=Please%20add%20the%20following%20event%20to%20the%20list%3A%0A%0Atitle%3A%20%5BMy%20Event%5D%0Adate%3A%20%5Bstarts%20at%5D%0Aend%3A%20%5Boptional%5D%0Aduration%3A%20%5Boptional%5D%0Aweblink%3A%20%5Bwww.website.com%5D%0Alocation%3A%20%5Baddress%2C%20city%5D%0Ashort%20description%3A%20%5Bteaser%5D%0Abody%3A%20%5Bdescribe%20you%20event%20here%5D%0Aimage%3A%20%5Burl%20to%20your%20image%5D%0A%0A%5B*please%20make%20the%20body%20no%20longer%20than%20100%20words%5D">
        e-mails</a>.<br />
        Regular reporters can install locally, use the admin panel and provide pull requests.
      </p>
      <p>
        The only reason for this project was to get back those awesome RSS feeds on IT-Events.<br />
        RSS rules!
      </p>
      <p>
        <img src="/assets/rss.png" role="presentation" /> for {props.routeParams.city} is
        available <a href={`/feed/${props.routeParams.city}/atom.xml`}>here</a> and <a href={`/feed/${props.routeParams.city}/rss.xml`}>here</a>.
      </p>
      <p>
        This project is hosted on Github, feel free to fork,
        for whatever you can use it for and all the data is just as free.
      </p>
    </Panel>
  </Col>
);

About.propTypes = {
  routeParams: React.PropTypes.shape({
    city: React.PropTypes.string,
  }),
};

export default About;
