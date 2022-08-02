import { FeatureFileInfo } from './FeatureFileInfo';
import { SimpleFileInfoDto } from './types';

describe('FeatureFileInfo->parse', () => {
  function parse(given: string) {
    return FeatureFileInfo.prototype.parse.call(
      null,
      given
    ) as SimpleFileInfoDto;
  }

  it('정상적인 파일 경로를 줄 경우, 올바르게 분석된다.', () => {
    const result = parse('lookpin.com');

    expect(result).toEqual({
      fileName: 'lookpin',
      fileExt: 'com',
      fileNameAsPascalCase: 'Lookpin',
    });
  });

  it('닷(.)이 여러개여도 올바르게 분석된다.', () => {
    const result = parse('lookpin.sample.effect.ts');

    expect(result).toEqual({
      fileName: 'lookpin.sample.effect',
      fileExt: 'ts',
      fileNameAsPascalCase: 'LookpinSampleEffect',
    });
  });

  it('비어있다면 오류를 일으킨다.', () => {
    expect(() => parse('')).toThrowError();
  });

  it('닷(.)이 하나도 없다면 오류를 일으킨다.', () => {
    expect(() => parse('blahblah_lookpin')).toThrowError();
  });
});
