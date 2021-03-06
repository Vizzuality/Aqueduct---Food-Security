import { createSelector } from 'reselect';

// states
const datasets = state => state.datasets.list;
const filters = state => state.filters;
const compare = state => state.compare;

const getActiveWidgets = (_datasets, _filters, _compare) => {
  const { scope, crop, country } = _filters;
  const cropScope = crop === 'all' ? 'all_crops' : 'one_crop';
  const geographyScope = ((scope === 'country' && country) || _compare.countries.length) ? 'country' : 'global';
  const widgetList = [];

  _datasets.forEach((dataset) => {
    if (dataset.widget && dataset.widget.length) {
      const widget = {
        ...dataset.widget[0],
        ...(dataset.metadata && dataset.metadata.length) && { metadata: dataset.metadata[0] }
      };
      // NOTE: legacy vocabulary stores former used tags
      const vocabulary = dataset.vocabulary.find(v => v.name === 'legacy' || v.name === 'attributes');
      const datasetTags = vocabulary ? vocabulary.tags : [];
      const cropFilter = datasetTags.includes(cropScope);
      const geographyFilter = datasetTags.includes(geographyScope);
      const validWidgetFilter = (!Object.prototype.hasOwnProperty.call(widget.widgetConfig, 'type') || widget.widgetConfig.type === 'text');

      if (
        widget.widgetConfig
        && validWidgetFilter
        && cropFilter
        && geographyFilter) {
        widgetList.push(widget);
      }
    }
  });

  // 2019-10-16 client wanted the world commodity widget at the bottom
  let result = widgetList;
  const existWorldCommodity = widgetList.find(w => w.slug === 'world-price-usd-ton');
  if (existWorldCommodity) {
    result = result.slice(1, widgetList.length);
    result.push(existWorldCommodity);
  }

  return result;
};

export default createSelector(
  datasets,
  filters,
  compare,
  getActiveWidgets
);
