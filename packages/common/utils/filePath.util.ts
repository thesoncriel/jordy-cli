import glob from 'glob';
import { PatternedFileReaderConfigDto } from '../types';

function mergePaths(basePath: string, subPath: string) {
  const hasBasePathEndSlash = basePath.endsWith('/');
  const hasSubPathStartSlash = subPath.startsWith('/');

  if (hasBasePathEndSlash && hasSubPathStartSlash) {
    return `${basePath}.${subPath}`;
  }
  if (hasBasePathEndSlash || hasSubPathStartSlash) {
    return `${basePath}${subPath}`;
  }

  return `${basePath}/${subPath}`;
}

function getFilePathsByPattern(path: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(path, (err, paths) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(paths);
    });
  });
}

function getFilePathsWithSubPath(basePath: string, subPath: string) {
  return getFilePathsByPattern(mergePaths(basePath, subPath));
}

export async function getFilePathsWithMultiple({
  folderPath,
  includes,
}: PatternedFileReaderConfigDto) {
  if (Array.isArray(includes)) {
    const prmList = includes.reduce((acc, subPath) => {
      acc.push(getFilePathsWithSubPath(folderPath, subPath));

      return acc;
    }, [] as Array<Promise<string[]>>);

    const result = await Promise.all(prmList);

    return result.flat();
  }

  const singleResult = await getFilePathsByPattern(folderPath);

  return singleResult;
}
