
import { Command } from 'commander';

const program = new Command();

/*
fe-cli feat add A
fe-cli feat rename A B
fe-cli sub add A/B
fe-cli sub rename A/B A/C
fe-cli ui add A/C
fe-cli ui rename A/C A/D
fe-cli sb add A/C
fe-cli sb title auto-reset
*/

program
  .command('feat')
  .argument('<behavior>', 'add or rename')
  .argument('<name>', 'feature name')
  .argument('[next]', 'next feature name')
  .action((behavior, name, next) => {
    console.log(behavior, name, next);
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
