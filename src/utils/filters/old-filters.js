import { substitution, concatenation } from 'utils/utils';

// Util functions
function getConversion(string, params, sqlParams) {
  let str = string;
  str = substitution(str, params);
  str = concatenation(str, sqlParams);

  return str;
}

function getWaterColumn({ water, period_type, period_value,  dataType }, sufix, widget) {
  const layers = {
    // Wayer stress
    '4b000ded-5f4d-4dbd-83c9-03f2dfcd36db': {
      indicator: 'ws',
      dataType: dataType === 'change_from_baseline' && !widget ? 'c' : 't',
      sufix: dataType === 'change_from_baseline' && !widget ? 'l' : 'r'
    },
    // Seasonal variability
    'd9785282-2140-463f-a82d-f7296687055a': {
      indicator: 'sv',
      dataType: dataType === 'change_from_baseline' && !widget ? 'c' : 't',
      sufix: dataType === 'change_from_baseline' && !widget ? 'l' : 'r'
    },
    none: {
      indicator: 'ws',
      dataType: dataType === 'change_from_baseline' && !widget ? 'c' : 't',
      sufix: dataType === 'change_from_baseline' && !widget ? 'l' : 'r'
    }
  };

  // Dictionary
  const yearOptions = {
    baseline: 'bs',
    2020: '20',
    2030: '30',
    2040: '40',
    2050: '50'
  };

  let _indicator = layers[water].indicator;
  const _year = yearOptions[period_value];
  const _dataType = layers[water].dataType;
  const _scenario = (period_type === 'year' && period_value === 'baseline') ? '00' : '28';
  const _sufix = sufix || layers[water].sufix;


  /**
   * A bomb has been planted!
   *
   * For Seasonal Variability-based widgets, their table name
   * don't match with its dataset one, that's why we have to changed it
   * manually. This should be REMOVED in the future.
   **/
  if (layers[water].indicator === 'sv' && widget === true) {
    _indicator = 'ws';
  }

  return `${_indicator}${_year}${_scenario}${_dataType}${_sufix}`;
}

// LAYER FUNCTIONS
export function getWaterSql(layer = {}, filters = {}) {
  const yearOptions = {
    baseline: 2010,
    2020: 2020,
    2030: 2030,
    2040: 2040,
    2050: 2050
  };

  // Merge filters && paramsConfig
  const params = layer.paramsConfig.map((param) => {
    switch (param.key) {
      case 'water_column':
        return {
          key: param.key,
          value: getWaterColumn(filters)
        };
      case 'iso': {
        return {
          key: param.key,
          value: (filters.scope === 'country' && filters.country) ? filters.country : null
        };
      }

      default:
        return {
          key: param.key,
          value: filters[param.key]
        };
    }
  });

  // Merge filters && sqlConfig
  const sqlParams = layer.sqlConfig.map((param) => {
    return {
      key: param.key,
      keyParams: param.keyParams.map((p) => {
        switch (p.key) {
          case 'period_type':
            return {
              key: p.key,
              value: filters.period_type || 'year'
            };
          case 'period_value': {
            return {
              key: p.key,
              value: filters.period_type === 'year' ? yearOptions[filters[p.key]] : null
            };
          }
          case 'crop': {
            return {
              key: p.key,
              value: (filters[p.key] !== 'all') ? filters[p.key] : null
            };
          }
          case 'irrigation': {
            return {
              key: p.key,
              // We can't have a irrigation different from 1, in this case we don't need to add anything
              value: (!filters[p.key] || filters[p.key].length === 0 || filters[p.key].length === 2) ? null : filters[p.key][0]
            };
          }
          case 'iso': {
            return {
              key: p.key,
              value: (filters.scope === 'country' && filters.country) ? filters.country : null
            };
          }

          default:
            return {
              key: p.key,
              value: filters[p.key]
            };
        }
      })
    };
  });

  return Object.assign({}, layer.body, {
    layers: layer.body.layers.map((l) => {
      return Object.assign({}, l, {
        options: Object.assign({}, l.options, {
          user_name: layer.account,
          cartocss: getConversion(l.options.cartocss, params, sqlParams),
          cartocss_version: l.options.cartocssVersion,
          sql: getConversion(l.options.sql, params, sqlParams)
        })
      });
    })
  });
}


export function getFoodSql(layer = {}, filters = {}) {
  // Dictionary
  const yearOptions = {
    baseline: 2005,
    2020: 2020,
    2030: 2030,
    2040: 2040,
    2050: 2050
  };

  const params = layer.paramsConfig.map((param) => {
    switch (param.key) {
      case 'period_type': {
        return {
          key: param.key,
          value: filters.period_type || 'year'
        };
      }
      case 'period_value': {
        return {
          key: param.key,
          value: filters.period_value === 'year' ? yearOptions[filters[param.key]] : null
        };
      }
      default:
        return {
          key: param.key,
          value: filters[param.key]
        };
    }
  });

  // Merge filters && sqlConfig
  const sqlParams = layer.sqlConfig.map((param) => {
    return {
      key: param.key,
      keyParams: param.keyParams.map((p) => {
        switch (p.key) {
          case 'period_type': {
            return {
              key: param.key,
              value: filters.period_type || 'year'
            };
          }
          case 'period_value': {
            return {
              key: param.key,
              value: filters.period_value === 'year' ? yearOptions[filters[param.key]] : null
            };
          }
          case 'commodity': {
            return {
              key: `lower(${p.key})`,
              value: (filters.crop !== 'all') ? filters.crop : null
            };
          }
          case 'iso':
            return {
              key: p.key,
              value: (filters.scope === 'country' && filters.country) ? filters.country : null
            };

          case 'indicator': {
            return {
              key: p.key,
              value: filters.indicator || null
            };
          }
          case 'scenario':
            return {
              key: p.key,
              value: filters.scenario || 'bau'
            };
          case 'data_type': {
            return {
              key: p.key,
              value: filters.data_type || 'absolute'
            };
          }
          default:
            return {
              key: p.key,
              value: filters[p.key]
            };
        }
      })
    };
  });

  return Object.assign({}, layer.body, {
    url: getConversion(layer.body.url, params, sqlParams)
  });
}

// WIDGET FUNCTIONS

export function widgetsFilter(widget, { scope, crop, country, water }, compare, datasetTags) {
  const _crop = crop === 'all' ? 'all_crops' : 'one_crop';
  const _country = ((scope === 'country' && country) || compare.countries.length) ? 'country' : 'global';
  // 3 OPTIONS
  // - const isWater = !(water === 'none' && find(widget.widgetConfig.paramsConfig, { key: 'water_column' }));
  // - const isWater = !(water === 'none');
  // - empty
  const isWater = !(water === 'none');

  return datasetTags && datasetTags.includes(_crop) && datasetTags.includes(_country);
}

export function getWidgetSql(widgetConfig = {}, filters = {}) {
  // Dictionary
  const yearOptions = {
    baseline: 2010,
    2020: 2020,
    2030: 2030,
    2040: 2040
  };

  // paramsConfig transform
  const params = widgetConfig.paramsConfig.map((param) => {
    switch (param.key) {
      case 'water_column':
        return {
          key: param.key,
          value: getWaterColumn(filters, param.sufix, true)
        };
      case 'period_value': {
        return {
          key: param.key,
          value: filters.period_type === 'year' ? yearOptions[filters[param.key]] : null
        };
      }
      case 'irrigation':
        return {
          key: param.key,
          // We can't have a irrigation different from 1, in this case we don't need to add anything
          value: (!filters[param.key] || filters[param.key].length === 0 || filters[param.key].length === 2) ? null : filters[param.key]
        };
      case 'iso':
        return {
          key: param.key,
          value: (filters.scope === 'country' && filters.country) ? filters.country : null
        };
      case 'commodity':
        return {
          key: param.key,
          value: filters.crop
        };
      case 'crop_scenario':
        return {
          key: param.key,
          value: 'SSP2-MIRO'
        };
      case 'crops.iso':
        return {
          key: param.key,
          value: (filters.scope === 'country' && filters.country) ? filters.country : null
        };
      default:
        return {
          key: param.key,
          value: filters[param.key]
        };
    }
  });

  // sqlConfig transform
  const sqlParams = widgetConfig.sqlConfig.map((param) => {
    return {
      key: param.key,
      keyParams: param.keyParams.map((p) => {
        // return {
        //   key: p.key,
        //   value: (conversions[p.key]) ? conversions[p.key](p.key) : filters[p.key]
        // }
        switch (p.key) {
          case 'period_type':
            return {
              key: p.key,
              value: filters.period_type || 'year'
            };
          case 'period_value': {
            return {
              key: p.key,
              value: filters.period_type === 'year' ? yearOptions[filters[p.key]] : null
            };
          }
          case 'commodity': {
            return {
              key: `lower(${p.key})`,
              value: (filters.crop !== 'all') ? filters.crop : null
            };
          }
          case 'iso':
            return {
              key: p.key,
              value: (filters.scope === 'country' && filters.country) ? filters.country : null
            };
          case 'crops.iso':
            return {
              key: p.key,
              value: (filters.scope === 'country' && filters.country) ? filters.country : null
            };
          case 'crop_scenario':
            return {
              key: param.key,
              value: 'SSP2-MIRO'
            };

          default:
            return {
              key: p.key,
              value: filters[p.key]
            };
        }
      })
    };
  });
  return Object.assign({}, widgetConfig, {
    data: JSON.parse(getConversion(JSON.stringify(widgetConfig.data), params, sqlParams))
  });
}