import { createSelector } from 'reselect';

// Get the datasets and filters from state
const datasets = state => state.datasets;
const filters = state => state.filters;


// Create a function to compare the current active datatasets and the current datasetsIds
const getActiveDatasets = (_datasets, _filters) => {
  const filtersActive = _filters[_filters.current];
  const listActive = _datasets.list.filter(
    l => filtersActive.datasetsIds.indexOf(l.id) !== -1
  );
  return {
    list: listActive
  };
};

// Export the selector
export default createSelector(
  datasets,
  filters,
  getActiveDatasets
);