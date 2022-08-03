import fs from 'node:fs/promises';
import { dirname } from 'path';
import { AppendLogicDictionaryModel, FeatureFileInfoDto } from './types';
import Handlebars from 'handlebars';
import { CLI_ASSETS_NAME } from './constants';

export function toCapitalize(value: string) {
  if (!value || typeof value !== 'string' || value.length === 0) {
    return '';
  }
  const trimmedValue = value.trim();

  if (trimmedValue.length === 1) {
    return trimmedValue.toUpperCase();
  }
  return `${trimmedValue.charAt(0).toUpperCase()}${trimmedValue.slice(1)}`;
}

export function isString(val: unknown): val is string {
  return typeof val === 'string' || val instanceof String;
}

export async function existsFile(filepath: string) {
  try {
    await fs.access(filepath);

    return true;
  } catch (error) {
    return false;
  }
}

export async function readFile(filepath: string) {
  let path = filepath;

  if (filepath.startsWith('{{defTemplates}}')) {
    path = filepath.replace(
      '{{defTemplates}}',
      `${__dirname}/../${CLI_ASSETS_NAME}/templates/`
    );
  }
  return fs.readFile(path, { encoding: 'utf8' });
}

export async function compileTemplate(
  templateText: string,
  data: FeatureFileInfoDto
) {
  const template = Handlebars.compile(templateText);

  const source = template(data);

  return source;
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

export function appendLineBreakToEOL(value: string) {
  if (value.length > 2 && value[value.length - 1] !== '\n') {
    return `${value}\n`;
  }
  return value;
}

export const appendLogicCurried =
  (logicDic: AppendLogicDictionaryModel) =>
  async (
    targetPath: string,
    nextCode: string,
    data: FeatureFileInfoDto,
    logic: string
  ) => {
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
