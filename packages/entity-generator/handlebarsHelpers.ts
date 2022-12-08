import Handlebars from 'handlebars';
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
