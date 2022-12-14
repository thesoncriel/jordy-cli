import { BaseFeatureFileInfoDto } from '../../common';

export enum HttpRestAuthTypeEnum {
  PUBLIC = 'public',
  BASE = 'base',
  AUTH = 'auth',
}

export enum RepositoryBehaviorTypeEnum {
  SEARCH = 'Search',
  UPDATE = 'Update',
  DELETE = 'Delete',
  CREATE = 'Create',
  DETAIL = 'Detail',
  UPLOAD = 'Upload',
}

export enum HttpRestResponseBodySchemaEnum {
  DATA_PAYLOAD_EMPTY,
  DATA_PAYLOAD_PAGING,
  UNKNOWN,
}

export enum EntitySuffixTypeEnum {
  PARAMS = 'Params',
  ENTITY = 'Entity',
  UNION = 'Type',
  ENUM = 'Enum',
}

export type ParameterPropertyType =
  | 'integer'
  | 'number'
  | 'string'
  | 'boolean'
  | 'unknown';

export type ContentPropertyType =
  | 'integer'
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'array'
  | 'unknown';

export interface EntityModuleNameModel extends BaseFeatureFileInfoDto {
  version: string;
  fullName: string;
  fullNameAsPascalCase: string;
  featureNameAsPascalCase: string;
}
