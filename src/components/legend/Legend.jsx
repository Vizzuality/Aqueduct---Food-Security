import React from 'react';
import orderBy from 'lodash/orderBy';

import LegendItem from 'components/legend/LegendItem';
import Icon from 'components/ui/Icon';

export default class Legend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLayer: null,
      expanded: props.expanded
    };
  }

  toggleExpand() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const layers = orderBy(this.props.layers, ['category'], ['desc']);
    return (
      <div className={`c-legend ${this.props.className} ${this.state.expanded ? '-expanded' : ''}`}>
        <div className="legend-header">
          <span className="legend-header-title">View Legend</span>
          <button className="legend-btn" onClick={() => this.toggleExpand()}>
            <Icon name="icon-arrow-up-2" className="legend-open-icon" />
            <Icon name="icon-cross" className="legend-close-icon" />
          </button>
        </div>
        <div className="legend-content">
          <ul>
            {layers.map((layer, index) =>
              layer.category !== 'mask' &&
              <LegendItem toggleModal={this.props.toggleModal} layer={layer} key={index} />
            )}
          </ul>
        </div>
      </div>
    );
  }
}

Legend.defaultProps = {
  expanded: false
};

Legend.propTypes = {
  layers: React.PropTypes.array,
  className: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  toggleModal: React.PropTypes.func
};
