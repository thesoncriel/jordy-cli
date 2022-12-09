import {
  appendLogicCurried,
  compileTemplate,
  makeDirectory,
  readFile,
  writeFile,
} from './utils';
import { CodeFileWriter, CodeFileWriterService } from './CodeFileWriter';
import { AppendLogicDictionaryModel, BaseFeatureFileInfoDto } from './types';

export function createCodeFileWriterService<T extends BaseFeatureFileInfoDto>(
  appendLogics: AppendLogicDictionaryModel<T>
): CodeFileWriter<T> {
  return new CodeFileWriterService(
    readFile,
    compileTemplate,
    writeFile,
    makeDirectory,
    appendLogicCurried(appendLogics)
  );
}
