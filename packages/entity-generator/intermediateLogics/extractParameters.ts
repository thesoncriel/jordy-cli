import { isString } from 'lodash-es';
import { ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts';
import { PARAMETER_TYPE_LIST } from '../constants';
import { IntermediateParameterModel, ParameterPropertyType } from '../types';
import { extractParameterEnumValues } from './extractCommon';

function refineParameterType(value: unknown): value is ParameterPropertyType {
  return PARAMETER_TYPE_LIST.includes(value as ParameterPropertyType);
}

export function extractParameterSchemaType(
  raw: ReferenceObject | SchemaObject
): ParameterPropertyType {
  if ('type' in raw && isString(raw.type) && refineParameterType(raw.type)) {
    return raw.type;
  }
  // TODO: 파라미터 타입에 기본형 외 다른 타입이 필요하다면 추가 작업 할 것 - theson
  return 'unknown';
}

export function extractParameterDefaultValue(
  raw: ReferenceObject | SchemaObject
) {
  if ('default' in raw) {
    return raw.default || '';
  }
  return '';
}

export function toIntermediateParameterModel(raw: ParameterObject) {
  const result: IntermediateParameterModel = {
    type: extractParameterSchemaType(raw.schema),
    in: raw.in === 'path' ? 'path' : 'query',
    name: raw.name,
    required: raw.required === true,
    description: raw.description || '',
    enum: extractParameterEnumValues(raw.schema),
    default: extractParameterDefaultValue(raw.schema),
  };

  return result;
}

export function extractIntermediateParameterModels(
  rawItems?: Array<ParameterObject | ReferenceObject>
): IntermediateParameterModel[] {
  return (rawItems || []).reduce((collection, item) => {
    if ('schema' in item) {
      collection.push(toIntermediateParameterModel(item));
    }
    return collection;
  }, [] as IntermediateParameterModel[]);
}
