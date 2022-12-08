import {
  ContentPropertyType,
  HttpRestMethodEnum,
  ParameterPropertyType,
} from './types';

export const HTTP_REST_METHOD_LIST = [
  HttpRestMethodEnum.GET,
  HttpRestMethodEnum.POST,
  HttpRestMethodEnum.PUT,
  HttpRestMethodEnum.PATCH,
  HttpRestMethodEnum.DELETE,
];

export const PARAMETER_TYPE_LIST: ParameterPropertyType[] = [
  'integer',
  'number',
  'string',
  'boolean',
];

export const HEADER_AUTH_KEYWORD = 'Header_authorization';

export const PROPERTY_TYPE_LIST: ContentPropertyType[] = [
  'integer',
  'number',
  'string',
  'boolean',
  'object',
  'array',
];
