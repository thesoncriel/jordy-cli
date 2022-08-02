import { Command } from 'commander';
import fs from 'fs/promises';
import { CLI_ASSETS_NAME } from './constants';
import { createCodeFileWriterService, createFilePathParser } from './factory';
import { CodeGeneratorModuleConfigDto } from './types';

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
  const service = createCodeFileWriterService();
  const defConfig = await getDefaultConfig();

  program
    .command('feat')
    .argument('<behavior>', 'add or rename')
    .argument('<name>', 'feature name')
    .argument('[next]', 'next feature name')
    .action((behavior, name, next) => {
      const names = name.split('/');
      const fileInfo = createFilePathParser().parse(names[0], names[1]);

      service.makeAll(defConfig.stores.storeRoot, fileInfo);
      service.makeAll(defConfig.stores.storeSub, fileInfo);
      service.makeAll(defConfig.stores.featureRoot, fileInfo);
      service.makeAll(defConfig.stores.srcRoot, fileInfo);

      console.log(behavior, name, next, fileInfo);
    });

  program
    .command('sub')
    .argument('<behavior>', 'add or rename')
    .argument('<name>', 'sub-feature name')
    .argument('[next]', 'next sub-feature name')
    .action((behavior, name, next) => {
      console.log(behavior, name, next);
    });

  program
    .command('ui')
    .argument('<behavior>', 'add or rename')
    .argument('<name>', 'ui-component name')
    .argument('[next]', 'next ui-component name')
    .action((behavior, name, next) => {
      console.log(behavior, name, next);
    });

  program
    .command('sb')
    .argument('<behavior>', 'add or title')
    .argument('<name>', 'storybook name or auto-reset')
    .action((behavior, name, next) => {
      console.log(behavior, name, next);
    });

  program.parse(process.argv);
}
