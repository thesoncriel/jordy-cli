import { EntityModuleModel, IntermediateModuleModel } from '../types';

class EntityModuleConverter {
  constructor() {}
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
