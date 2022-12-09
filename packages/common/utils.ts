import fs from 'node:fs/promises';
import { dirname } from 'path';
import { CLI_ASSETS_NAME } from './constants';
import { AppendLogicDictionaryModel, BaseFeatureFileInfoDto } from './types';
import Handlebars from 'handlebars';

export function toCapitalize(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.map(toCapitalize).join('');
  }
  if (!value || typeof value !== 'string' || value.length === 0) {
    return '';
  }
  const trimmedValue = value.trim();

  if (trimmedValue.length === 1) {
    return trimmedValue.toUpperCase();
  }
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
}

export function snakeToCamel(str: string) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

export function toPascalCase(value: string) {
  return toCapitalize(snakeToCamel(value));
}

export function isString(val: unknown): val is string {
  return typeof val === 'string' || val instanceof String;
}

export function hasPathParameter(path: string) {
  return /\{[0-9A-z_\-.]+\}/.test(path);
}

export function filterByExcludesCurried(featureName: string) {
  return function filterByExcludes<T extends { excludes?: string[] }>({
    excludes,
  }: T) {
    if (excludes) {
      return excludes.includes(featureName) === false;
    }
    return true;
  };
}

export async function compileTemplate<T extends BaseFeatureFileInfoDto>(
  templateText: string,
  data: T
) {
  const template = Handlebars.compile(templateText);

  const source = template(data);

  return source;
}

export function appendLineBreakToEOL(value: string) {
  if (value.length > 2 && value[value.length - 1] !== '\n') {
    return `${value}\n`;
  }
  return value;
}

export async function existsFile(filepath: string) {
  try {
    await fs.access(filepath);

    return true;
  } catch (error) {
    return false;
  }
}

export async function makeDirectory(targetPath: string) {
  await fs.mkdir(targetPath, { recursive: true });

  return true;
}

export async function writeFile(
  targetPath: string,
  source: string,
  forceOverwrite: boolean
) {
  const isExists = await existsFile(targetPath);

  if (isExists) {
    if (!source) {
      return true;
    }
    if (!forceOverwrite) {
      throw new Error(`"${targetPath}" file already exists`);
    }
  }

  await fs.mkdir(dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, source, { encoding: 'utf8' });

  return true;
}

export async function readFile(filepath: string) {
  let path = filepath;

  if (filepath.startsWith('__defTemplates/')) {
    path = filepath.replace(
      '__defTemplates/',
      `${__dirname}/../${CLI_ASSETS_NAME}/templates/`
    );
  }
  return fs.readFile(path, { encoding: 'utf8' });
}

export const appendLogicCurried = (logicDic: AppendLogicDictionaryModel) =>
  async function <T extends BaseFeatureFileInfoDto>(
    targetPath: string,
    nextCode: string,
    data: T,
    logic: string
  ) {
    const fn = logicDic[logic];

    if (!fn) {
      throw new Error(
        `"${logic}" is not exist. append logic must be one of ${Object.keys(
          logicDic
        ).join(', ')}.`
      );
    }

    const prevCode = await readFile(targetPath);
    const newNextCode = fn(prevCode, nextCode, data);

    await fs.mkdir(dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, newNextCode, {
      encoding: 'utf8',
      flag: 'w',
    });

    return true;
  };
