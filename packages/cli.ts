import { Command } from 'commander';
import fs from 'fs/promises';
import { appendLogics } from './code-generator/appendLogics';
import { createFilePathParser } from './code-generator/factory';
import './code-generator/handlebarsHelpers';
import './entity-generator/handlebarsHelpers';
import { CodeGeneratorComponentsConfigKeyType } from './code-generator';
import {
  CLI_ASSETS_NAME,
  CodeGeneratorModuleConfigDto,
  createCodeFileWriterService,
  createDataFileReader,
} from './common';
import { createOpenApi3Parser } from './entity-generator';
import { OpenAPIObject } from 'openapi3-ts';

async function getDefaultConfig() {
  const jsonConfig = await fs.readFile(
    `${__dirname}/../${CLI_ASSETS_NAME}/config.json`,
    {
      encoding: 'utf8',
    }
  );

  return JSON.parse(jsonConfig) as CodeGeneratorModuleConfigDto;
}

export default async function codeGeneratorCLI() {
  const program = new Command();
  const service = createCodeFileWriterService(appendLogics);
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
      'one of normal, dialog, imperative, memo (default normal)'
    )
    .action((path, name, type) => {
      const parser = createFilePathParser();
      const fileInfo = parser.parseForComponent(path, name);
      const componentKey: CodeGeneratorComponentsConfigKeyType =
        type in defConfig.components ? type : 'normal';
      const storybookKey: Exclude<
        CodeGeneratorComponentsConfigKeyType,
        'memo'
      > = componentKey === 'memo' ? 'normal' : componentKey;

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
      const storybookKey: Exclude<
        CodeGeneratorComponentsConfigKeyType,
        'memo'
      > = type in defConfig.storybook ? type : 'normal';

      service.makeAll(defConfig.storybook[storybookKey], fileInfo);

      console.log('sb', path, type, fileInfo);
    });

  program.command('entity').action(async () => {
    const reader = createDataFileReader<OpenAPIObject>();
    const parser = createOpenApi3Parser(defConfig.core);

    const openApiData = await reader.readByPattern(defConfig.core.openApi);

    parser
      .parseAll(openApiData)
      .map((datum) => service.makeAll(defConfig.core.entity, datum));
  });

  program.parse(process.argv);
}
