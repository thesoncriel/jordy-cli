import { snakeToCamel, toCapitalize } from '../../common';
import {
  EntityModuleModel,
  EntitySchemaModel,
  EntitySchemaTypeEnum,
  EntitySuffixTypeEnum,
  IntermediateModuleModel,
  IntermediatePathModel,
  IntermediatePropertyModel,
  RepositoryBehaviorTypeEnum,
} from '../types';
import { toEntityPropertyModel } from './toEntityPropertyModel';

const UNION_ENUM_BRANCH_CONDITION_LENGTH = 2;

class EntityModuleConverter {
  constructor() {}
}

export function getEntityName(
  baseName: string,
  behavior: RepositoryBehaviorTypeEnum
) {
  return `${toCapitalize(baseName)}${behavior}`;
}

function findPreDeclaredType(
  preDeclared: Map<string, EntitySchemaModel>,
  targetType: 'object' | 'enum' | 'union',
  entityBaseNameWithBehavior: string
): EntitySchemaModel | null {
  const suffix =
    targetType === 'object'
      ? EntitySuffixTypeEnum.ENTITY
      : targetType === 'enum'
      ? EntitySuffixTypeEnum.ENUM
      : EntitySuffixTypeEnum.UNION;

  const entityName = entityBaseNameWithBehavior + suffix;
  const alreadyEntity = preDeclared.get(entityName);

  if (!alreadyEntity && targetType === 'enum') {
    return findPreDeclaredType(
      preDeclared,
      'union',
      entityBaseNameWithBehavior
    );
  }

  return alreadyEntity;
}

function makePropertiesByEnum(enumValues: string[]) {
  return enumValues.map((name) => {
    return {
      name,
      type: 'string',
      nullable: false,
      required: true,
      description: '',
    };
  });
}

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

export function toEntitySchemaModel(
  property: IntermediatePropertyModel,
  pathInfo: IntermediatePathModel,
  baseName: string,
  suffix: EntitySuffixTypeEnum,
  preDeclared: Map<string, EntitySchemaModel>
  // TODO: 행위명 위치를 바꿔야 할 때 아래 인수를 이용하도록 기능 추가 할 것 - theson
  // behaviorNamePlacement: 'middle' | 'right' = 'right'
) {
  const isRootEntity = pathInfo.baseName === baseName;
  const properties = property.itemsProperties;
  let entityProperties = properties.map((prop) =>
    toEntityPropertyModel(prop, (targetType) => {
      const middleName = toCapitalize(snakeToCamel(prop.name));
      const entityBaseName = `${baseName}${middleName}`;
      const entityBaseNameWithBehavior = getEntityName(
        entityBaseName,
        pathInfo.behavior
      );

      const alreadyType = findPreDeclaredType(
        preDeclared,
        targetType,
        entityBaseNameWithBehavior
      );

      if (alreadyType) {
        return alreadyType.name;
      }

      const newType = toEntitySchemaModel(
        prop,
        pathInfo,
        entityBaseName,
        targetType === 'object'
          ? EntitySuffixTypeEnum.ENTITY
          : EntitySuffixTypeEnum.ENUM,
        preDeclared
      );

      preDeclared.set(newType.name, newType);

      return newType.name;
    })
  );

  if (property.enum) {
    entityProperties = makePropertiesByEnum(property.enum);
  }

  const description = isRootEntity ? pathInfo.description : '';
  const finalInfo = getFinalTypeAndSuffix(property.enum, suffix);
  const name =
    (isRootEntity
      ? getEntityName(baseName, pathInfo.behavior)
      : toCapitalize(baseName)) + finalInfo.suffix;

  const result: EntitySchemaModel = {
    name,
    type: finalInfo.type,
    properties: entityProperties,
    description,
  };

  return result;
}

export function toEntityModuleModel(data: IntermediateModuleModel) {
  const result: EntityModuleModel = {
    imports: [],
    entities: [],
    fullName: data.fullName,
    featureName: data.featureName,
    version: data.version,
    fullNameAsPascalCase: data.fullNameAsPascalCase,
    featureNameAsPascalCase: data.featureNameAsPascalCase,
  };

  // data.paths[0].

  return result;
}
