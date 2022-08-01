import { CodeFileWriter, CodeFileWriterService } from './CodeFileWriter';
import { FilePathParser } from './types';
import { TypeScriptFilePathParser } from './TypeScriptFilePathParser';
import {
  appendLogicCurried,
  compileTemplate,
  readFile,
  writeFile,
} from './utils';
import { appendLogics } from './appendLogics';

export function createFilePathParser(): FilePathParser {
  return new TypeScriptFilePathParser();
}

export function createCodeFileWriterService(): CodeFileWriter {
  return new CodeFileWriterService(
    readFile,
    compileTemplate,
    writeFile,
    appendLogicCurried(appendLogics)
  );
}
