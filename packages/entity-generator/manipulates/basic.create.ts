import {
  HttpRestAuthTypeEnum,
  HttpRestMethodEnum,
  IntermediatePathModel,
  RepositoryBehaviorTypeEnum,
} from '../types';

export function createIntermediatePathModel() {
  const result: IntermediatePathModel = {
    path: '',
    baseName: '',
    method: HttpRestMethodEnum.GET,
    behavior: RepositoryBehaviorTypeEnum.SEARCH,
    authType: HttpRestAuthTypeEnum.PUBLIC,
    description: '',
    parameters: [],
    bodySchema: undefined,
    bodyRequestProperties: [],
    properties: [],
  };

  return result;
}

export function createPropertiesByEnum(enumValues: string[]) {
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
