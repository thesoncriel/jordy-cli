/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CodeGeneratorComponentsConfigKeyType,
  CodeGeneratorStoresConfigKeyType,
} from '../code-generator';

export interface TemplateCompiler<T = any> {
  (templateText: string, data: T): Promise<string>;
}

export interface TextFileReaderFn {
  (targetPath: string): Promise<string>;
}

export interface CodeGeneratorFolderConfigDto {
  folderName: string;
  excludes?: string[];
}

export interface TextFileWriterFn {
  (
    targetPath: string,
    source: string,
    forceOverwrite: boolean
  ): Promise<boolean>;
}

export interface DirectoryMakerFn {
  (targetPath: string): Promise<boolean>;
}

export interface BaseFeatureFileInfoDto {
  featureName: string;
}

export interface CodeGeneratorFileConfigDto {
  fileName: string;
  excludes?: string[];
  template?: string;
  appendLogic?: string;
}

export interface CodeGeneratorPathConfigDto {
  base: string;
  files: CodeGeneratorFileConfigDto[];
  excludes?: string[];
  folders?: CodeGeneratorFolderConfigDto[];
}

export interface TextFileAppendFn<T = any> {
  (
    targetPath: string,
    nextSourceCode: string,
    data: T,
    logic: string
  ): Promise<boolean>;
}

export interface AppendLogicDictionaryModel<T = any> {
  [name: string]: (prevCode: string, nextSourceCode: string, data: T) => string;
}

export interface EntityBodySchemaConfigDto {
  desc: string;
  typeName: string;
  import: string;
  rootEntityPath: string;
  pathNeeded: string[];
}

export interface PatternedFileReaderConfigDto {
  folderPath: string;
  includes?: string[];
}

export interface PatternedFilePathGetterFn {
  (config: PatternedFileReaderConfigDto): Promise<string[]>;
}

export interface EntityGeneratorConfigDto {
  apiBasePath: string[];
  openApi: PatternedFileReaderConfigDto;
  entity: CodeGeneratorPathConfigDto;
  bodySchema: EntityBodySchemaConfigDto[];
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
  core: EntityGeneratorConfigDto;
}
