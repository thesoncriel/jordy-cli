import { COMMON_FEATURE_NAMES } from './constants';
import { FeatureFileInfo } from './FeatureFileInfo';
import { FeatureNameInfo } from './FeatureNameInfo';
import { FeatureFileInfoDto, FilePathParser } from './types';
import { isString } from './utils';

export class TypeScriptFilePathParser implements FilePathParser {
  static DEFAULT_SUB_NAME = 'basic';

  private commonFeatures: readonly string[] = COMMON_FEATURE_NAMES;

  constructor(
    private featuresFolder = 'features',
    private subLayers = ['components', 'containers', 'stores'],
    private extList = ['ts', 'tsx']
  ) {}

  parseByNames(featureName: string, subName: string): FeatureFileInfoDto {
    const featureNameInfo = new FeatureNameInfo(
      featureName,
      subName || TypeScriptFilePathParser.DEFAULT_SUB_NAME
    );

    return new FeatureFileInfo(featureNameInfo, '').toPlainObject();
  }

  parse(arg0: string, arg1?: string): FeatureFileInfoDto {
    if (isString(arg1) || arguments.length > 1) {
      return this.parseByNames(arg0, arg1 || '');
    }
    const { featureNameInfo, isFile, endPoint } = this.parsePath(arg0);

    return new FeatureFileInfo(
      featureNameInfo,
      isFile ? endPoint : ''
    ).toPlainObject();
  }

  parsePath(path: string) {
    const splittedPath = path.split(/\/|\\/);

    if (splittedPath.length === 1) {
      splittedPath.push(TypeScriptFilePathParser.DEFAULT_SUB_NAME);
    }

    const endPoint = splittedPath[splittedPath.length - 1];
    const isFile = this.extList.some((ext) => endPoint.endsWith(ext));
    const featureName = this.findFeatureNameFrom(splittedPath);
    const subName = this.findSubNameFrom(splittedPath);

    return {
      featureNameInfo: new FeatureNameInfo(featureName, subName),
      endPoint,
      isFile,
    };
  }

  findCommonFeatureNameFrom(splittedPath: string[]) {
    const index = splittedPath.findIndex((value) => {
      return (this.commonFeatures as string[]).includes(value);
    });

    if (index < 1 || splittedPath[index - 1] !== 'src') {
      throw new Error(
        `extract fail - cannot found : "${this.featuresFolder}" or common features.`
      );
    }

    return splittedPath[index];
  }

  findFeatureNameFrom(splittedPath: string[]) {
    const index = splittedPath.indexOf(this.featuresFolder) + 1;

    if (index <= 0) {
      return this.findCommonFeatureNameFrom(splittedPath);
    }

    if (splittedPath.length <= index) {
      throw new Error(`extract fail - incorrect index : ${index}`);
    }

    if (!splittedPath[index]) {
      throw new Error('extract fail - empty path');
    }

    return splittedPath[index];
  }

  extractFeatureName(path: string) {
    return this.findFeatureNameFrom(path.split(/\/|\\/));
  }

  findSubNameFrom(splittedPath: string[]) {
    const values = this.subLayers.reduce((arr, sub) => {
      const index = splittedPath.indexOf(sub) + 1;

      if (index > 0) {
        const value = splittedPath[index];

        if (value && value.includes('.') === false) {
          arr.push(value);
        }
      }

      return arr;
    }, [] as string[]);

    if (values.length === 0) {
      throw new Error('extract fail - sub name not found');
    }

    return values[0];
  }

  tryFindSubNameFrom(splitPath: string[]) {
    try {
      return this.findSubNameFrom(splitPath);
    } catch (error) {
      return TypeScriptFilePathParser.DEFAULT_SUB_NAME;
    }
  }

  parseForComponent(path: string, componentName: string) {
    const splitPath = path.split(/\/|\\/);
    let featureNameInfo;

    if (splitPath.length <= 2) {
      featureNameInfo = new FeatureNameInfo(
        splitPath[0],
        splitPath[1] || TypeScriptFilePathParser.DEFAULT_SUB_NAME
      );
    } else {
      const featureName = this.findFeatureNameFrom(splitPath);
      const subName = this.tryFindSubNameFrom(splitPath);

      featureNameInfo = new FeatureNameInfo(featureName, subName);
    }

    return new FeatureFileInfo(
      featureNameInfo,
      `${componentName}.tsx`
    ).toPlainObject();
  }
}
