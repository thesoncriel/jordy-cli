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
  parseForComponent(path: string, componentName: string): FeatureFileInfoDto;
  extractFeatureName(path: string): string;
}

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

export interface CodeGeneratorFileConfigDto {
  fileName: string;
  excludes?: string[];
  template?: string;
  appendLogic?: string;
}

export interface CodeGeneratorFolderConfigDto {
  excludes?: string[];
  folderName: string;
}

export interface CodeGeneratorPathConfigDto {
  base: string;
  files: CodeGeneratorFileConfigDto[];
  excludes?: string[];
  folders?: CodeGeneratorFolderConfigDto[];
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

export interface DirectoryMakerFn {
  (targetPath: string): Promise<boolean>;
}
