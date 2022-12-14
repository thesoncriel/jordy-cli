import { isString } from '../common';
import { COMMON_FEATURE_NAMES } from './constants';
import { FeatureFileInfo } from './FeatureFileInfo';
import { FeatureNameInfo } from './FeatureNameInfo';
import {
  FeatureFileInfoDto,
  FeatureNameInfoDto,
  FilePathParser,
} from './types';

export class TypeScriptFilePathParser implements FilePathParser {
  static DEFAULT_SUB_NAME = 'basic';

  private commonFeatures: readonly string[] = COMMON_FEATURE_NAMES;

  constructor(
    private featuresFolder = 'features',
    private subLayers = ['components', 'containers', 'stores'],
    private extList = ['ts', 'tsx']
  ) {}

  parseByNames(featureName: string, subNames: string[]): FeatureFileInfoDto {
    const featureNameInfo = new FeatureNameInfo(featureName, subNames);

    return new FeatureFileInfo(featureNameInfo, '').toPlainObject();
  }

  parse(arg0: string, arg1?: string): FeatureFileInfoDto {
    if (isString(arg1) || arguments.length > 1) {
      return this.parseByNames(arg0, arg1 ? arg1.split('/') : []);
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
    const subName = this.findSubNamesFrom(splittedPath);

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

  findSubNamesBySubLayer(subLayer: string, splittedPath: string[]) {
    const firstSubNameIndex = splittedPath.indexOf(subLayer) + 1;
    const firstSubName = splittedPath[firstSubNameIndex];
    let lastSubNameIndex = splittedPath.length - 1;
    const lastSubName = splittedPath[lastSubNameIndex] || '';
    const isComponents = subLayer === 'components' && firstSubNameIndex > 0;

    if (!lastSubName || (lastSubName && lastSubName.includes('.'))) {
      lastSubNameIndex = lastSubNameIndex - 1;
    }

    if (firstSubNameIndex === 0 || lastSubNameIndex < 1) {
      return { isComponents, subNames: [] };
    }

    if (firstSubNameIndex === lastSubNameIndex) {
      return { isComponents, subNames: [firstSubName] };
    }

    return {
      isComponents,
      subNames: splittedPath.slice(firstSubNameIndex, lastSubNameIndex + 1),
    };
  }

  findSubNamesFrom(splittedPath: string[]) {
    let isComponents = false;
    const values = this.subLayers.reduce((arr, subLayer) => {
      const foundItem = this.findSubNamesBySubLayer(subLayer, splittedPath);

      if (foundItem.isComponents && !isComponents) {
        isComponents = true;
      }

      if (foundItem.subNames.length > 0) {
        arr.push(foundItem.subNames);
      }

      return arr;
    }, [] as string[][]);

    if (values.length === 0) {
      if (isComponents) {
        return [];
      }
      throw new Error('extract fail - sub name not found');
    }

    return values[0];
  }

  tryFindSubNameFrom(splitPath: string[]) {
    try {
      return this.findSubNamesFrom(splitPath);
    } catch (error) {
      return [];
    }
  }

  parseForComponent(path: string, componentName: string) {
    const splitPath = path.split(/\/|\\/);
    let featureNameInfo: FeatureNameInfoDto;

    if (splitPath.length === 2 && !splitPath[1]) {
      splitPath.pop();
    }

    if (splitPath.length === 2) {
      featureNameInfo = new FeatureNameInfo(splitPath[0], [splitPath[1]]);
    } else if (splitPath.length < 2) {
      featureNameInfo = new FeatureNameInfo(splitPath[0]);
    } else {
      const featureName = this.findFeatureNameFrom(splitPath);
      const subNames = this.tryFindSubNameFrom(splitPath);

      featureNameInfo = new FeatureNameInfo(featureName, subNames);
    }

    return new FeatureFileInfo(
      featureNameInfo,
      `${componentName}.tsx`
    ).toPlainObject();
  }
}
