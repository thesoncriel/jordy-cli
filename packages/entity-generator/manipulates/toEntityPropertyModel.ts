import {
  IntermediatePropertyModel,
  EntityPropertyModel,
  SubTypeCallbackType,
  ContentPropertyType,
} from '../types';

function getter(
  prop: IntermediatePropertyModel,
  type: ContentPropertyType,
  subTypeCallback: SubTypeCallbackType
) {
  if (type === 'object') {
    return subTypeCallback('object', prop);
  }
  if (type === 'string' && Array.isArray(prop.enum)) {
    return subTypeCallback('enum', prop);
  }
  if (type === 'number' || type === 'integer') {
    return 'number';
  }
  if (type) {
    return type;
  }

  return 'unknown';
}

function getPropertyType(
  prop: IntermediatePropertyModel,
  subTypeCallback: SubTypeCallbackType
) {
  if (prop.type === 'array') {
    // TODO: 2차원 배열일 경우 문자열만 지원함. 다른 타입이 필요하면 기능 수정 할 것 - theson
    if (prop.itemsType === 'array') {
      return 'string[]';
    }

    return getter(prop, prop.itemsType, subTypeCallback);
  }

  return getter(prop, prop.type, subTypeCallback);
}

export function toEntityPropertyModel(
  prop: IntermediatePropertyModel,
  subTypeCallback: SubTypeCallbackType
): EntityPropertyModel {
  const isArrayType = prop.type === 'array';
  let type = getPropertyType(prop, subTypeCallback);

  if (isArrayType) {
    type = type + '[]';
  }

  const result: EntityPropertyModel = {
    name: prop.name,
    type,
    nullable: prop.nullable,
    required: prop.required,
    description: prop.description,
  };

  return result;
}
