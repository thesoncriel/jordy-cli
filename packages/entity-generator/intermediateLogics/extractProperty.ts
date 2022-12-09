import { ReferenceObject, RequestBodyObject, SchemaObject } from 'openapi3-ts';
import { isString } from '../../common/utils';
import { PROPERTY_TYPE_LIST } from '../constants';
import { ContentPropertyType, IntermediatePropertyModel } from '../types';

function getPropertyType(schema: SchemaObject): ContentPropertyType {
  const { type } = schema;
  const targetType = Array.isArray(type)
    ? type.filter((val) => val !== 'null')[0]
    : type;

  if (PROPERTY_TYPE_LIST.includes(targetType as never)) {
    return targetType as ContentPropertyType;
  }

  if (!type && schema.properties) {
    return 'object';
  }

  return 'unknown';
}

function isNullableProperty(raw: SchemaObject) {
  return (
    raw.nullable === true ||
    (Array.isArray(raw.type) && raw.type.includes('null'))
  );
}

function isReferenceObject(raw: unknown): raw is ReferenceObject {
  return isString((raw as ReferenceObject).$ref);
}

function isRequired(required: string[] | undefined, target: string) {
  if (!required || required.length === 0) {
    return true;
  }
  return required.includes(target);
}

export function extractIntermediatePropertyModel(
  name: string,
  raw: SchemaObject | ReferenceObject,
  required = true
) {
  if (isReferenceObject(raw)) {
    // TODO: 레퍼런스 타입일 때 별도 루틴을 수행 해야함 - theson
    const refResult: IntermediatePropertyModel = {
      name,
      type: 'unknown',
      nullable: false,
      required,
      description: '',
      $ref: raw.$ref,
      oneOfProperties: [],
      itemsProperties: [],
    };

    return refResult;
  }

  const result: IntermediatePropertyModel = {
    name,
    type: getPropertyType(raw),
    nullable: isNullableProperty(raw),
    required,
    description: raw.description || '',
    $ref: '',
    oneOfProperties: [],
    itemsProperties: [],
  };

  if (result.type === 'array' && Array.isArray(raw.enum) === false) {
    if ('type' in raw.items) {
      if (raw.items.type === 'object') {
        result.itemsProperties = Object.entries(raw.items.properties).map(
          ([name, rawProperty]) =>
            extractIntermediatePropertyModel(
              name,
              rawProperty,
              isRequired((raw.items as SchemaObject).required, name)
            )
        );
      } else {
        result.itemsType = getPropertyType(raw.items);
      }
    }
  }

  if (result.type === 'object') {
    if (raw.oneOf) {
      result.oneOfProperties = raw.oneOf.map((rawItem: SchemaObject) =>
        extractIntermediatePropertyModel(
          `${name}_${rawItem.description}`,
          rawItem,
          true
        )
      );
    } else {
      result.itemsProperties = Object.entries(raw.properties).map(
        ([name, rawProperty]) =>
          extractIntermediatePropertyModel(
            name,
            rawProperty,
            isRequired(raw.required, name)
          )
      );
    }
  }

  if ((result.type === 'string' || result.type === 'array') && raw.enum) {
    if (raw.enum.every((val) => isString(val)) === false) {
      throw new Error(
        `extractIntermediatePropertyModel: enum found. but some values are not string. enum=[${raw.enum}]`
      );
    }

    result.enum = raw.enum;
  }

  return result;
}

export function extractIntermediateBodyRequest(
  raw?: RequestBodyObject | ReferenceObject
) {
  try {
    const schema = (raw as RequestBodyObject).content['application/json']
      .schema as SchemaObject;

    return Object.entries(schema.properties).map(([name, rawProperty]) => {
      return extractIntermediatePropertyModel(
        name,
        rawProperty,
        schema.required?.includes(name)
      );
    });
  } catch (error) {
    return [];
  }
}
