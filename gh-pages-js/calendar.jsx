import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'moment-range';

const CalEvent = (props) => {
  const tooltip = <Tooltip id={props.data.begin}>{props.data.title}</Tooltip>;
  /* eslint-disable jsx-a11y/anchor-has-content */
  const retEl = (
    <OverlayTrigger
      overlay={tooltip} placement="left"
      delayShow={0} delayHide={150}
    >
      <Link to={`/${props.city}/${props.data.begin}`} />
    </OverlayTrigger>
  );
  /* eslint-enable jsx-a11y/anchor-has-content */
  return retEl;
};

CalEvent.propTypes = {
  data: React.PropTypes.shape({
    begin: React.PropTypes.number,
    title: React.PropTypes.string,
  }),
  city: React.PropTypes.string.isRequired,
};

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: props.selectedMonth,
      month: props.selectedMonth ? moment(props.selectedMonth) : moment(),
      today: new Date(),
    };
  }
  componentWillReceiveProps(newprops) {
    if (/^\d{4}-\d{2}$/.test(newprops.selectedMonth)) {
      this.setState({ month: moment(newprops.selectedMonth) });
    }
  }
  prevMonth() {
    this.setState({
      month: moment(this.state.month).add(-1, 'months').toDate(),
    });
  }

  nextMonth() {
    this.setState({
      month: moment(this.state.month).add(1, 'months').toDate(),
    });
  }

  render() {
    const start = moment(this.state.month).startOf('month').startOf('isoWeek');
    const m = moment(this.state.month);
    const stop = moment(this.state.month).endOf('month').endOf('isoWeek');
    const month = [];
    const eventDates = this.props.eventDates.map(ev => ({
      m: moment(ev.begin),
      begin: ev.begin,
      title: ev.title,
    }));

    moment().range(start, stop).by('weeks', (w) => {
      const week = [];
      month.push(week);
      moment().range(w, moment(w).endOf('isoWeek')).by('days', (d) => {
        week.push(d);
      });
    });

    return (
      <div>
        <div className="calendar-controls">
          <LinkContainer to={`/${this.props.city}/${m.subtract(1, 'month').format('YYYY-MM')}`} >
            <Button bsClass="btn btn-default btn-xs pull-left">
              <span className="glyphicon glyphicon-arrow-left" aria-hidden="true" />
            </Button>
          </LinkContainer>
          <LinkContainer to={`/${this.props.city}/${m.add(1, 'month').format('YYYY-MM')}`} >
            <Button bsClass="btn btn-default btn-xs">
              {m.format('MMMM')} {m.get('year')}
            </Button>
          </LinkContainer>
          <LinkContainer to={`/${this.props.city}/${m.add(1, 'month').format('YYYY-MM')}`} >
            <Button bsClass="btn btn-default btn-xs pull-right">
              <span className="glyphicon glyphicon-arrow-right" aria-hidden="true" />
            </Button>
          </LinkContainer>
        </div>
        <table className="rbc-calendar table">
          <thead>
            <tr>
              <th>Mo</th>
              <th>Tu</th>
              <th>We</th>
              <th>Th</th>
              <th>Fr</th>
              <th>Sa</th>
              <th>Su</th>
            </tr>
          </thead>
          <tbody>
            { month.map(w => (
              <tr key={w[0].get('week')}>
                {w.map((d) => {
                  const cls = [];
                  if (d.isSame(this.state.today, 'day')) cls.push('rbc-today');
                  const hasEvent = eventDates.filter(evDate => evDate.m.isSame(d, 'day'));
                  if (hasEvent.length) cls.push('has-event', `event-count-${hasEvent.length}`);
                  if (!d.isSame(this.state.month, 'month')) cls.push('fade');
                  return (
                    <td className={cls.join(' ')} key={d.get('date')}>
                      {hasEvent.map(ev =>
                        <CalEvent key={ev.begin} data={ev} city={this.props.city} />
                      )}
                      <span className="date" data-date={d.get('date')} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

Calendar.propTypes = {
  selectedMonth: React.PropTypes.string,
  eventDates: React.PropTypes.arrayOf(React.PropTypes.shape({})).isRequired,
  city: React.PropTypes.string.isRequired,
};
Calendar.defaultProps = {
  city: 'major Events',
};
