import { SchemaObject } from 'openapi3-ts';
import { EntityBodySchemaConfigDto } from '../../common';
import {
  ContentPropertyType,
  EntityModuleNameModel,
  HttpRestAuthTypeEnum,
  ParameterPropertyType,
  RepositoryBehaviorTypeEnum,
} from './common.model';
import { HttpRestMethodEnum } from './entityModule.model';

export type DeclarableEntityType = 'object' | 'enum' | 'union';

export interface IntermediateParameterModel {
  type: ParameterPropertyType;
  in: 'query' | 'path';
  name: string;
  required: boolean;
  description: string;
  enum: string[];
  default: string;
}

export interface IntermediatePropertyModel {
  name: string;
  type: ContentPropertyType;
  nullable: boolean;
  required: boolean;
  description: string;
  $ref: string;
  enum?: string[];
  itemsProperties: IntermediatePropertyModel[];
  itemsType?: ContentPropertyType;
  oneOfProperties: IntermediatePropertyModel[];
}

export interface IntermediatePropertyCheckResultDto {
  suitable: boolean;
  endSchema: SchemaObject;
  pathIndex: number;
  $ref: string;
}

export interface IntermediateBodySchemaModel {
  config: EntityBodySchemaConfigDto;
  result: IntermediatePropertyCheckResultDto;
}

export interface IntermediatePathModel {
  path: string;
  baseName: string;
  method: HttpRestMethodEnum;
  behavior: RepositoryBehaviorTypeEnum;
  authType: HttpRestAuthTypeEnum;
  description: string;
  parameters: IntermediateParameterModel[];
  bodySchema: IntermediateBodySchemaModel;
  bodyRequestProperties: IntermediatePropertyModel[];
  properties: IntermediatePropertyModel[];
}

export interface IntermediateModuleModel extends EntityModuleNameModel {
  title: string;
  paths: IntermediatePathModel[];
}

export type SubTypeCallbackType = (
  targetType: DeclarableEntityType,
  parentProp: IntermediatePropertyModel
) => string;
