import { Command } from 'commander';
import fs from 'fs/promises';
import { CLI_ASSETS_NAME } from './constants';
import { createCodeFileWriterService, createFilePathParser } from './factory';
import {
  CodeGeneratorComponentsConfigKeyType,
  CodeGeneratorModuleConfigDto,
  StorybookKeyType,
} from './types';
import { getStorybookKey } from './getStorybookKey';

async function getDefaultConfig() {
  const jsonConfig = await fs.readFile(
    `${__dirname}/../${CLI_ASSETS_NAME}/config.json`,
    {
      encoding: 'utf8',
    },
  );

  return JSON.parse(jsonConfig) as CodeGeneratorModuleConfigDto;
}

function getSnippetsFilePath() {
  const basePath = `${__dirname}/../${CLI_ASSETS_NAME}/snippets`;
  const fileNames = [
    'typescript.code-snippets',
    'typescriptreact.code-snippets',
  ];

  return fileNames.map((fileName) => {
    return {
      src: `${basePath}/${fileName}`,
      dest: `./.vscode/${fileName}`,
    };
  });
}

export default async function codeGeneratorCLI() {
  const program = new Command();
  const service = createCodeFileWriterService();
  const defConfig = await getDefaultConfig();

  program
    .command('feat')
    .argument('<name>', 'feature name')
    .argument('[sub]', 'sub-feature name')
    .action((name, sub) => {
      const fileInfo = createFilePathParser().parse(name, sub);

      service.makeAll(defConfig.stores.storeRoot, fileInfo);
      service.makeAll(defConfig.stores.storeSub, fileInfo);
      service.makeAll(defConfig.stores.featureRoot, fileInfo);
      service.makeAll(defConfig.stores.srcRoot, fileInfo);

      console.log('feat', name, sub, fileInfo);
    });

  program
    .command('sub')
    .argument('<path>', 'feature folder path')
    .argument('<name>', 'sub-feature name')
    .action((path, name) => {
      const parser = createFilePathParser();
      const featureName = parser.extractFeatureName(path);
      const fileInfo = parser.parse(featureName, name);

      service.makeAll(defConfig.stores.storeRoot, fileInfo);
      service.makeAll(defConfig.stores.storeSub, fileInfo);
      service.makeAll(defConfig.stores.featureRoot, fileInfo);
      service.makeAll(defConfig.stores.srcRoot, fileInfo);

      console.log('sub', path, name, fileInfo);
    });

  program
    .command('ui')
    .argument('<path>', 'component path or feature name (ex: lookpin/search)')
    .argument('<name>', 'ui-component name')
    .argument(
      '[type]',
      'one of normal, dialog, dialogWithResolver, imperative, memo, antdTable (default normal)',
    )
    .action((path, name, type) => {
      const parser = createFilePathParser();
      const fileInfo = parser.parseForComponent(path, name);
      const componentKey: CodeGeneratorComponentsConfigKeyType =
        type in defConfig.components ? type : 'normal';
      const storybookKey = getStorybookKey(componentKey);

      service.makeAll(defConfig.components[componentKey], fileInfo);
      service.makeAll(defConfig.storybook[storybookKey], fileInfo);

      console.log('ui', path, name, fileInfo);
    });

  program
    .command('sb')
    .argument('<path>', 'component path')
    .argument('[type]', 'one of normal, dialog, imperative (default normal)')
    .action((path, type) => {
      const parser = createFilePathParser();
      const fileInfo = parser.parse(path);
      const storybookKey: StorybookKeyType =
        type in defConfig.storybook ? type : 'normal';

      service.makeAll(defConfig.storybook[storybookKey], fileInfo);

      console.log('sb', path, type, fileInfo);
    });

  program.command('snippets').action(async () => {
    await fs.mkdir('./.vscode', { recursive: true });
    await Promise.all(
      getSnippetsFilePath().map(({ src, dest }) => fs.copyFile(src, dest)),
    );

    console.log('snippets - copy success!');
  });

  program.parse(process.argv);
}
