import { toCapitalize } from '../../common';
import {
  DeclarableEntityType,
  EntitySchemaModel,
  EntitySuffixTypeEnum,
  RepositoryBehaviorTypeEnum,
} from '../types';

export function getEntityName(
  baseName: string,
  behavior: RepositoryBehaviorTypeEnum
) {
  return `${toCapitalize(baseName)}${behavior}`;
}

export function findPreDeclaredType(
  preDeclared: Map<string, EntitySchemaModel>,
  targetType: DeclarableEntityType,
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
