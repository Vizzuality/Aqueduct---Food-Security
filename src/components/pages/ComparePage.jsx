import React from 'react';
import CountrySelect from 'containers/countries/CountrySelect';

// Components
import CompareList from 'components/compare/CompareList';
import Filters from 'components/filters/Filters';

export default class ComparePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: 2
    };
  }

  componentWillMount() {
    this.props.updateCompareUrl();
  }

  getCountrySelects() {
    const items = [];
    for (let i = 0; i < this.state.items; i += 1) {
      items.push(
        <div className="small-6 columns" key={i}>
          <CountrySelect
            defaultValue={this.props.compare.countries[i] || null}
            onValueChange={(selected) => {
              selected && this.props.setCompareCountry({ index: i, iso: selected.value });
            }}
          />
        </div>
      );
    }
    return items;
  }

  render() {
    return (
      <div>
        <div className="compare-filters">
          <div className="compare-filters-section">
            <div className="row">{this.getCountrySelects()}</div>
          </div>
          <div className="compare-filters-section">
            <Filters filters={this.props.filters} setFilters={this.props.setFilters} />
          </div>
        </div>
        <CompareList filters={this.props.filters} countryList={this.props.countries.list} countries={this.props.compare.countries} loading={this.props.loading} widgetsActive={this.props.widgetsActive} items={this.state.items} />
      </div>
    );
  }
}

ComparePage.propTypes = {
  compare: React.PropTypes.object,
  loading: React.PropTypes.bool,
  countries: React.PropTypes.object,
  filters: React.PropTypes.object,
  setFilters: React.PropTypes.func,
  updateCompareUrl: React.PropTypes.func,
  setCompareCountry: React.PropTypes.func,
  widgetsActive: React.PropTypes.array
};
