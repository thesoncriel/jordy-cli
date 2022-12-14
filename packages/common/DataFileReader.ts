import {
  PatternedFilePathGetterFn,
  PatternedFileReaderConfigDto,
  TextFileReaderFn,
} from './types';
import { getFileNameExcludeExt } from './utils/common.util';

export interface DataFileReader<T> {
  readByPattern(config: PatternedFileReaderConfigDto): Promise<Map<string, T>>;
}

export class YamlDataFileReader<T> implements DataFileReader<T> {
  constructor(
    private readFile: TextFileReaderFn,
    private getFilePath: PatternedFilePathGetterFn,
    private yamlParser: (yaml: string) => Promise<T>
  ) {}

  async readByPattern(
    config: PatternedFileReaderConfigDto
  ): Promise<Map<string, T>> {
    const paths = await this.getFilePath(config);
    const prmList = paths.map((path) =>
      this.readFile(path).then((yaml) => this.yamlParser(yaml))
    );
    const yamlData = await Promise.all(prmList);

    return paths.reduce((map, path, index) => {
      map.set(getFileNameExcludeExt(path), yamlData[index]);

      return map;
    }, new Map<string, T>());
  }
}
