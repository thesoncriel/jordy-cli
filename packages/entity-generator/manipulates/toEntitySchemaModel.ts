import { toPascalCase, toCapitalize } from '../../common';
import { UNION_ENUM_BRANCH_CONDITION_LENGTH } from '../constants';
import {
  EntitySuffixTypeEnum,
  EntitySchemaTypeEnum,
  IntermediatePropertyModel,
  IntermediatePathModel,
  EntitySchemaModel,
  DeclarableEntityType,
} from '../types';
import { createPropertiesByEnum } from './basic.create';
import { toEntityPropertyModel } from './toEntityPropertyModel';
import { getEntityName, findPreDeclaredType } from './utils';

function getFinalTypeAndSuffix(
  enumValues: string[],
  defSuffix: EntitySuffixTypeEnum
) {
  let type = EntitySchemaTypeEnum.INTERFACE;
  let suffixValue = defSuffix;

  if (enumValues) {
    if (enumValues.length > UNION_ENUM_BRANCH_CONDITION_LENGTH) {
      type = EntitySchemaTypeEnum.ENUM;
      suffixValue = EntitySuffixTypeEnum.ENUM;
    } else {
      type = EntitySchemaTypeEnum.UNION;
      suffixValue = EntitySuffixTypeEnum.UNION;
    }
  }

  return {
    type,
    suffix: suffixValue,
  };
}

const makeSubEntityCurried =
  (
    property: IntermediatePropertyModel,
    pathInfo: IntermediatePathModel,
    baseName: string,
    preDeclared: Map<string, EntitySchemaModel>
  ) =>
  (targetType: DeclarableEntityType) => {
    const middleName = toPascalCase(property.name);
    const entityBaseName = `${baseName}${middleName}`;
    const entityBaseNameWithBehavior = getEntityName(
      entityBaseName,
      pathInfo.behavior
    );

    const alreadyDeclaredType = findPreDeclaredType(
      preDeclared,
      targetType,
      entityBaseNameWithBehavior
    );

    if (alreadyDeclaredType) {
      return alreadyDeclaredType.name;
    }

    const newType = toEntitySchemaModel(
      property,
      pathInfo,
      entityBaseName,
      targetType === 'object'
        ? EntitySuffixTypeEnum.ENTITY
        : EntitySuffixTypeEnum.ENUM,
      preDeclared
    );

    preDeclared.set(newType.name, newType);

    return newType.name;
  };

export function toEntitySchemaModel(
  property: IntermediatePropertyModel,
  pathInfo: IntermediatePathModel,
  baseEntityName: string,
  suffix: EntitySuffixTypeEnum,
  preDeclared: Map<string, EntitySchemaModel>
) {
  const isRootEntity = pathInfo.baseName === baseEntityName;
  const properties = property.itemsProperties;
  const entityProperties = property.enum
    ? createPropertiesByEnum(property.enum)
    : properties.map((prop) =>
        toEntityPropertyModel(
          prop,
          makeSubEntityCurried(prop, pathInfo, baseEntityName, preDeclared)
        )
      );

  const description = isRootEntity ? pathInfo.description : '';
  const finalInfo = getFinalTypeAndSuffix(property.enum, suffix);
  const name =
    (isRootEntity
      ? getEntityName(baseEntityName, pathInfo.behavior)
      : toCapitalize(baseEntityName)) + finalInfo.suffix;

  const result: EntitySchemaModel = {
    name,
    type: finalInfo.type,
    properties: entityProperties,
    description,
  };

  return result;
}
