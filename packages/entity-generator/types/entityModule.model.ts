import { EntityModuleNameModel, HttpRestAuthTypeEnum } from './common.model';

export enum EntitySchemaTypeEnum {
  INTERFACE = 7,
  UNION,
  ENUM,
}

export enum HttpRestMethodEnum {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface HttpRestRepositoryModel {
  path: string;
  method: HttpRestMethodEnum;
  authType: HttpRestAuthTypeEnum;
  parameter: string;
  entity: string;
}

export interface HttpRestRepositoryPathModel extends HttpRestRepositoryModel {
  relationalEntityInfo: EntitySchemaModel;
  relationalParamsInfo: any;
  rawSchema: any;
}

export interface EntityImportModel {
  types: string[];
  from: string;
}

export interface EntityPropertyModel {
  name: string;
  type: string;
  nullable: boolean;
  required: boolean;
  description: string;
}

export interface EntitySchemaModel {
  name: string;
  type: EntitySchemaTypeEnum;
  properties: EntityPropertyModel[];
  description: string;
}

export interface EntityModuleModel extends EntityModuleNameModel {
  imports: EntityImportModel[];
  entities: EntitySchemaModel[];
  fullName: string;
  version: string;
}
