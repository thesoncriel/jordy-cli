import { AppendLogicDictionaryModel, FeatureFileInfoDto } from './types';
import { difference } from 'lodash-es';

function appendWithoutDuplicates(
  prevCode: string,
  nextCode: string,
  _: FeatureFileInfoDto
) {
  const trimmedPrevCode = prevCode.trim();

  if (!trimmedPrevCode) {
    return nextCode;
  }

  const trimmedNextCode = nextCode.trim();

  const splittedPrevCode = trimmedPrevCode.split('\n');
  const prevCodeSet = new Set(splittedPrevCode);

  if (prevCodeSet.has(trimmedNextCode)) {
    return prevCode;
  }

  splittedPrevCode.push(trimmedNextCode);

  return `${splittedPrevCode.sort().join('\n')}\n`;
}

function appendReducers(
  prevCode: string,
  nextCode: string,
  _: FeatureFileInfoDto
) {
  const trimmedPrevCode = prevCode.trim();

  if (!trimmedPrevCode) {
    return nextCode;
  }

  const trimmedNextCode = nextCode.trim();

  const splittedPrevCode = prevCode.split('\n');
  const splittedNextCode = trimmedNextCode.split('\n');

  const diffLines = difference(splittedNextCode, splittedPrevCode);

  if (diffLines.length === 0) {
    return prevCode;
  }

  const result: string[] = [];
  let diffLinesIndex = 0;
  let isImportSection = true;
  let isExportSection = false;

  splittedPrevCode.forEach((prevLine, lineIndex) => {
    const nextLine = diffLines[diffLinesIndex] || '';

    if (prevLine.startsWith('export')) {
      isImportSection = false;
      isExportSection = true;
    }

    if (
      isImportSection &&
      lineIndex > 1 &&
      !prevLine &&
      nextLine.startsWith('import')
    ) {
      result.push(nextLine);

      diffLinesIndex++;
    } else if (
      isExportSection &&
      lineIndex > 4 &&
      (prevLine.endsWith('};') || prevLine.endsWith('});')) &&
      nextLine.endsWith('educer,')
    ) {
      result.push(nextLine);

      diffLinesIndex++;
    }

    result.push(prevLine);
  });

  return result.join('\n');
}

export const appendLogics: AppendLogicDictionaryModel = {
  appendWithoutDuplicates,
  appendReducers,
};
