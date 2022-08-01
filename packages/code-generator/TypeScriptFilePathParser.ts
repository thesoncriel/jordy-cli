import { FeatureFileInfo } from './FeatureFileInfo';
import { FeatureNameInfo } from './FeatureNameInfo';
import { FeatureFileInfoDto, FilePathParser } from './types';
import { isString } from './utils';

export class TypeScriptFilePathParser implements FilePathParser {
  static DEFAULT_SUB_NAME = 'basic';
  private subLayerDic = {} as Record<string, boolean>;

  constructor(
    private featuresFolder = 'features',
    private subLayers = ['components', 'stores'],
    private extList = ['ts', 'tsx']
  ) {
    this.subLayerDic = subLayers.reduce((acc, sub) => {
      acc[sub] = true;

      return acc;
    }, this.subLayerDic);
  }

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
    const path = arg0;
    const splittedPath = path.split(/\/|\\/);

    if (splittedPath.length === 1) {
      splittedPath.push(TypeScriptFilePathParser.DEFAULT_SUB_NAME);
    }

    const endPoint = splittedPath[splittedPath.length - 1];
    const isFile = this.extList.some((ext) => endPoint.endsWith(ext));
    const featureName = this.extractFeatureName(splittedPath);
    const subName = this.extractSubName(splittedPath);
    const featureNameInfo = new FeatureNameInfo(featureName, subName);

    return new FeatureFileInfo(
      featureNameInfo,
      isFile ? endPoint : ''
    ).toPlainObject();
  }

  extractFeatureName(splittedPath: string[]) {
    const index = splittedPath.indexOf(this.featuresFolder) + 1;

    if (index <= 0) {
      throw new Error(`extract fail - cannot found : "${this.featuresFolder}"`);
    }

    if (splittedPath.length <= index) {
      throw new Error(`extract fail - incorrect index : ${index}`);
    }

    if (!splittedPath[index]) {
      throw new Error('extract fail - empty path');
    }

    return splittedPath[index];
  }

  extractSubName(splittedPath: string[]) {
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
}
