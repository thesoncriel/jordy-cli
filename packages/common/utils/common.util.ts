import Handlebars from 'handlebars';
import { BaseFeatureFileInfoDto } from '../types';

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

export function getFileNameExcludeExt(path: string) {
  try {
    const splittedPath = path.split('/');

    return splittedPath[splittedPath.length - 1].split('.')[0];
  } catch (error) {
    return '';
  }
}
