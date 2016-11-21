import React from 'react';

// Components
import Filters from 'components/app/Filters';
import WidgetList from 'components/widgets/WidgetList';

class Sidebar extends React.Component {

  constructor(props) {
    super(props);

    // BINDINGS
    this.triggerToggle = this.triggerToggle.bind(this);

    this.state = {
      opened: true
    };
  }

  componentWillMount() {
    this.props.getWidgets();
  }

  /**
   * UI EVENTS
   * - triggerToggle
  */
  triggerToggle() {
    this.setState({
      opened: !this.state.opened
    });
  }

  render() {
    const openedClass = (this.state.opened) ? '-opened' : '';

    return (
      <div className={`l-sidebar c-sidebar ${openedClass}`}>
        {/*
          Toggle button
          - I'm using a div instead of a button because I don't want that browser's styles interfere with it
        */}
        <div className={`l-sidebar-toggle btn-toggle ${openedClass}`} onClick={this.triggerToggle}>
          <svg className="c-icon -medium"><use xlinkHref="#icon-arrow-left" /></svg>
        </div>

        {/* Filters */}
        <div className="l-filters">
          <Filters />
        </div>

        {/* Widget List */}
        <div className="l-sidebar-content">
          <WidgetList widgets={this.props.widgets} />
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  // STORE
  widgets: React.PropTypes.object,

  // ACTIONS
  getWidgets: React.PropTypes.func
};


export default Sidebar;