import { OpenAPIObject } from 'openapi3-ts';
import { EntityGeneratorConfigDto } from '../common';
import { extractIntermediatePathModels } from './intermediateLogics';
import { extractEntityModuleNameModel } from './manipulates';
import { toEntityModuleModel } from './manipulates/entityModule.convert';
import { EntityModuleModel, IntermediateModuleModel } from './types';

export interface OpenApi3Parser {
  parse(data: OpenAPIObject): EntityModuleModel;
  parseAll(map: Map<string, OpenAPIObject>): EntityModuleModel[];
}

export class OpenApiObjectParser implements OpenApi3Parser {
  constructor(public readonly entityConfig: EntityGeneratorConfigDto) {}

  parse(data: OpenAPIObject): EntityModuleModel {
    const intermediate = this.parseToIntermediateModuleModel(data);

    return toEntityModuleModel(intermediate);
  }

  parseAll(map: Map<string, OpenAPIObject>) {
    return Array.from(map.entries()).map(([key, val]) => {
      console.log(`parsing... - ${key}`);
      return this.parse(val);
    });
  }

  parseToIntermediateModuleModel(raw: OpenAPIObject) {
    const moduleNameDto = extractEntityModuleNameModel(raw.info.title);

    console.log(
      `module name : ${moduleNameDto.fullName} (${moduleNameDto.version})`
    );

    const result: IntermediateModuleModel = {
      ...moduleNameDto,
      title: raw.info.title,
      paths: Object.keys(raw.paths).flatMap((path) =>
        extractIntermediatePathModels(path, raw.paths[path], this.entityConfig)
      ),
    };

    return result;
  }
}
