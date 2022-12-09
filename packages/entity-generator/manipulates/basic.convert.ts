import {
  hasPathParameter,
  isString,
  snakeToCamel,
  toCapitalize,
} from '../../common';
import {
  EntityModuleNameModel,
  HttpRestMethodEnum,
  RepositoryBehaviorTypeEnum,
} from '../types';

export function extractEntityModuleNameModel(
  title: string
): EntityModuleNameModel {
  let version = '';
  const splittedTitle = title
    .replace(/^(v1|v2|v3|v4|v5)_/, (match) => {
      version = match.replace('_', '');

      return '';
    })
    .split('_');
  const featureName = splittedTitle[0];
  const featureNameAsPascalCase = toCapitalize(featureName);
  const fullName = snakeToCamel(splittedTitle.join('_'));
  const fullNameAsPascalCase = toCapitalize(fullName);

  return {
    version,
    fullName,
    featureName,
    fullNameAsPascalCase,
    featureNameAsPascalCase,
  };
}

export function extractBaseEntityNameFromPath(
  path: string,
  removeKeyword?: string
) {
  let tmpPath = isString(removeKeyword)
    ? path.replace(new RegExp(removeKeyword), '')
    : path;

  tmpPath = tmpPath.replace(/\{[0-9A-z-_]+\}/gi, '');
  tmpPath = tmpPath.replace(/^\/|\/$/g, '');
  tmpPath = snakeToCamel(tmpPath);

  return toCapitalize(tmpPath);
}

export function mergeDescriptions(...args: string[]) {
  return args
    .reduce((acc, arg) => {
      if (arg) {
        acc.push(arg);
      }

      return acc;
    }, [] as string[])
    .join('\n');
}

const repositoryBehaviorGetterDic: Record<
  HttpRestMethodEnum,
  (path: string) => RepositoryBehaviorTypeEnum
> = {
  [HttpRestMethodEnum.GET]: (path: string) => {
    return hasPathParameter(path)
      ? RepositoryBehaviorTypeEnum.DETAIL
      : RepositoryBehaviorTypeEnum.SEARCH;
  },
  [HttpRestMethodEnum.POST]: (path: string) => {
    return path.includes('upload')
      ? RepositoryBehaviorTypeEnum.UPLOAD
      : RepositoryBehaviorTypeEnum.CREATE;
  },
  [HttpRestMethodEnum.PUT]: () => {
    return RepositoryBehaviorTypeEnum.UPDATE;
  },
  [HttpRestMethodEnum.PATCH]: () => {
    return RepositoryBehaviorTypeEnum.UPDATE;
  },
  [HttpRestMethodEnum.DELETE]: () => {
    return RepositoryBehaviorTypeEnum.DELETE;
  },
};

export function getRepositoryBehavior(
  path: string,
  method: HttpRestMethodEnum
) {
  try {
    return repositoryBehaviorGetterDic[method](path);
  } catch (error) {
    //
  }
  throw new Error(`getRepositoryBehavior: invalid method: "${method}"`);
}

// export function getEntityName(
//   basePath: string,
//   path: string,
//   method: HttpRestMethodEnum
// ) {
//   const moduleNameInfo = extractEntityModuleNameModel(basePath, path);

//   const behavior = getRepositoryBehavior(path, method);
// }
