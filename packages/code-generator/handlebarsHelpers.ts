import Handlebars from 'handlebars';
import { COMMON_FEATURE_NAMES } from './constants';

Handlebars.registerHelper('withFeature', function (value) {
  return `${COMMON_FEATURE_NAMES.includes(value) ? '' : 'features/'}${value}`;
});

Handlebars.registerHelper('withSubPath', function (value) {
  if (Array.isArray(value)) {
    return `/${value.join('/')}`;
  }
  return value ? `/${value}` : '';
});
