import { YamlDataFileReader } from './DataFileReader';
import { getFilePathsWithMultiple, readFile } from './utils';
import yaml from 'js-yaml';

export function createDataFileReader<T>() {
  return new YamlDataFileReader<T>(readFile, getFilePathsWithMultiple, (val) =>
    Promise.resolve(yaml.load(val) as T)
  );
}
