import {
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  SchemaObject,
} from 'openapi3-ts';
import {
  EntityBodySchemaConfigDto,
  EntityGeneratorConfigDto,
} from '../../common';
import { HEADER_AUTH_KEYWORD, HTTP_REST_METHOD_LIST } from '../constants';
import {
  extractBaseEntityNameFromPath,
  getRepositoryBehavior,
} from '../manipulates/basic.convert';

import {
  HttpRestAuthTypeEnum,
  HttpRestMethodEnum,
  IntermediateParameterModel,
  IntermediatePathModel,
} from '../types';
import { extractIntermediateParameterModels } from './extractParameters';
import {
  extractIntermediateBodyRequest,
  extractIntermediatePropertyModel,
} from './extractProperty';
import {
  createEntityBodySchemaConfigDto,
  createIntermediatePropertyCheckResultDtoToNotSuitable,
  parseBodySchema,
} from './parseBodySchema';

function extractEndPointSchema(operation: OperationObject) {
  try {
    return operation.responses[200].content['application/json']
      .schema as SchemaObject;
  } catch (error) {
    //
  }
  throw new Error(
    `extractEndPointSchema: cannot extract schema properties from "${JSON.stringify(
      operation
    )}"`
  );
}

export function extractDataPayloadProperties(
  method: HttpRestMethodEnum,
  operation: OperationObject,
  configs: EntityBodySchemaConfigDto[]
) {
  try {
    const rootSchema = extractEndPointSchema(operation);
    const imBodySchema = parseBodySchema(rootSchema, configs);
    const endSchema = imBodySchema.result.endSchema;

    if (!endSchema.properties) {
      console.log(
        `extractDataPayloadProperties: endSchema.properties are empty. - ${JSON.stringify(
          endSchema
        )}`
      );

      return {
        properties: [],
        bodySchema: imBodySchema,
      };
    }
    console.log('\nendSchema - ' + JSON.stringify(endSchema));

    const properties = Object.entries(endSchema.properties).map(
      ([name, rawProperty]) =>
        extractIntermediatePropertyModel(name, rawProperty)
    );

    return {
      properties,
      bodySchema: imBodySchema,
    };
  } catch (error) {
    if (!operation.responses[200].content) {
      return {
        properties: [],
        bodySchema: {
          config: createEntityBodySchemaConfigDto(),
          result: createIntermediatePropertyCheckResultDtoToNotSuitable({}),
        },
      };
    }

    throw error;
  }
}

export function extractToAuthType(
  rawItems?: Array<ParameterObject | ReferenceObject>
) {
  const result = (rawItems || []).reduce((sum, item) => {
    if ('$ref' in item && item.$ref.includes(HEADER_AUTH_KEYWORD)) {
      return sum + 1;
    }
    return sum;
  }, 0);

  return result > 0 ? HttpRestAuthTypeEnum.AUTH : HttpRestAuthTypeEnum.BASE;
}

export function extractToIntermediatePathModel(
  path: string,
  method: HttpRestMethodEnum,
  authType: HttpRestAuthTypeEnum,
  pathParameters: IntermediateParameterModel[],
  data: OperationObject,
  config: EntityGeneratorConfigDto
) {
  // console.log(
  //   `extractToIntermediatePathModel - config.bodySchema : ${JSON.stringify(
  //     config.bodySchema
  //   )}`
  // );
  const queryParameters = extractIntermediateParameterModels(data.parameters);

  const pathData: IntermediatePathModel = {
    path,
    method,
    authType,
    baseName: extractBaseEntityNameFromPath(path, config.apiBasePath),
    behavior: getRepositoryBehavior(path, method),
    description: data.description || data.summary || '',
    parameters: [...pathParameters, ...queryParameters],
    bodyRequestProperties: extractIntermediateBodyRequest(data.requestBody),
    ...extractDataPayloadProperties(method, data, config.bodySchema),
  };

  return pathData;
}

export function extractIntermediatePathModels(
  path: string,
  raw: PathItemObject,
  config: EntityGeneratorConfigDto
) {
  const pathParameters = extractIntermediateParameterModels(raw.parameters);
  const authType = extractToAuthType(raw.parameters);

  return HTTP_REST_METHOD_LIST.reduce((collection, method) => {
    const data = raw[method];

    if (!data) {
      return collection;
    }

    collection.push(
      extractToIntermediatePathModel(
        path,
        method,
        authType,
        pathParameters,
        data,
        config
      )
    );

    return collection;
  }, [] as IntermediatePathModel[]);
}
