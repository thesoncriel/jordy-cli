import { BaseFeatureFileInfoDto } from '../common';

export type CodeGeneratorComponentsConfigKeyType =
  | 'normal'
  | 'dialog'
  | 'imperative'
  | 'memo';

export type CodeGeneratorStoresConfigKeyType =
  | 'storeSub'
  | 'storeRoot'
  | 'featureRoot'
  | 'srcRoot';

export interface FeatureNameInfoDto extends BaseFeatureFileInfoDto {
  fullName: string;
  fullNameAsPascalCase: string;
  storybookTitle: string;
  featureName: string;
  featureNameAsPascalCase: string;
  subNames: string[];
  subPath: string;
  firstSubName: string;
}

export interface SimpleFileInfoDto {
  fileName: string;
  fileExt: string;
  fileNameAsPascalCase: string;
}

export interface FeatureFileInfoDto
  extends SimpleFileInfoDto,
    FeatureNameInfoDto {}

export interface FilePathParser {
  parse(path: string): FeatureFileInfoDto;
  parse(featureName: string, subName: string): FeatureFileInfoDto;
  parseForComponent(path: string, componentName: string): FeatureFileInfoDto;
  extractFeatureName(path: string): string;
}

export interface CodeGeneratorCLICommand {
  type: 'feat' | 'sub' | 'ui' | 'sb';
  behavior: 'add' | 'rename' | 'auto-title';
  name: string;
  next?: string;
}
