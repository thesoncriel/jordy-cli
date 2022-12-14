import {
  EntityModuleModel,
  EntitySchemaModel,
  EntitySuffixTypeEnum,
  IntermediateModuleModel,
  IntermediatePathModel,
  IntermediatePropertyModel,
} from '../types';
import { toEntitySchemaModel } from './toEntitySchemaModel';

function convertPathModelToPropertyModel(pathModel: IntermediatePathModel) {
  const result: IntermediatePropertyModel = {
    name: '',
    type: 'object',
    nullable: false,
    required: true,
    description: pathModel.description,
    $ref: '',
    itemsProperties: pathModel.properties,
    oneOfProperties: [],
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

  const preDeclared = new Map<string, EntitySchemaModel>();

  const entities = data.paths.map((pathModel) => {
    return toEntitySchemaModel(
      convertPathModelToPropertyModel(pathModel),
      pathModel,
      pathModel.baseName,
      EntitySuffixTypeEnum.ENTITY,
      preDeclared
    );
  });

  result.entities = Array.from(preDeclared.values());
  result.entities.push(...entities);

  return result;
}
