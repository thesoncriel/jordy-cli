import Handlebars from 'handlebars';
import { isString } from '../common';
import { EntitySchemaTypeEnum } from './types';

Handlebars.registerHelper('isInterface', function (value) {
  return value === EntitySchemaTypeEnum.INTERFACE;
});
Handlebars.registerHelper('isUnion', function (value) {
  return value === EntitySchemaTypeEnum.UNION;
});
Handlebars.registerHelper('isEnum', function (value) {
  return value === EntitySchemaTypeEnum.ENUM;
});

Handlebars.registerHelper('toUpperCase', function (value) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
});

Handlebars.registerHelper('tsType', function (value) {
  if (isString(value) && value.includes('integer')) {
    return value.replace('integer', 'number');
  }
  return value;
});
