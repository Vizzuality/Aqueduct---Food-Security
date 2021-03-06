import React from 'react';
import PropTypes from 'prop-types';
import { Icon, toggleModal, Sticky } from 'aqueduct-components';
import { dispatch } from 'main';
import { Link } from 'react-router';

// Components
import ShareModal from 'components/modal/share';
import CompareList from 'components/compare/CompareList';
import CountrySelect from 'components/country-select';
import StickyFilters from 'components/filters/sticky';
import Filters from 'components/filters';

// utils
import { logEvent } from 'utils/analytics';

export default class ComparePageDesktop extends React.Component {
  static toggleShareModal() {
    dispatch(toggleModal(true, {
      children: ShareModal
    }));
  }

  constructor(props) {
    super(props);
    this.state = {
      items: 2
    };

    // bindings
    this.toggleShareModal = ComparePageDesktop.toggleShareModal.bind(this);
  }

  componentWillMount() {
    this.props.updateCompareUrl();
  }

  componentDidMount() {
    this.setStickyFilterPosition();
  }

  componentDidUpdate() {
    this.setStickyFilterPosition();
  }

  componentWillUnmount() {
    this.props.emptyCompareCountries();
  }

  onSticky(isSticky) {
    this.setState({
      showStickyFilters: isSticky
    });
  }

  setStickyFilterPosition() {
    const elemHeight = this.filtersElem.getBoundingClientRect().height;
    const stickyFilterTopPosition = this.filtersElem.offsetTop + elemHeight;

    if (this.state.stickyFilterTopPosition === stickyFilterTopPosition) return;

    this.setState({
      stickyFilterTopPosition
    });
  }

  getCountrySelects() {
    const items = [];
    for (let i = 0; i < this.state.items; i += 1) {
      const text = i === 0 ? 'Selected country' : 'Compare with...';
      items.push(
        <div className="small-6 columns" key={i}>
          <div className="compare-country-wrapper">
            <span className="compare-filters-text">{text}</span>
            <CountrySelect
              className="-fixed"
              value={this.props.compare.countries[i] || null}
              onValueChange={(selected) => {
                if (selected) this.props.setCompareCountry({ index: i, iso: selected.value });

                const countrySide = i === 0 ? 'left' : 'right';
                logEvent('[AQ-Food] Compare', `user sets ${countrySide} country`, selected.label);
              }}
            />
          </div>
        </div>
      );
    }
    return items;
  }

  render() {
    return (
      <div className="l-comparepage l-fullheight">
        <div className="compare-header">
          <Link to="/" className="back-link">Back</Link>
          <button onClick={this.toggleShareModal} className="share-btn" type="button"><Icon name="icon-share" className="medium" />Share</button>
        </div>
        <div className="compare-filters" ref={(elem) => { this.filtersElem = elem; }}>
          <div className="compare-filters-section -highlighted">
            <div className="row expanded collapse">{this.getCountrySelects()}</div>
          </div>
          <div className="compare-filters-wrapper">
            <div className="compare-filters-section -collapsed">
              <Filters className="-compare" {...this.props} />
            </div>
          </div>
        </div>

        {/* Sticky Filters */}
        <Sticky
          topLimit={this.state.stickyFilterTopPosition}
          onStick={(isSticky) => { this.onSticky(isSticky); }}
        >
          {this.state.showStickyFilters &&
            <StickyFilters
              className="-compare"
              countriesCompare={this.props.compare.countries}
              filters={this.props.filters}
              setFilters={this.props.setFilters}
              setCompareCountry={this.props.setCompareCountry}
            />
          }
        </Sticky>

        <CompareList
          filters={this.props.filters}
          countryList={this.props.countries.list}
          countries={this.props.compare.countries}
          loading={this.props.loading}
          widgetsActive={this.props.widgetsActive}
          items={this.state.items}
        />
      </div>
    );
  }
}

ComparePageDesktop.propTypes = {
  compare: PropTypes.object,
  loading: PropTypes.bool,
  countries: PropTypes.object,
  filters: PropTypes.object,
  setFilters: PropTypes.func,
  updateCompareUrl: PropTypes.func,
  setCompareCountry: PropTypes.func,
  emptyCompareCountries: PropTypes.func,
  widgetsActive: PropTypes.array,
  layersActive: PropTypes.array
};
