import { CodeGeneratorPathConfigDto, FeatureFileInfoDto } from '../types';
import { toCapitalize } from '../utils';

function getConfig(
  parentExcludes: string[] = [],
  childExcludes: string[] = []
) {
  const config: CodeGeneratorPathConfigDto = {
    base: 'src/{{withFeature featureName}}/{{firstSubName}}',
    excludes: parentExcludes,
    files: [
      {
        fileName: '{{fileName}}Awesome.tsx',
        template: 'test.tsx.handlebars',
        appendLogic: 'whatToDo',
      },
      {
        excludes: childExcludes,
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
    subNames: ['bestShop'],
    subPath: 'bestShop',
    firstSubName: 'bestShop',
    storybookTitle: '',
  };
  return fileInfo;
}

function getSharedModuleInfo(
  featureName = 'shared',
  subNames = ['memberInfo'],
  fileName = 'SortableList.tsx'
) {
  const featureNameAsPascalCase = toCapitalize(featureName);
  const splittedFileName = fileName.split('.');

  const fileInfo: FeatureFileInfoDto = {
    fileName: splittedFileName[0],
    fileExt: splittedFileName[1],
    fileNameAsPascalCase: splittedFileName[0],
    fullName: `${featureName}${toCapitalize(subNames)}`,
    fullNameAsPascalCase: `${featureNameAsPascalCase}${toCapitalize(subNames)}`,
    featureName,
    featureNameAsPascalCase,
    subNames,
    subPath: subNames.join('/'),
    firstSubName: subNames[0],
    storybookTitle: '',
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
        folderName: 'some/{{subPath}}/elements',
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
  getSharedModuleInfo,
  getConfigForFolderTest,
  getConfigForNoTemplateTest,
};
