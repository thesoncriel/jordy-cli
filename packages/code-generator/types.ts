export interface FeatureNameInfoDto {
  fullName: string;
  fullNameAsPascalCase: string;
  featureName: string;
  featureNameAsPascalCase: string;
  subName: string;
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
}

export interface CodeGeneratorConfigModel {
  module: CodeGeneratorModuleConfigDto;
}

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

export interface CodeGeneratorModuleConfigDto {
  name: string;
  stores: Record<CodeGeneratorStoresConfigKeyType, CodeGeneratorPathConfigDto>;
  components: Record<
    CodeGeneratorComponentsConfigKeyType,
    CodeGeneratorPathConfigDto
  >;
  storybook: Record<
    Exclude<CodeGeneratorComponentsConfigKeyType, 'memo'>,
    CodeGeneratorPathConfigDto
  >;
}

export interface CodeGeneratorPathConfigDto {
  base: string;
  files: CodeGeneratorFileConfigDto[];
}

export interface CodeGeneratorFileConfigDto {
  fileName: string;
  template: string;
  appendLogic?: string;
}

export interface CodeGeneratorCLICommand {
  type: 'feat' | 'sub' | 'ui' | 'sb';
  behavior: 'add' | 'rename' | 'auto-title';
  name: string;
  next?: string;
}

export interface TemplateCompiler<T = FeatureFileInfoDto> {
  (templateText: string, data: T): Promise<string>;
}

export interface TextFileReaderFn {
  (targetPath: string): Promise<string>;
}

export interface TextFileWriterFn {
  (
    targetPath: string,
    source: string,
    forceOverwrite: boolean
  ): Promise<boolean>;
}

export interface TextFileAppendFn<T = FeatureFileInfoDto> {
  (
    targetPath: string,
    nextSourceCode: string,
    data: T,
    logic: string
  ): Promise<boolean>;
}

export interface AppendLogicDictionaryModel<T = FeatureFileInfoDto> {
  [name: string]: (prevCode: string, nextSourceCode: string, data: T) => string;
}
