import { CodeGeneratorPathConfigDto, FeatureFileInfoDto } from '../types';

function getConfig() {
  const config: CodeGeneratorPathConfigDto = {
    base: 'src/feat/{{featureName}}/{{subName}}',
    files: [
      {
        fileName: '{{fileName}}Awesome.tsx',
        template: 'test.tsx.handlebars',
        appendLogic: 'whatToDo',
      },
      {
        fileName: '{{fileName}}.tsx',
        template: 'test2.tsx.handlebars',
      },
    ],
  };
  return config;
}

function getConfigForOverwriteTest() {
  const config: CodeGeneratorPathConfigDto = {
    base: 'someSrcPath',
    files: [
      {
        fileName: 'some/already/exists/{{fileName}}.ts',
        template: 'test2.ts.handlebars',
      },
    ],
  };
  return config;
}

function getConfigForAppendTest(hasUnknownAppendLogic = false) {
  const config: CodeGeneratorPathConfigDto = {
    base: 'someSrcPath',
    files: [
      {
        fileName: 'any/already/exists/{{fullName}}.ts',
        template: 'test3.ts.handlebars',
        appendLogic: hasUnknownAppendLogic ? 'unknown' : 'someLogics',
      },
    ],
  };
  return config;
}

function getConfigForNoTemplateTest() {
  const config: CodeGeneratorPathConfigDto = {
    base: 'someSrcPath',
    files: [
      {
        fileName: 'any/already/exists/{{fullName}}.ts',
      },
    ],
  };
  return config;
}

function getFileInfo() {
  const fileInfo: FeatureFileInfoDto = {
    fileName: 'LookpinInput',
    fileExt: 'tsx',
    fileNameAsPascalCase: 'LookpinInput',
    fullName: 'lookpinBestShop',
    fullNameAsPascalCase: 'LookpinBestShop',
    featureName: 'lookpin',
    featureNameAsPascalCase: 'Lookpin',
    subName: 'bestShop',
  };
  return fileInfo;
}

function getConfigForFolderTest() {
  const config: CodeGeneratorPathConfigDto = {
    base: 'someSrcPath/{{featureName}}',
    files: [],
    folders: [
      {
        folderName: 'components',
      },
      {
        folderName: 'containers',
      },
      {
        folderName: 'pages',
      },
      {
        folderName: 'some/{{subName}}/elements',
      },
    ],
  };
  return config;
}

export const codeFileWriterFixtures = {
  getConfig,
  getConfigForOverwriteTest,
  getConfigForAppendTest,
  getFileInfo,
  getConfigForFolderTest,
  getConfigForNoTemplateTest,
};
