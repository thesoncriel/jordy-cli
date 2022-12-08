import { SchemaObject } from 'openapi3-ts';
import { EntityBodySchemaConfigDto } from '../../common';
import {
  IntermediateBodySchemaModel,
  IntermediatePropertyCheckResultDto,
} from '../types';
import { findPropertyInfoByPaths } from './findPropertyInfoByPaths';

function createIntermediatePropertyCheckResultDtoToNotSuitable(
  schema: SchemaObject
) {
  const result: IntermediatePropertyCheckResultDto = {
    suitable: false,
    endSchema: schema,
    pathIndex: 0,
    $ref: '',
  };

  return result;
}

function createEntityBodySchemaConfigDto() {
  const result: EntityBodySchemaConfigDto = {
    desc: '',
    typeName: '',
    import: '',
    rootEntityPath: '',
    pathNeeded: [],
  };

  return result;
}

function isAllPathNeededSuitable(schema: SchemaObject, pathNeeded: string[]) {
  return pathNeeded.every(
    (path) => findPropertyInfoByPaths(schema, path.split('.')).suitable
  );
}

function parseBodySchemaBySingleConfig(
  schema: SchemaObject,
  config: EntityBodySchemaConfigDto
): IntermediateBodySchemaModel {
  const firstResult = findPropertyInfoByPaths(
    schema,
    config.rootEntityPath.split('.')
  );

  if (firstResult.suitable === false) {
    return {
      config,
      result: createIntermediatePropertyCheckResultDtoToNotSuitable(schema),
    };
  }

  if (
    !config.pathNeeded ||
    config.pathNeeded.length === 0 ||
    isAllPathNeededSuitable(schema, config.pathNeeded)
  ) {
    return {
      config,
      result: firstResult,
    };
  }

  return {
    config,
    result: createIntermediatePropertyCheckResultDtoToNotSuitable(schema),
  };
}

export function parseBodySchema(
  schema: SchemaObject,
  configs: EntityBodySchemaConfigDto[]
) {
  let bodySchema: IntermediateBodySchemaModel;

  const hasSuitableSchema = configs.some((config) => {
    const currResult = parseBodySchemaBySingleConfig(schema, config);

    bodySchema = currResult;

    return currResult.result.suitable;
  });

  if (hasSuitableSchema) {
    return bodySchema;
  }

  return {
    config: createEntityBodySchemaConfigDto(),
    result: createIntermediatePropertyCheckResultDtoToNotSuitable(schema),
  };
}
