import { FilePathParser } from './types';
import { TypeScriptFilePathParser } from './TypeScriptFilePathParser';

export function createFilePathParser(): FilePathParser {
  return new TypeScriptFilePathParser();
}
