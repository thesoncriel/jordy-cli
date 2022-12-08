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
