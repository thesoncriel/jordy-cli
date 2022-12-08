import { OpenAPIObject } from 'openapi3-ts';
import { EntityBodySchemaConfigDto } from '../common';
import { extractIntermediatePathModels } from './intermediateLogics';
import { extractEntityModuleNameModel } from './manipulates';
import { EntityModuleModel, IntermediateModuleModel } from './types';

export interface OpenApi3Parser {
  parse(data: OpenAPIObject): EntityModuleModel;
}

export class OpenApiObjectParser implements OpenApi3Parser {
  constructor(
    public readonly basePath = '/api/v3/',
    private bodySchemaConfigs: EntityBodySchemaConfigDto[]
  ) {}

  parse(data: OpenAPIObject): EntityModuleModel {
    const intermediate = this.parseToIntermediateModuleModel(data);

    throw new Error('haha -_-');
  }

  parseToEntityModule(raw: OpenAPIObject) {
    const moduleNameInfo = extractEntityModuleNameModel(raw);
    const moduleInfo: EntityModuleModel = {
      imports: [],
      entities: [],
      ...moduleNameInfo,
    };

    const pathKeys = Object.keys(raw.paths);

    if (Array.isArray(pathKeys) && pathKeys.length > 0) {
      moduleInfo.featureName = moduleNameInfo.featureName;
      moduleInfo.fullName = moduleNameInfo.fullName;

      return moduleInfo;
    }

    throw new Error('invalid open api data.');
  }

  parseToIntermediateModuleModel(raw: OpenAPIObject) {
    const result: IntermediateModuleModel = {
      ...extractEntityModuleNameModel(raw.info.title),
      title: raw.info.title,
      paths: Object.keys(raw.paths).flatMap((path) =>
        extractIntermediatePathModels(
          path,
          raw.paths[path],
          this.bodySchemaConfigs
        )
      ),
    };

    return result;
  }
}
