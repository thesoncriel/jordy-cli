import {
  CodeGeneratorComponentsConfigKeyType,
  StorybookKeyType,
} from './types';

export function getStorybookKey(
  componentKey: CodeGeneratorComponentsConfigKeyType,
): StorybookKeyType {
  let storybookKey = componentKey === 'memo' ? 'normal' : componentKey;

  if (componentKey === 'dialogWithResolver') {
    storybookKey = 'dialog';
  } else if (componentKey === 'antdTable') {
    storybookKey = 'normal';
  }

  return storybookKey as StorybookKeyType;
}
